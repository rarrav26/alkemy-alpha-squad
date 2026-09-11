using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using WalletApi.Data.Entities;

namespace WalletApi.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(RoleManager<IdentityRole<int>> roleManager, UserManager<User> userManager)
    {
        // Ensure roles
        string[] roles = new[] { "Usuario", "Administrador" };

        foreach (var roleName in roles)
        {
            var exists = await roleManager.RoleExistsAsync(roleName);
            if (!exists)
            {
                var role = new IdentityRole<int>(roleName);
                var result = await roleManager.CreateAsync(role);
                if (!result.Succeeded)
                {
                    Console.WriteLine($"Error creating role {roleName}: {string.Join(',', result.Errors)}");
                }
            }
        }

        // Ensure admin user
        var adminEmail = "admin@test.com";
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

            var createResult = await userManager.CreateAsync(adminUser, "Admin123!");
            if (!createResult.Succeeded)
            {
                Console.WriteLine($"Error creating admin user: {string.Join(',', createResult.Errors)}");
                return;
            }

            var addToRole = await userManager.AddToRoleAsync(adminUser, "Administrador");
            if (!addToRole.Succeeded)
            {
                Console.WriteLine($"Error adding admin user to role: {string.Join(',', addToRole.Errors)}");
            }
        }
    }
}
