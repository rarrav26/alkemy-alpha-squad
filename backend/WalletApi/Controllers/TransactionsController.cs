using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WalletApi.Dtos;
using WalletApi.Models;
using WalletApi.Services;
using WalletApi.Interfaces;

namespace WalletApi.Controllers;

[Authorize] // <--- ¡AQUÍ ESTÁ EL AUTHORIZE que protege todo el controlador!
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly WalletContext _context;
    private readonly IAccountService _accountService;
    private readonly ILogger<TransactionsController> _logger;

    public TransactionsController(
        WalletContext context,
        IAccountService accountService,
        ILogger<TransactionsController> logger)
    {
        _context = context;
        _accountService = accountService;
        _logger = logger;
    }

    /// Historial de movimientos del usuario autenticado (paginado y filtrado).
    [HttpGet]
    public async Task<IActionResult> GetMyTransactions(
        [FromQuery] DateTime? fechaDesde,
        [FromQuery] DateTime? fechaHasta,
        [FromQuery] string? tipo,
        [FromQuery] int pagina = 1,
        [FromQuery] int porPagina = 10)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
        {
            return Unauthorized();
        }

        var query = _context.Transactions
            .Include(t => t.Account)
            .Include(t => t.CounterpartAccount)
                .ThenInclude(ca => ca!.User)
            .Where(t => t.Account.UserId == userId)
            .AsQueryable();

        if (fechaDesde.HasValue)
        {
            query = query.Where(t => t.CreatedAt >= fechaDesde.Value);
        }
        if (fechaHasta.HasValue)
        {
            query = query.Where(t => t.CreatedAt <= fechaHasta.Value);
        }

        if (!string.IsNullOrEmpty(tipo) && tipo.ToLower() != "all")
        {
            var tipoLower = tipo.ToLower();
            if (tipoLower == "sent" || tipoLower == "debito" || tipoLower == "debit")
            {
                query = query.Where(t => t.Type == "debit");
            }
            else if (tipoLower == "received" || tipoLower == "recived" || tipoLower == "credito" || tipoLower == "credit")
            {
                query = query.Where(t => t.Type == "credit" || t.Type == "deposit");
            }
        }

        var totalRegistros = await query.CountAsync();

        var transacciones = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((pagina - 1) * porPagina)
            .Take(porPagina)
            .Select(t => new
            {
                t.Id,
                t.AccountId,
                t.Amount,
                Date = t.CreatedAt,
                Tipo = (t.Type == "credit" || t.Type == "deposit") ? "Crédito" : "Débito",
                t.Description,
                t.CounterpartAccountId
            })
            .ToListAsync();

        return Ok(new
        {
            totalRegistros,
            paginaActual = pagina,
            porPagina,
            totalPaginas = (int)Math.Ceiling(totalRegistros / (double)porPagina),
            transacciones
        });
    }

    /// <summary>
    /// Consulta destinatario usando los Claims del usuario autenticado
    /// </summary>
    [HttpGet("lookup")]
    public async Task<IActionResult> LookupRecipient([FromQuery] string destination)
    {
        // ¡AQUÍ ESTÁN LOS CLAIMS! Extrae el ID del usuario del Token JWT
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
        {
            return Unauthorized(new { message = "Usuario no autenticado." });
        }

        try
        {
            var result = await _accountService.LookupRecipientAsync(userId, destination);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Transfiere dinero validando el ModelState y el Claim de identidad
    /// </summary>
    [HttpPost("transfer")]
    public async Task<IActionResult> Transfer([FromBody] TransferRequestDto request)
    {
        // Valida las DataAnnotations del DTO ([Required], etc.)
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // ¡AQUÍ ESTÁN LOS CLAIMS!
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
        {
            return Unauthorized(new { message = "Usuario no autenticado." });
        }

        try
        {
            var result = await _accountService.TransferAsync(userId, request);
            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}