using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WalletApi.Dtos;
using WalletApi.Interfaces;

namespace WalletApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    /// <summary>
    /// Obtiene las notificaciones del usuario autenticado ordenadas de forma cronológica descendente.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<NotificationListResponseDto>> GetMyNotifications(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50)
    {
        var userId = GetCurrentUserId();
        var result = await _notificationService.GetUserNotificationsAsync(userId, page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Obtiene el conteo de notificaciones no leídas del usuario autenticado.
    /// </summary>
    [HttpGet("unread-count")]
    public async Task<ActionResult<UnreadCountResponseDto>> GetUnreadCount()
    {
        var userId = GetCurrentUserId();
        var count = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(new UnreadCountResponseDto { UnreadCount = count });
    }

    /// <summary>
    /// Marca una notificación específica como leída.
    /// </summary>
    [HttpPatch("{id:int}/read")]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var userId = GetCurrentUserId();
        await _notificationService.MarkAsReadAsync(userId, id);
        return Ok(new { message = "Notificación marcada como leída.", id });
    }

    /// <summary>
    /// Marca todas las notificaciones del usuario autenticado como leídas.
    /// </summary>
    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = GetCurrentUserId();
        var updatedCount = await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(new { message = "Todas las notificaciones fueron marcadas como leídas.", updatedCount });
    }

    /// <summary>
    /// Elimina una notificación específica del usuario.
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetCurrentUserId();
        await _notificationService.DeleteNotificationAsync(userId, id);
        return Ok(new { message = "Notificación eliminada exitosamente.", id });
    }

    /// <summary>
    /// Elimina todas las notificaciones del usuario autenticado (limpieza de bandeja).
    /// </summary>
    [HttpDelete]
    public async Task<IActionResult> ClearAll()
    {
        var userId = GetCurrentUserId();
        var deletedCount = await _notificationService.ClearAllNotificationsAsync(userId);
        return Ok(new { message = "Todas las notificaciones han sido eliminadas.", deletedCount });
    }

    private int GetCurrentUserId()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? User.FindFirstValue("sub");

        if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
        {
            throw new UnauthorizedAccessException("Usuario no autenticado.");
        }

        return userId;
    }
}
