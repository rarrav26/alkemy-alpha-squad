using WalletApi.Models;
using WalletApi.Data.Entities;
namespace WalletApi.Interfaces
{
    public interface IUserRepository
    {
        IReadOnlyList<User> ObtenerTodas();
        User? ObtenerPorId(int id);
        User Crear(User user);
        bool Actualizar(User user);
        bool Eliminar(User user);
    }
}
