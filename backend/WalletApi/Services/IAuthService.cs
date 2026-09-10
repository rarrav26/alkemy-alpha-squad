using WalletApi.Dtos;

namespace WalletApi.Services;

public interface IAuthService
{
    Task<RegisterUserResponseDto> RegisterAsync(RegisterUserRequestDto request);
    Task<IReadOnlyList<DocumentTypeDto>> GetDocumentTypesAsync();
}
