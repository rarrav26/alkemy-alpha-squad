using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using WalletApi.Models;

namespace WalletApi.Services;

public class CvuGeneratorService : ICvuGeneratorService
{
    private readonly WalletContext _context;
    private const string PspPrefix = "00000031"; // 8-digit DigitalArs PSP Prefix

    public CvuGeneratorService(WalletContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateUniqueCvuAsync()
    {
        const int maxAttempts = 20;

        for (var attempt = 0; attempt < maxAttempts; attempt++)
        {
            var cvu = GenerateRandomCvu();
            var exists = await _context.Accounts.AnyAsync(a => a.Cvu == cvu);
            if (!exists)
            {
                return cvu;
            }
        }

        throw new InvalidOperationException("Failed to generate a unique CVU after multiple attempts.");
    }

    private static string GenerateRandomCvu()
    {
        var sb = new StringBuilder(PspPrefix); // 8 digits
        
        // Append 14 random digits to reach exactly 22 digits
        for (var i = 0; i < 14; i++)
        {
            sb.Append(RandomNumberGenerator.GetInt32(0, 10));
        }

        return sb.ToString();
    }
}
