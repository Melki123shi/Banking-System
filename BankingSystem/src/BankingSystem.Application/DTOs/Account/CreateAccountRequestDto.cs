namespace BankingSystem.src.BankingSystem.Application.DTOs.Account;

public record class CreateAccountRequestDto(
    Guid UserId,
    decimal? Balance,
    AccountType? AccountType,
    AccountStatus? Status
);
