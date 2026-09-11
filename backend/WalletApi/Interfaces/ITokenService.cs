using WalletApi.Data.Entities;

namespace WalletApi.Interfaces
{
    public interface ITokenService
    {
        string CrearToken(User user, IEnumerable<string> roles);
    }
}
