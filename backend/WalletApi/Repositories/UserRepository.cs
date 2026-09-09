using WalletApi.Interfaces;
using WalletApi.Models;

namespace WalletApi.Repositories
{
    public class UserRepository(WalletContext walletContext) : IUserRepository
    {
        private readonly WalletContext _context = walletContext;

        public IReadOnlyList<User> ObtenerTodas()
        {
            return _context.Users.ToList();
        }

        public User? ObtenerPorId(int id)
        {
            throw new NotImplementedException();
        }
        public User Crear(User user)
        {
            throw new NotImplementedException();
        }
        public bool Actualizar(User user)
        {
            throw new NotImplementedException();
        }

        public bool Eliminar(User user)
        {
            throw new NotImplementedException();
        }

    }
}
