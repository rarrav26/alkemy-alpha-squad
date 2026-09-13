using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WalletApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    [HttpGet("ping")]
    [Authorize]
    public IActionResult Ping()
    {
        return Ok("Token válido");
    }
   
   
   
   
   /*Endpoint para probar la autorización basada en roles. Puedes descomentar estos métodos para probarlos.
    [HttpGet("solo-admin")]
    [Authorize(Roles = "Administrador")]
    public IActionResult TestAdmin()
    {
        return Ok
   ---------------------------------------------------
    [HttpGet("solo-admin")]
    [Authorize(Roles = "Administrador")]
    public IActionResult TestAdmin(){
        return Ok("¡Éxito! Tienes permisos de Administrador.");
    }
    [HttpGet("solo-usuario")]
    [Authorize(Roles = "Usuario")]
    public IActionResult TestUsuario()
    {
        return Ok("¡Éxito! Tienes permisos de Usuario estándar.");
    }*/
}


