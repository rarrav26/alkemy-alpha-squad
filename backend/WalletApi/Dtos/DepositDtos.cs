using System.ComponentModel.DataAnnotations;

namespace WalletApi.Dtos;

public class DepositRequestDto
{
    [Required(ErrorMessage = "El importe es obligatorio.")]
    [Range(0.01, (double)decimal.MaxValue, ErrorMessage = "El importe debe ser mayor a cero.")]
    public decimal Amount { get; set; }
}

public class DepositResponseDto
{
    public int TransactionId { get; set; }
    public decimal Amount { get; set; }
    public decimal NewBalance { get; set; }
    public DateTime Date { get; set; }
    public string Message { get; set; } = string.Empty;
}
