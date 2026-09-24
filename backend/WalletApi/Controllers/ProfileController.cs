using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using WalletApi.Interfaces;
using WalletApi.Data.Entities;

namespace WalletApi.Controllers
{
    // Solo exigimos que estén logueados
    [Authorize]
    [Route("api/profile")]
    [ApiController]
    public class ProfileController : ControllerBase
    {

        private readonly IUserRepository _userRepository;
        private readonly UserManager<User> _userManager;

        public ProfileController(IUserRepository userRepository, UserManager<User> userManager)
        {
            _userRepository = userRepository;
            _userManager = userManager;
        }

        [HttpGet("me")]
        [Authorize]
        public ActionResult ObtenerUsuarioAutenticado()
        {

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new { message = "Token inválido o no autorizado" });
            }

            var user = _userRepository.ObtenerPorId(userId);

            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }


            return Ok(user);
        }

        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> ActualizarMiPerfil([FromBody] UpdateProfileDto request)
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
            {
                return BadRequest(new { message = "Este mail ya esta en uso, probá de nuevo." });
            }

            var user = _userRepository.ObtenerPorId(userId);
            if (user == null)
            {
                return NotFound(new { message = "Usuario no encontrado" });
            }

            bool emailChanged = !string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase);

            if (emailChanged)
            {
                if (string.IsNullOrEmpty(request.ContrasenaActual))
                {
                    return Unauthorized(new { message = "Contraseña actual incorrecta requerida para cambiar el email." });
                }

                bool isPasswordValid = await _userManager.CheckPasswordAsync(user, request.ContrasenaActual);
                if (!isPasswordValid)
                {
                    return BadRequest(new { message = "Contraseña actual incorrecta requerida para cambiar el email." });
                }


                var emailExists = _userRepository.ObtenerPorEmail(request.Email);
                if (emailExists != null && emailExists.Id != user.Id)
                {
                    return BadRequest(new { message = "El email ya esta en uso" });
                }

                user.Email = request.Email;
            }


            user.FirstName = request.FirstName;
            user.LastName = request.LastName;

            // Guardar cambios en el repositorio
            _userRepository.Actualizar(user);

            return Ok(new { message = "Perfil actualizado correctamente." });
        }
    }
}
