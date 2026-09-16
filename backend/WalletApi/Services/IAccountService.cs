using WalletApi.Dtos;

namespace WalletApi.Services;

public interface IAccountService
{
    Task<DepositResponseDto> DepositAsync(int userId, DepositRequestDto request);
    Task<AccountDto> GetBalanceAsync(int userId);
}
