namespace WalletApi.Interfaces;

public interface ITokenService
{
    string CrearToken(int usuarioId, string nombreUsuario, string rol);
}
