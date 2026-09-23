using Microsoft.EntityFrameworkCore;
using WalletApi.Interfaces;
using WalletApi.Models;
using WalletApi.Data.Entities;
using WalletApi.Dtos;

namespace WalletApi.Repositories
{
    public class UserRepository(WalletContext walletContext) : IUserRepository
    {
        private readonly WalletContext _context = walletContext;

        public IReadOnlyList<User> ObtenerTodas()
        {
            return _context.Users.ToList();
        }

        public async Task<PagedUsersResponseDto> ObtenerUsuariosPaginadosAsync(int pagina, int porPagina)
        {
            var query = from user in _context.Users.Include(u => u.DocumentType).AsNoTracking()
                        join userRole in _context.UserRoles on user.Id equals userRole.UserId
                        join role in _context.Roles on userRole.RoleId equals role.Id
                        where role.NormalizedName == "USUARIO"
                        where !_context.UserRoles.Any(ur => ur.UserId == user.Id && _context.Roles.Any(r => r.Id == ur.RoleId && r.NormalizedName == "ADMINISTRADOR"))
                        select user;

            var totalRegistros = await query.CountAsync();
            var totalPaginas = (int)Math.Ceiling(totalRegistros / (double)porPagina);

            var usuarios = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((pagina - 1) * porPagina)
                .Take(porPagina)
                .Select(u => new UserListItemDto
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email ?? string.Empty,
                    DocumentType = u.DocumentType != null ? u.DocumentType.Code : string.Empty,
                    DocumentNumber = u.DocumentNumber,
                    IsActive = u.IsActive,
                    CreatedAt = u.CreatedAt,
                    Role = "Usuario"
                })
                .ToListAsync();

            return new PagedUsersResponseDto
            {
                TotalRegistros = totalRegistros,
                PaginaActual = pagina,
                PorPagina = porPagina,
                TotalPaginas = totalPaginas,
                Usuarios = usuarios
            };
        }

        public User? ObtenerPorId(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<UserDetailResponseDto?> ObtenerDetallePorIdAsync(int id)
        {
            var user = await _context.Users
                .Include(u => u.DocumentType)
                .Include(u => u.Accounts)
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
                return null;

            var role = await (from ur in _context.UserRoles
                              join r in _context.Roles on ur.RoleId equals r.Id
                              where ur.UserId == user.Id
                              select r.Name).FirstOrDefaultAsync() ?? "Usuario";

            var account = user.Accounts.FirstOrDefault();

            return new UserDetailResponseDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email ?? string.Empty,
                DocumentType = user.DocumentType != null ? user.DocumentType.Code : string.Empty,
                DocumentNumber = user.DocumentNumber,
                IsActive = user.IsActive,
                CreatedAt = user.CreatedAt,
                Role = role,
                Account = account != null ? new AccountResponseDto
                {
                    Id = account.Id,
                    Cvu = account.Cvu,
                    Alias = account.Alias,
                    Balance = account.Balance,
                    Currency = account.Currency,
                    CreatedAt = account.CreatedAt
                } : null
            };
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
