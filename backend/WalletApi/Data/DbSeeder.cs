using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using WalletApi.Data.Entities;
using WalletApi.Interfaces;

namespace WalletApi.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(
        RoleManager<IdentityRole<int>> roleManager,
        UserManager<User> userManager,
        IConfiguration configuration,
        IAccountService accountService,
        ILogger logger)
    {
        // 1. Ensure roles
        string[] roles = ["Usuario", "Administrador"];

        foreach (var roleName in roles)
        {
            var exists = await roleManager.RoleExistsAsync(roleName);
            if (!exists)
            {
                var role = new IdentityRole<int>(roleName);
                var result = await roleManager.CreateAsync(role);
                if (!result.Succeeded)
                {
                    logger.LogError("Error creating role {RoleName}: {Errors}", roleName, string.Join(',', result.Errors));
                }
            }
        }

        // 2. Read Admin credentials from IConfiguration (appsettings.json or environment variables / secrets)
        var adminEmail = configuration["AdminUser:Email"];
        var adminPassword = configuration["AdminUser:Password"];

        // 3. Ensure admin user exists
        var admin = await userManager.FindByEmailAsync(adminEmail);
        if (admin == null)
        {
            var adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                EmailConfirmed = true,
                FirstName = "Admin",
                LastName = "User",
                DocumentTypeId = 1,
                DocumentNumber = "00000000",
                IsActive = true
            };

            var createResult = await userManager.CreateAsync(adminUser, adminPassword);
            if (!createResult.Succeeded)
            {
                logger.LogError("Error creating admin user: {Errors}", string.Join(',', createResult.Errors));
                return;
            }

            var addToRole = await userManager.AddToRoleAsync(adminUser, "Administrador");
            if (!addToRole.Succeeded)
            {
                logger.LogError("Error adding admin user to role: {Errors}", string.Join(',', addToRole.Errors));
            }

            admin = adminUser;
        }

        // 4. Ensure admin has an active bank account (delegated to IAccountService)
        try
        {
            var account = await accountService.EnsureAccountForUserAsync(admin.Id);
            logger.LogInformation("Cuenta bancaria del administrador lista. Alias: {Alias}, CVU: {Cvu}", account.Alias, account.Cvu);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error al asegurar la cuenta bancaria del administrador ({Email}).", adminEmail);
        }
    }
}
