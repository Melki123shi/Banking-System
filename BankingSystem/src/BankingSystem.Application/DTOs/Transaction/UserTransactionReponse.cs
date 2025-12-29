namespace BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public record class UserTransactionReponse(
    string TransactionId,
    decimal Amount,
    DateTime Date,
    string Direction,
    string CustomerAccountNumber,
    string CounterpartyName,
    string CounterpartyAccountNumber,
    string TransactionType,
    string Description
);