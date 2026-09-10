using System.ComponentModel.DataAnnotations;

namespace WalletApi.Dtos;

public class RegisterUserRequestDto
{
    [Required(ErrorMessage = "First name is required.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "First name must be between 2 and 50 characters.")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Last name is required.")]
    [StringLength(50, MinimumLength = 2, ErrorMessage = "Last name must be between 2 and 50 characters.")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Document type is required.")]
    [Range(1, int.MaxValue, ErrorMessage = "Invalid document type.")]
    public int DocumentTypeId { get; set; }

    [Required(ErrorMessage = "Document number is required.")]
    [StringLength(30, MinimumLength = 4, ErrorMessage = "Document number must be between 4 and 30 characters.")]
    public string DocumentNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Invalid email format.")]
    [StringLength(250, ErrorMessage = "Email cannot exceed 250 characters.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters long.")]
    public string Password { get; set; } = string.Empty;
}

public class AccountDto
{
    public int Id { get; set; }
    public decimal Balance { get; set; }
    public string Currency { get; set; } = "ARS";
    public string Alias { get; set; } = string.Empty;
    public string Cvu { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class RegisterUserResponseDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int DocumentTypeId { get; set; }
    public string DocumentTypeCode { get; set; } = string.Empty;
    public string DocumentNumber { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public AccountDto Account { get; set; } = null!;
}

public class DocumentTypeDto
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}
