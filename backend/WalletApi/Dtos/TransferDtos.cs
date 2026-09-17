using System.ComponentModel.DataAnnotations;

namespace WalletApi.Dtos;

public class TransferRequestDto
{
    [Required(ErrorMessage = "El destino (CVU o Alias) es obligatorio.")]
    public string Destination { get; set; } = string.Empty;

    [Required(ErrorMessage = "El importe es obligatorio.")]
    [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "El importe debe ser mayor a cero.")]
    public decimal Amount { get; set; }
}

public class TransferResponseDto
{
    public int DebitTransactionId { get; set; }
    public int CreditTransactionId { get; set; }
    public decimal Amount { get; set; }
    public decimal NewBalance { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public string RecipientAlias { get; set; } = string.Empty;
    public string RecipientCvu { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class RecipientLookupResponseDto
{
    public int AccountId { get; set; }
    public string RecipientName { get; set; } = string.Empty;
    public string Alias { get; set; } = string.Empty;
    public string Cvu { get; set; } = string.Empty;
}
