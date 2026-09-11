using System.ComponentModel.DataAnnotations;

namespace WalletApi.Dtos;

public class LoginRequest
{
    [Required]
    public string Usuario { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
