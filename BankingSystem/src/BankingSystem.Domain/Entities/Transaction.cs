using System.ComponentModel.DataAnnotations;

namespace BankingSystem.src.BankingSystem.Domain.Entities;

public class Transaction
{
    public Guid Id { get; private set; }
    //! Must be customely auto generated in the application layer
    public string TransactionId { get; private set; } = null!;

    public Guid? SenderAccountId { get; private set; }
    public Account? SenderAccount { get; private set; }

    public Guid? ReceiverAccountId { get; private set; }
    public Account? ReceiverAccount { get; private set; }

    public decimal Amount { get; private set; }

    public TransactionType Type { get; private set; }
    public TransactionStatus Status { get; private set; } = TransactionStatus.Pending;

    public string? Description { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime? CompletedAt { get; private set; }

    protected Transaction() { }

    public Transaction(
        string transactionId,
        decimal amount,
        TransactionType type,
        Guid? senderAccountId = null,
        Guid? receiverAccountId = null,
        string? description = null,
        DateTime? createdAt = null
    )
    {
        if (amount <= 0)
            throw new ArgumentException("Amount must be greater than zero");
        TransactionId = transactionId;
        Amount = amount;
        Type = type;
        SenderAccountId = senderAccountId;
        ReceiverAccountId = receiverAccountId;
        Description = description;
        CreatedAt = createdAt ?? DateTime.UtcNow;
    }

    public void Complete()
    {
        Status = TransactionStatus.Completed;
        CompletedAt = DateTime.UtcNow;
    }

    public void Fail()
    {
        Status = TransactionStatus.Failed;
    }

    public void SetAccounts(Account? senderAccount, Account? receiverAccount)
    {
        SenderAccount = senderAccount;
        ReceiverAccount = receiverAccount;
    }   

}