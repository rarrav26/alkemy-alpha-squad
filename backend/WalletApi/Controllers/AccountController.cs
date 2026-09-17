using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WalletApi.Dtos;
using WalletApi.Interfaces;

namespace WalletApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountController : ControllerBase
{
    private readonly IAccountRepository _accountRepository;

    public AccountController(IAccountRepository accountRepository)
    {
        _accountRepository = accountRepository;
    }

    [HttpGet("me")]
    public async Task<ActionResult<AccountResponseDto>> ObtenerMiCuenta()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized(new { mensaje = "Token inválido o expirado." });
        }

        var account = await _accountRepository.ObtenerPorUserIdAsync(userId);

        if (account == null)
        {
            return NotFound(new { mensaje = "No se encontró una cuenta asociada a este usuario." });
        }

        var response = new AccountResponseDto
        {
            Id = account.Id,
            Cvu = account.Cvu,
            Alias = account.Alias,
            Balance = account.Balance,
            Currency = account.Currency
        };

        return Ok(response);
    }
}