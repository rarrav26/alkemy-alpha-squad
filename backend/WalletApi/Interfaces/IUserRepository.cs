using WalletApi.Models;
using WalletApi.Data.Entities;
namespace WalletApi.Interfaces
{
    public interface IUserRepository
    {
        IReadOnlyList<User> ObtenerTodas();
        User? ObtenerPorId(int id);
        User Crear(User user);
        User ObtenerPorEmail(string email);
        bool Actualizar(User user);
        bool Eliminar(User user);
    }
}
