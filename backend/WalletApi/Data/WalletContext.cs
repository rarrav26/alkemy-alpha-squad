using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace WalletApi.Models;

public class WalletContext : IdentityDbContext<User, IdentityRole<int>, int>
{
    public WalletContext(DbContextOptions<WalletContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; } = null!;
    public virtual DbSet<DocumentType> DocumentTypes { get; set; } = null!;
    public virtual DbSet<Transaction> Transactions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<DocumentType>(entity =>
        {
            entity.ToTable("document_types");
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Code).IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Code).HasMaxLength(10).IsUnicode(false).HasColumnName("code");
            entity.Property(e => e.Name).HasMaxLength(50).IsUnicode(false).HasColumnName("name");

            entity.HasData(
                new DocumentType { Id = 1, Code = "DNI", Name = "Documento Nacional de Identidad" },
                new DocumentType { Id = 2, Code = "PAS", Name = "Pasaporte" }
            );
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.FirstName).HasMaxLength(50).IsRequired();
            entity.Property(e => e.LastName).HasMaxLength(50).IsRequired();
            entity.Property(e => e.DocumentNumber).HasMaxLength(30).IsUnicode(false).IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasIndex(e => new { e.DocumentTypeId, e.DocumentNumber }, "UQ_User_DocumentType_Number").IsUnique();

            entity.HasOne(d => d.DocumentType)
                .WithMany(p => p.Users)
                .HasForeignKey(d => d.DocumentTypeId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("FK_Users_DocumentTypes");
        });

        modelBuilder.Entity<Account>(entity =>
        {
            entity.ToTable("Accounts");
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Balance).HasPrecision(18, 2).HasDefaultValue(0m);
            entity.Property(e => e.Currency).HasMaxLength(10).HasDefaultValue("ARS");
            entity.Property(e => e.Alias).HasMaxLength(100).IsRequired();
            entity.Property(e => e.Cvu).HasMaxLength(22).IsUnicode(false).IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");

            entity.HasIndex(e => e.Alias, "UQ_Accounts_Alias").IsUnique();
            entity.HasIndex(e => e.Cvu, "UQ_Accounts_Cvu").IsUnique();

            entity.HasOne(d => d.User)
                .WithMany(p => p.Accounts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Accounts_Users");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.ToTable("Transactions");
            entity.HasKey(e => e.Id);

            entity.HasOne(d => d.Account)
                .WithMany(p => p.Transactions)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_Transactions_Accounts");
        });

        modelBuilder.Entity<IdentityRole<int>>().HasData(
            new IdentityRole<int>
            {
                Id = 1,
                Name = "Usuario",
                NormalizedName = "USUARIO",
                ConcurrencyStamp = "seeded-role-usuario"
            }
        );
    }
}
