using Microsoft.EntityFrameworkCore;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Domain.Entities;
namespace BankingSystem.src.BankingSystem.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Account> Accounts => Set<Account>();
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<RefreshToken> RefreshTokens { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(u => u.Id)
                  .ValueGeneratedOnAdd();
            entity.Property(u => u.Role)
                  .HasConversion<string>();

            entity.Property(u => u.IsActive)
                  .HasConversion<string>();
        });

        // Phone number must be unique
        modelBuilder.Entity<User>()
            .HasIndex(u => u.PhoneNumber)
            .IsUnique();

        // Validate enum as string
        modelBuilder.Entity<Account>(entity =>
        {
            entity.Property(a => a.Type)
                  .HasConversion<string>()
                  .HasMaxLength(50);
            entity.Property(a => a.Id)
                  .ValueGeneratedOnAdd();
            entity.Property(a => a.Status)
                  .HasConversion<string>()
                  .HasMaxLength(50);
        });


        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.Property(t => t.Id)
                  .ValueGeneratedOnAdd();
            entity.Property(t => t.Type)
                  .HasConversion<string>()
                  .HasMaxLength(50);
            entity.Property(t => t.Status)
                  .HasConversion<string>()
                  .HasMaxLength(50);
        });

        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.Property(rt => rt.Id)
                  .ValueGeneratedOnAdd();
            entity.Property(rt => rt.IsRevoked)
                  .HasConversion<string>();
        });

        // Account Number must be unique
        modelBuilder.Entity<Account>()
            .HasIndex(a => a.AccountNumber)
            .IsUnique();

        // TransactionId must be unique
        modelBuilder.Entity<Transaction>()
            .HasIndex(t => t.TransactionId)
            .IsUnique();
    }
}
