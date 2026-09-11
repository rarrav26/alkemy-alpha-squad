using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WalletApi.Interfaces;
using WalletApi.Models;
using WalletApi.Repositories;
using WalletApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
});

// Configure OpenAPI & Swagger UI
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

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

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
