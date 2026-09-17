using WalletApi.Data.Entities;

namespace WalletApi.Interfaces;

public interface IAccountRepository
{
    Task<Account?> ObtenerPorUserIdAsync(int userId);
}