using BankingSystem.src.BankingSystem.Domain.Enums;

namespace BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public record class GetTransactionsSummaryRequest(
IReadOnlyCollection<TransactionType>? Types = null,
    SummaryPeriod Period = SummaryPeriod.All,
    DateTime? From = null,
    DateTime? To = null
);
