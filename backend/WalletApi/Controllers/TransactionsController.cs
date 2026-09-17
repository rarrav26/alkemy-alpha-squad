using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WalletApi.Models;

[Authorize]
[ApiController]
[Route("api/[controller]")]

public class TransactionsController : ControllerBase
{
    private readonly WalletContext _context;

    public TransactionsController(WalletContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyTransactions([FromQuery] DateTime? fechaDesde,
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
                    .Where(t => t.SenderAccount.UserId == userId || t.ReceiverAccount.UserId == userId)
                    .Include(t => t.SenderAccount)
                    .Include(t => t.ReceiverAccount)
                    .AsQueryable();

        if (fechaDesde.HasValue)
        {
            query = query.Where(t => t.Date >= fechaDesde.Value);
        }
        if (fechaHasta.HasValue)
        {
            query = query.Where(t => t.Date <= fechaHasta.Value);
        }

        if (!string.IsNullOrEmpty(tipo) && tipo.ToLower() != "all" && tipo.ToLower() != "all")
        {
            if (tipo.ToLower() == "sent" || tipo.ToLower() == "debito")
            {
                query = query.Where(t => t.SenderAccount.UserId == userId);
            }
            else if (tipo.ToLower() == "recived" || tipo.ToLower() == "credito")
            {
                query = query.Where(t => t.ReceiverAccount.UserId == userId);
            }
        }

        var totalRegistros = await query.CountAsync();

        var transacciones = await query
            .OrderByDescending(t => t.Date)
            .Skip((pagina - 1) * porPagina)
            .Take(porPagina)
            .Select(t => new
            {
                t.Id,
                t.SenderAccountId,
                t.ReceiverAccountId,
                t.Amount,
                t.Date,
                Tipo = t.SenderAccount.UserId == userId ? "Débito" : "Crédito"
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
}