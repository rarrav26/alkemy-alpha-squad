using WalletApi.Interfaces;
using WalletApi.Models;
using WalletApi.Data.Entities;
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
            return _context.Users.FirstOrDefault(u => u.Id == id);

        }
        public User? ObtenerPorEmail(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }
        public User Crear(User user)
        {
            throw new NotImplementedException();

        }
        public bool Actualizar(User user)
        {
            try
            {
                // 1. Marca el usuario como modificado
                _context.Users.Update(user);

                // 2. Guarda los cambios y cuenta cuántas filas se vieron afectadas
                int filasAfectadas = _context.SaveChanges();

                // 3. Retorna true si se actualizó al menos 1 fila
                return filasAfectadas > 0;
            }
            catch (Exception ex)
            {
                // Si hay algún error en la base de datos (ej. se corta la conexión), atrapa el error y devuelve false
                Console.WriteLine($"Error al actualizar usuario: {ex.Message}");
                return false;
            }
        }

        public bool Eliminar(User user)
        {
            throw new NotImplementedException();
        }

    }
}
