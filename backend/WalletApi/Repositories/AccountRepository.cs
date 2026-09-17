using Microsoft.EntityFrameworkCore;
using WalletApi.Data.Entities;
using WalletApi.Interfaces;
using WalletApi.Models;

namespace WalletApi.Repositories;

public class AccountRepository : IAccountRepository
{
    private readonly WalletContext _context;

    public AccountRepository(WalletContext context)
    {
        _context = context;
    }

    public async Task<Account?> ObtenerPorUserIdAsync(int userId)
    {
        return await _context.Accounts
            .FirstOrDefaultAsync(a => a.UserId == userId);
    }
}