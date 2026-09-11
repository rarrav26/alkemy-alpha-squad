using WalletApi.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WalletApi.Models;
using WalletApi.Dtos;
using WalletApi.Data.Entities;
namespace WalletApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController(IUserRepository userRepository) : ControllerBase
    {
        private readonly IUserRepository _userRepository = userRepository;

        [HttpGet]
        public ActionResult<IReadOnlyList<User>> ObtenerTodas()
        {
            var users = _userRepository.ObtenerTodas();
            return Ok(users);
        }

        [HttpGet("{id:int}")]
        public ActionResult<User> ObtenerPorId(int id)
        {
            var user = _userRepository.ObtenerPorId(id);

            if (user == null)
                return NotFound();

            return Ok(user);
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
