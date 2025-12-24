namespace BankingSystem.src.BankingSystem.Application.DTOs.Account;

public record class AccountResponseDto(
    Guid Id,
    Guid UserId,
    string AccountNumber,
    string AccountType,
    decimal Balance,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt
);
