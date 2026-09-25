using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using WalletApi.Models;

namespace WalletApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CardController : ControllerBase
    {
        private readonly WalletContext _context;

        public CardController(WalletContext context)
        {
            _context = context;
        }

        // 1. Obtener la tarjeta del usuario (si existe)
        [HttpGet("me")]
        public IActionResult GetMyCard()
        {
            int userId = GetUserId();
            var card = _context.VirtualCards.FirstOrDefault(c => c.UserId == userId);

            if (card == null) return NotFound(new { message = "No tienes una tarjeta virtual creada." });

            return Ok(card);
        }

        // 2. Crear una nueva tarjeta virtual simulada
        [HttpPost("create")]
        public IActionResult CreateCard()
        {
            int userId = GetUserId();

            // REGLA: Una única tarjeta activa por cuenta
            bool alreadyHasCard = _context.VirtualCards.Any(c => c.UserId == userId);
            if (alreadyHasCard)
            {
                return BadRequest(new { message = "Ya tienes una tarjeta virtual asociada a tu cuenta." });
            }

            // REGLA: Generar número, vencimiento y código simulados
            var random = new Random();

            // Genera un número de 16 dígitos empezando con 4 (estilo Visa)
            string cardNumber = "4" + string.Join("", Enumerable.Range(0, 15).Select(_ => random.Next(0, 10).ToString()));

            // Vencimiento a 4 años desde hoy
            string expiration = DateTime.Now.AddYears(4).ToString("MM/yy");

            // CVV de 3 dígitos
            string cvv = random.Next(100, 1000).ToString();

            var newCard = new VirtualCard
            {
                UserId = userId,
                CardNumber = cardNumber,
                ExpirationDate = expiration,
                Cvv = cvv,
                IsFrozen = false
            };

            _context.VirtualCards.Add(newCard);
            _context.SaveChanges();

            return Ok(newCard);
        }

        // 3. Congelar / Descongelar tarjeta
        [HttpPut("toggle-freeze")]
        public IActionResult ToggleFreeze()
        {
            int userId = GetUserId();
            var card = _context.VirtualCards.FirstOrDefault(c => c.UserId == userId);

            if (card == null) return NotFound(new { message = "Tarjeta no encontrada." });

            // Invierte el estado actual
            card.IsFrozen = !card.IsFrozen;
            _context.SaveChanges();

            string status = card.IsFrozen ? "congelada" : "descongelada";
            return Ok(new { message = $"Tu tarjeta ha sido {status} exitosamente.", isFrozen = card.IsFrozen });
        }

        private int GetUserId()
        {
            return int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        }
    }
}