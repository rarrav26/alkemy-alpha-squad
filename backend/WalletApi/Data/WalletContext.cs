using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace WalletApi.Models;

public partial class WalletContext : DbContext
{
    public WalletContext()
    {
    }

    public WalletContext(DbContextOptions<WalletContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Account> Accounts { get; set; }

    public virtual DbSet<DocumentType> DocumentTypes { get; set; }

    public virtual DbSet<Transaction> Transactions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.UseSqlServer("DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Account>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Accounts__3213E83F1F6B2C74");

            entity.Property(e => e.Id).HasColumnName("id");
        });

        modelBuilder.Entity<DocumentType>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__document__3213E83FFC80C688");

            entity.ToTable("document_types");

            entity.HasIndex(e => e.Code, "UQ__document__357D4CF9B26AC638").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Code)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("code");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Transact__3213E83FD675344F");

            entity.Property(e => e.Id).HasColumnName("id");

            entity.HasOne(d => d.Account).WithMany(p => p.Transactions)
                .HasForeignKey(d => d.AccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Transactions_Accounts");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3213E83F46C9357F");

            entity.HasIndex(e => new { e.DocumentTypeId, e.DocumentNumber }, "UQ_TypeOfId_UserId").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__Users__AB6E6164A30EE9A7").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DocumentNumber)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("document_number");
            entity.Property(e => e.DocumentTypeId).HasColumnName("document_type_id");
            entity.Property(e => e.Email)
                .HasMaxLength(250)
                .HasColumnName("email");
            entity.Property(e => e.Lastname)
                .HasMaxLength(50)
                .HasColumnName("lastname");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");

            entity.HasOne(d => d.DocumentType).WithMany(p => p.Users)
                .HasForeignKey(d => d.DocumentTypeId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_DocumentTypes");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
