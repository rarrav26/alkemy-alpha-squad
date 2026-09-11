using System.ComponentModel.DataAnnotations;

namespace WalletApi.Dtos
{
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}

public class LoginResponseDto
{
    public string UserId { get; set; }
    public string Email { get; set; }
    public string Message { get; set; }
}
