using WalletApi.Models;
using Microsoft.EntityFrameworkCore;
using WalletApi.Repositories;
using WalletApi.Interfaces;
using WalletApi.Services;
using WalletApi.Seed;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddDbContext<WalletContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITokenService, JwtTokenService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "WalletApiDevelopmentKey-1234567890-ChangeMe")),
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<WalletContext>();

    // Si no tenes migraciones, esto crea la base si no existe.
    db.Database.EnsureCreated();

    // Seed de tipos de documento
    if (!db.DocumentTypes.Any())
    {
        db.DocumentTypes.AddRange(
            new DocumentType { Code = "DNI", Name = "Documento Nacional de Identidad" },
            new DocumentType { Code = "PAS", Name = "Pasaporte" }
        );
        db.SaveChanges();
    }

    // Seed de usuario administrador base
    if (!db.Users.Any(u => u.Email == "admin@wallet.com"))
    {
        var tipoDoc = db.DocumentTypes.First();

        db.Users.Add(new User
        {
            Name = "Admin",
            Lastname = "System",
            DocumentTypeId = tipoDoc.Id,
            DocumentNumber = "00000000",
            Email = "admin@wallet.com"
        });

        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "WalletApi v1");
    });
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();