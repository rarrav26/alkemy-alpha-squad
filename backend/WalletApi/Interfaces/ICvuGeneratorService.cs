namespace WalletApi.Interfaces;

public interface ICvuGeneratorService
{
    Task<string> GenerateUniqueCvuAsync();
}
