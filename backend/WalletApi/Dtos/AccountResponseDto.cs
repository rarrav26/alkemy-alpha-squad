namespace WalletApi.Dtos;

public class AccountResponseDto
{
    public int Id { get; set; }
    public string Cvu { get; set; } = string.Empty;
    public string Alias { get; set; } = string.Empty;
    public decimal Balance { get; set; }
    public string Currency { get; set; } = "ARS";
}