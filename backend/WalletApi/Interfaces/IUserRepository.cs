using WalletApi.Models;
using WalletApi.Data.Entities;
using WalletApi.Dtos;

namespace WalletApi.Interfaces
{
    public interface IUserRepository
    {
        IReadOnlyList<User> ObtenerTodas();
        Task<PagedUsersResponseDto> ObtenerUsuariosPaginadosAsync(int pagina, int porPagina);
        User? ObtenerPorId(int id);
        Task<UserDetailResponseDto?> ObtenerDetallePorIdAsync(int id);
        Task<UserDetailResponseDto> CrearUsuarioPorAdminAsync(CreateUserAdminRequestDto request);
        Task<UserDetailResponseDto> ActualizarUsuarioPorAdminAsync(int id, UpdateUserAdminRequestDto request);
        Task<UserDetailResponseDto> CambiarEstadoUsuarioPorAdminAsync(int id, bool isActive);
        User Crear(User user);
        User ObtenerPorEmail(string email);
        bool Actualizar(User user);
        bool Eliminar(User user);
    }
}
