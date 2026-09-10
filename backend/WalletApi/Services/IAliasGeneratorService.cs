namespace WalletApi.Services;

public interface IAliasGeneratorService
{
    Task<string> GenerateUniqueAliasAsync();
}
