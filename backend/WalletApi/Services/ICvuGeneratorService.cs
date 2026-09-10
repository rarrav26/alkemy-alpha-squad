namespace WalletApi.Services;

public interface ICvuGeneratorService
{
    Task<string> GenerateUniqueCvuAsync();
}
