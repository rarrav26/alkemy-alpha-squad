using System.ComponentModel.DataAnnotations;

namespace WalletApi.Dtos
{
    public class LoginResponse
    {
        public string UserId { get; set; }
        public string Email { get; set; }
        public string Message { get; set; }
    }
}