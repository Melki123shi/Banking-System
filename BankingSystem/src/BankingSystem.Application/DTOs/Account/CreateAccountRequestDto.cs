namespace BankingSystem.src.BankingSystem.Application.DTOs.Account;

public record class CreateAccountRequestDto(
    Guid UserId,
    string AccountNumber,
    decimal? Balance,
    AccountType? AccountType,
    AccountStatus? Status
);
