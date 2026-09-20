namespace WalletApi.Interfaces;

public interface IAliasGeneratorService
{
    Task<string> GenerateUniqueAliasAsync();
}
