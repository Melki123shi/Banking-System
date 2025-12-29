using System.ComponentModel.DataAnnotations;

namespace BankingSystem.src.BankingSystem.Domain.Entities;

public class Account
{
    public Guid Id { get; private set; }
    public Guid UserId { get; private set; } 
    public User User { get; private set; } = null!;
    [Required]
    public string AccountNumber { get; private set; } = null!;
    public AccountType Type { get; private set; } = AccountType.Savings;
    public decimal Balance { get; private set; }
    public AccountStatus Status { get; private set; } = AccountStatus.active;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; private set; } = null;

    protected Account() { }

    public Account(
        string accountNumber, 
        decimal? balance,
        AccountType? type,
        AccountStatus? status,
        DateTime? UpdatedAt = null
    ){
        AccountNumber = accountNumber;
        Balance = balance ?? 0;
        Type = type ?? AccountType.Savings;
        Status = status ?? AccountStatus.active;
        this.UpdatedAt = UpdatedAt;
    }

    public Account(
        Guid userId,
        string accountNumber,
        decimal? balance,
        AccountType? type,
        AccountStatus? status,
        DateTime? UpdatedAt = null
    )
    {
        UserId = userId;
        AccountNumber = accountNumber;
        Balance = balance ?? 0;
        Type = type ?? AccountType.Savings;
        Status = status ?? AccountStatus.active;
        this.UpdatedAt = UpdatedAt;
    }

    public void Withdraw(decimal amount)
    {
        if (Status != AccountStatus.active)
            throw new InvalidOperationException($"Cannot withdraw from an {Status} account");

        if (amount <= 0)
            throw new InvalidOperationException("Withdraw amount must be positive");

        if (amount + 100 > Balance)
            throw new InvalidOperationException("Withdraw amount is too high to maintain minimum balance");

        if (amount > 1_000_000)
            throw new InvalidOperationException("Withdraw would exceed maximum withdraw limit");

        Balance -= amount;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deposit(decimal amount)
    {
        if (Status != AccountStatus.active)
            throw new InvalidOperationException($"Cannot deposit to an {Status} account");

        if (amount <= 0)
            throw new InvalidOperationException("Deposit amount must be positive");

        Balance += amount;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Update(
        string? accountNumber,
        decimal? balance,
        AccountType? type,
        AccountStatus? status)
    {
        if (accountNumber is not null)
            AccountNumber = accountNumber;

        if (balance.HasValue)
            Balance = balance.Value;

        if (type.HasValue)
            Type = type.Value;

        if (status.HasValue)
            Status = status.Value;

        UpdatedAt = DateTime.UtcNow;
    }

}