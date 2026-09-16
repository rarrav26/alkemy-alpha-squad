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
}
