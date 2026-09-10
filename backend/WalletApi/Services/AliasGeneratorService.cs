using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using WalletApi.Models;

namespace WalletApi.Services;

public class AliasGeneratorService : IAliasGeneratorService
{
    private readonly WalletContext _context;

    private static readonly string[] Words =
    [
        "auto", "perro", "gato", "sol", "luna", "mar", "rio", "cielo", "nube", "roca",
        "arbol", "flor", "hoja", "bosque", "valle", "monte", "campo", "camino", "puente", "barco",
        "tren", "avion", "casa", "estrella", "cometa", "viento", "fuego", "tierra", "agua", "brisa",
        "nieve", "trueno", "rayo", "eco", "luz", "sombra", "verde", "azul", "rojo", "dorado",
        "plata", "rubi", "amigo", "mate", "cafe", "playa", "isla", "costa", "sendero", "cumbre",
        "pampa", "rioja", "cordoba", "salta", "neuquen", "chaco", "mendoza", "tucuman", "jujuy", "sur",
        "norte", "este", "oeste", "puma", "aguila", "condor", "delfin", "ballena", "zorro", "ciervo"
    ];

    public AliasGeneratorService(WalletContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateUniqueAliasAsync()
    {
        const int maxAttempts = 20;

        for (var attempt = 0; attempt < maxAttempts; attempt++)
        {
            var alias = GenerateRandomAlias();
            var exists = await _context.Accounts.AnyAsync(a => a.Alias == alias);
            if (!exists)
            {
                return alias;
            }
        }

        // Fallback: append a random 3-digit suffix if collisions occur
        return $"{GenerateRandomAlias()}.{RandomNumberGenerator.GetInt32(100, 999)}";
    }

    private static string GenerateRandomAlias()
    {
        var selectedIndices = new HashSet<int>();
        while (selectedIndices.Count < 3)
        {
            selectedIndices.Add(RandomNumberGenerator.GetInt32(0, Words.Length));
        }

        var words = selectedIndices.Select(i => Words[i]).ToArray();
        return string.Join(".", words);
    }
}
