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
        User Crear(User user);
        bool Actualizar(User user);
        bool Eliminar(User user);
    }
}
