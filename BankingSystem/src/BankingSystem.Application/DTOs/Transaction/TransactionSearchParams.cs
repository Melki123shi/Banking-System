namespace BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public record class TransactionSearchParams(
    string? Name = null,
    string? AccountNumber = null,
    int PageNumber = 1,
    int PageSize = 10
);