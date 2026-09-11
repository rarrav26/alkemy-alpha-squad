using WalletApi.Dtos;

namespace WalletApi.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<RegisterUserResponseDto> RegisterAsync(RegisterUserRequestDto request);
    Task<IReadOnlyList<DocumentTypeDto>> GetDocumentTypesAsync();
}
