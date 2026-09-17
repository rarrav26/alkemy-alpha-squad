using Microsoft.EntityFrameworkCore;
using WalletApi.Data.Entities;
using WalletApi.Dtos;
using WalletApi.Models;

namespace WalletApi.Services;

public class AccountService : IAccountService
{
    private readonly WalletContext _context;

    public AccountService(WalletContext context)
    {
        _context = context;
    }

    public async Task<DepositResponseDto> DepositAsync(int userId, DepositRequestDto request)
    {
        // Validar que el importe tenga como máximo 2 decimales
        if (decimal.Round(request.Amount, 2) != request.Amount)
        {
            throw new ArgumentException("El importe no puede tener más de 2 decimales.");
        }

        if (request.Amount <= 0)
        {
            throw new ArgumentException("El importe debe ser mayor a cero.");
        }

        // Buscar la cuenta del usuario autenticado
        var account = await _context.Accounts
            .FirstOrDefaultAsync(a => a.UserId == userId);

        if (account == null)
        {
            throw new InvalidOperationException("No se encontró una cuenta asociada al usuario.");
        }

        // Crear la transacción y actualizar el saldo dentro de una transacción de BD
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var now = DateTime.UtcNow;

            var deposit = new Transaction
            {
                AccountId = account.Id,
                Amount = request.Amount,
                Type = "credit",
                Description = "Depósito",
                CreatedAt = now
            };

            _context.Transactions.Add(deposit);
            account.Balance += request.Amount;

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return new DepositResponseDto
            {
                TransactionId = deposit.Id,
                Amount = deposit.Amount,
                NewBalance = account.Balance,
                Date = deposit.CreatedAt,
                Message = "Depósito realizado con éxito."
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<AccountDto> GetBalanceAsync(int userId)
    {
        var account = await _context.Accounts
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.UserId == userId);

        if (account == null)
        {
            throw new InvalidOperationException("No se encontró una cuenta asociada al usuario.");
        }

        return new AccountDto
        {
            Id = account.Id,
            Balance = account.Balance,
            Currency = account.Currency,
            Alias = account.Alias,
            Cvu = account.Cvu,
            CreatedAt = account.CreatedAt
        };
    }

    public async Task<RecipientLookupResponseDto> LookupRecipientAsync(int currentUserId, string destination)
    {
        var trimmed = destination?.Trim() ?? string.Empty;
        var (isValid, isCvu) = ValidateDestinationFormat(trimmed);

        if (!isValid)
        {
            throw new ArgumentException("El destino ingresado debe ser un CVU válido (22 dígitos) o un Alias (palabras separadas por puntos).");
        }

        var query = _context.Accounts.Include(a => a.User).AsNoTracking();
        var targetAccount = isCvu
            ? await query.FirstOrDefaultAsync(a => a.Cvu == trimmed)
            : await query.FirstOrDefaultAsync(a => a.Alias == trimmed.ToLowerInvariant());

        if (targetAccount == null)
        {
            throw new KeyNotFoundException("No se encontró ninguna cuenta con el Alias o CVU ingresado.");
        }

        if (targetAccount.UserId == currentUserId)
        {
            throw new InvalidOperationException("No podés transferir dinero a tu propia cuenta.");
        }

        if (targetAccount.User == null || !targetAccount.User.IsActive)
        {
            throw new InvalidOperationException("La cuenta de destino pertenece a un usuario inactivo.");
        }

        return new RecipientLookupResponseDto
        {
            AccountId = targetAccount.Id,
            RecipientName = $"{targetAccount.User.FirstName} {targetAccount.User.LastName}".Trim(),
            Alias = targetAccount.Alias,
            Cvu = targetAccount.Cvu
        };
    }

    public async Task<TransferResponseDto> TransferAsync(int currentUserId, TransferRequestDto request)
    {
        // 1. Validar importe
        if (decimal.Round(request.Amount, 2) != request.Amount)
        {
            throw new ArgumentException("El importe no puede tener más de 2 decimales.");
        }

        if (request.Amount <= 0)
        {
            throw new ArgumentException("El importe debe ser mayor a cero.");
        }

        // 2. Validar usuario origen y cuenta
        var sourceUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);
        if (sourceUser == null || !sourceUser.IsActive)
        {
            throw new InvalidOperationException("El usuario de origen no está activo para operar.");
        }

        var sourceAccount = await _context.Accounts.FirstOrDefaultAsync(a => a.UserId == currentUserId);
        if (sourceAccount == null)
        {
            throw new InvalidOperationException("No se encontró una cuenta asociada al usuario autenticado.");
        }

        if (sourceAccount.Balance < request.Amount)
        {
            throw new InvalidOperationException("Saldo insuficiente para realizar la transferencia.");
        }

        // 3. Validar destino
        var trimmed = request.Destination?.Trim() ?? string.Empty;
        var (isValid, isCvu) = ValidateDestinationFormat(trimmed);

        if (!isValid)
        {
            throw new ArgumentException("El destino ingresado debe ser un CVU válido (22 dígitos) o un Alias (palabras separadas por puntos).");
        }

        var targetAccount = isCvu
            ? await _context.Accounts.Include(a => a.User).FirstOrDefaultAsync(a => a.Cvu == trimmed)
            : await _context.Accounts.Include(a => a.User).FirstOrDefaultAsync(a => a.Alias == trimmed.ToLowerInvariant());

        if (targetAccount == null)
        {
            throw new KeyNotFoundException("No se encontró ninguna cuenta con el Alias o CVU ingresado.");
        }

        if (targetAccount.UserId == currentUserId)
        {
            throw new InvalidOperationException("No podés transferir dinero a tu propia cuenta.");
        }

        if (targetAccount.User == null || !targetAccount.User.IsActive)
        {
            throw new InvalidOperationException("La cuenta de destino pertenece a un usuario inactivo.");
        }

        // 4. Operación atómica de débito y crédito
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            sourceAccount.Balance -= request.Amount;
            if (sourceAccount.Balance < 0)
            {
                throw new InvalidOperationException("Saldo insuficiente. La cuenta no puede quedar en negativo.");
            }

            targetAccount.Balance += request.Amount;

            var now = DateTime.UtcNow;
            var destFullName = $"{targetAccount.User.FirstName} {targetAccount.User.LastName}".Trim();
            var sourceFullName = $"{sourceUser.FirstName} {sourceUser.LastName}".Trim();

            // Movimiento 1: Débito en origen
            var debitTx = new Transaction
            {
                AccountId = sourceAccount.Id,
                Amount = request.Amount,
                Type = "debit",
                Description = $"Transferencia enviada a {destFullName} ({targetAccount.Alias})",
                CreatedAt = now
            };
            _context.Transactions.Add(debitTx);
            await _context.SaveChangesAsync();

            // Movimiento 2: Crédito en destino vinculado al débito
            var creditTx = new Transaction
            {
                AccountId = targetAccount.Id,
                Amount = request.Amount,
                Type = "credit",
                Description = $"Transferencia recibida de {sourceFullName} ({sourceAccount.Alias})",
                CreatedAt = now,
                RelatedTransactionId = debitTx.Id
            };
            _context.Transactions.Add(creditTx);
            await _context.SaveChangesAsync();

            // Vinculación bidireccional
            debitTx.RelatedTransactionId = creditTx.Id;
            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return new TransferResponseDto
            {
                DebitTransactionId = debitTx.Id,
                CreditTransactionId = creditTx.Id,
                Amount = request.Amount,
                NewBalance = sourceAccount.Balance,
                RecipientName = destFullName,
                RecipientAlias = targetAccount.Alias,
                RecipientCvu = targetAccount.Cvu,
                Date = debitTx.CreatedAt,
                Message = "Transferencia realizada con éxito."
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private static (bool IsValid, bool IsCvu) ValidateDestinationFormat(string destination)
    {
        if (string.IsNullOrWhiteSpace(destination))
        {
            return (false, false);
        }

        // CVU: exactamente 22 dígitos numéricos
        if (System.Text.RegularExpressions.Regex.IsMatch(destination, @"^\d{22}$"))
        {
            return (true, true);
        }

        // Alias: al menos 3 palabras separadas por puntos (opcionalmente con sufijo numérico)
        if (System.Text.RegularExpressions.Regex.IsMatch(destination, @"^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+){2}(\.[0-9]+)?$", System.Text.RegularExpressions.RegexOptions.IgnoreCase))
        {
            return (true, false);
        }

        return (false, false);
    }
}
