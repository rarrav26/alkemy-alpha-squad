namespace WalletApi.Models;

public class Account
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public decimal Balance { get; set; } = 0m;

    public string Currency { get; set; } = "ARS";

    public string Alias { get; set; } = string.Empty;

    public string Cvu { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual User User { get; set; } = null!;

    public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}
