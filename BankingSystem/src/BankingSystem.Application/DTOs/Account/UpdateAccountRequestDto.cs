namespace BankingSystem.src.BankingSystem.Application.DTOs.Account;

public record class UpdateAccountRequestDto(
    string? AccountNumber,
    AccountType? Type,
    decimal? Balance,
    AccountStatus? Status
);
