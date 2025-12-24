namespace BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public record TransactionDetailDto(
    Guid Id,
    string TransactionId,
    string Description,
    TransactionType Type,
    decimal Amount,
    TransactionStatus Status,
    Guid? SenderAccountId,
    Guid? ReceiverAccountId,
    DateTime CreatedAt
);
