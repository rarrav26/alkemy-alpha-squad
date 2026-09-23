using WalletApi.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WalletApi.Models;
using WalletApi.Dtos;
using WalletApi.Data.Entities;
namespace WalletApi.Controllers
{
    [Authorize(Roles = "Administrador")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserRepository userRepository) : ControllerBase
    {
        private readonly IUserRepository _userRepository = userRepository;

        [HttpGet]
        public async Task<ActionResult<PagedUsersResponseDto>> ObtenerUsuarios(
            [FromQuery] int pagina = 1,
            [FromQuery] int porPagina = 10)
        {
            if (pagina < 1) pagina = 1;
            if (porPagina < 1 || porPagina > 100) porPagina = 10;

            var resultado = await _userRepository.ObtenerUsuariosPaginadosAsync(pagina, porPagina);
            return Ok(resultado);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(UserDetailResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserDetailResponseDto>> ObtenerPorId(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { message = "El identificador de usuario debe ser mayor a cero." });
            }

            var user = await _userRepository.ObtenerDetallePorIdAsync(id);

            if (user == null)
            {
                return NotFound(new { message = $"No se encontró el usuario con ID {id}." });
            }

            return Ok(user);
        }

        [HttpPost]
        [ProducesResponseType(typeof(UserDetailResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<UserDetailResponseDto>> CrearUsuario([FromBody] CreateUserAdminRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var usuarioCreado = await _userRepository.CrearUsuarioPorAdminAsync(request);

                return CreatedAtAction(
                    nameof(ObtenerPorId),
                    new { id = usuarioCreado.Id },
                    usuarioCreado
                );
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Ocurrió un error inesperado al crear el usuario." });
            }
        }

        [HttpPost("{id:int}")]
        public ActionResult<User> Actualizar(int id, GuardarUserRequest request)
        {

            var user = new User
            {
                Id = id,
                FirstName = request.FirstName,
                LastName = request.LastName,
                DocumentTypeId = request.DocumentTypeId,
                DocumentNumber = request.DocumentNumber
            };
            var userCreado = _userRepository.Crear(user);

            return CreatedAtAction(
                           nameof(ObtenerPorId),
                           new { id = userCreado.Id },
                           userCreado
                       );
        }

        [HttpDelete("{id:int}")]
        public ActionResult<User> Eliminar(int id)
        {
            if (id <= 0)
                return BadRequest();

            var userSearched = _userRepository.ObtenerPorId(id);

            if (userSearched == null)
                return BadRequest();

            var userEliminadoCorrectamente = _userRepository.Eliminar(userSearched);
            if (!userEliminadoCorrectamente)
                return NotFound();

            return NoContent();
        }
    }
}
