namespace BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public sealed record TransactionTypeSummary(
    int TotalTransactions,
    decimal TotalAmount,

    int CompletedTransactions,
    decimal CompletedAmount,

    int FailedTransactions,
    decimal FailedAmount,

    int PendingTransactions,
    decimal PendingAmount
);
