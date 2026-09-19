using WalletApi.Dtos;

namespace WalletApi.Services;

public interface IAccountService
{
    Task<DepositResponseDto> DepositAsync(int userId, DepositRequestDto request);
    Task<AccountDto> GetBalanceAsync(int userId);
    Task<RecipientLookupResponseDto> LookupRecipientAsync(int userId, string destination);
    Task<TransferResponseDto> TransferAsync(int userId, TransferRequestDto request);
    Task<List<TransactionDto>> GetTransactionsAsync(int userId, int page = 1, int pageSize = 20);


}
