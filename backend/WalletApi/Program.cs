using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

using System.Text;
using System.Security.Claims;
using WalletApi.Data;
using WalletApi.Data.Entities;
using WalletApi.Interfaces;
using WalletApi.Models;
using WalletApi.Repositories;
using WalletApi.Services;
using WalletApi.Security;
var builder = WebApplication.CreateBuilder(args);





// Add services to the container.
builder.Services.AddControllers();

// Configure OpenAPI & Swagger UI
builder.Services.AddOpenApi();
// Configure OpenAPI & Swagger UI
builder.Services.AddEndpointsApiExplorer();

// Configuración correcta para el OpenAPI nativo de .NET (.NET 9+)
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});
// Database context
builder.Services.AddDbContext<WalletContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

// ASP.NET Core Identity
builder.Services.AddIdentity<User, IdentityRole<int>>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<WalletContext>()
.AddDefaultTokenProviders();


// Dependency Injection for application services & repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAliasGeneratorService, AliasGeneratorService>();
builder.Services.AddScoped<ICvuGeneratorService, CvuGeneratorService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAccountService, AccountService>();

// CORS configuration for Frontend integration
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173", "http://localhost:3000", "http://localhost:5016")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("No se configuró Jwt:Key.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)),

            ClockSkew = TimeSpan.Zero,
            
            RoleClaimType = ClaimTypes.Role
        };
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var userManager = context.HttpContext.RequestServices
                    .GetRequiredService<UserManager<User>>();

                // Extrae el ID del usuario autenticado en la petición
                var userId = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);

                if (string.IsNullOrEmpty(userId))
                {
                    context.Fail("Token no contiene un ID de usuario válido.");
                    return;
                }

                var user = await userManager.FindByIdAsync(userId);
                if (user == null || !user.IsActive)
                {
                    context.Fail("El usuario no existe o está inactivo.");
                    return;
                }

                // Si el SecurityStamp cambió en la BD (ej. cambio de clave o logout forzado), rechaza el token
                var tokenStamp = context.Principal?.FindFirstValue("AspNet.Identity.SecurityStamp");
                if (tokenStamp != user.SecurityStamp)
                {
                    context.Fail("La sesión ha expirado o ha sido revocada.");
                    return;
                }
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Token inválido: {context.Exception.Message}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<ITokenService, JwtTokenService>();



var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole<int>>>();
        var userManager = services.GetRequiredService<UserManager<User>>();
        
        await DbSeeder.SeedAsync(roleManager, userManager);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Ocurrió un error durante el seeding de la base de datos.");
    }
}
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/openapi/v1.json",
            "WalletApi v1"
        );
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
