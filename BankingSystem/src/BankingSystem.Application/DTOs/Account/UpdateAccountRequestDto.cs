namespace BankingSystem.src.BankingSystem.Application.DTOs.Account;

public record class UpdateAccountRequestDto(
    string? AccountNumber,
    AccountType? AccountType,
    decimal? Balance,
    AccountStatus? AccountStatus
);
