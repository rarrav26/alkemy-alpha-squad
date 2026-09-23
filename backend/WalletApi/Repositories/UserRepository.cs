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
