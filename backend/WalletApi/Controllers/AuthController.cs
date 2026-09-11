using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletApi.Dtos;
using WalletApi.Interfaces;

namespace WalletApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController(ITokenService tokenService) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("login")]
    public ActionResult Login(LoginRequest request)
    {
        if (request.Password != "wallet123")
        {
            return Unauthorized(new { mensaje = "Credenciales inválidas" });
        }

        var rol = request.Usuario.ToLowerInvariant() switch
        {
            "admin" => "Administrador",
            "usuario" => "Usuario",
            _ => null
        };

        if (rol == null)
        {
            return Unauthorized(new { mensaje = "Credenciales inválidas" });
        }

        var usuarioId = rol == "Administrador" ? 1 : 2;

        var token = tokenService.CrearToken(usuarioId, request.Usuario, rol);

        return Ok(new { accessToken = token, rol });
    }

    [Authorize]
    [HttpGet("test")]
    public ActionResult Test()
    {
        return Ok(new { mensaje = "Token válido", usuario = User.Identity?.Name });
    }
}
