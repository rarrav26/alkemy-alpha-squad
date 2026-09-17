using WalletApi.Dtos;

namespace WalletApi.Services;

public interface IAccountService
{
    Task<DepositResponseDto> DepositAsync(int userId, DepositRequestDto request);
    Task<AccountDto> GetBalanceAsync(int userId);
    Task<RecipientLookupResponseDto> LookupRecipientAsync(int currentUserId, string destination);
    Task<TransferResponseDto> TransferAsync(int currentUserId, TransferRequestDto request);
}
