using BankingSystem.src.BankingSystem.Domain.Entities;

namespace BankingSystem.src.BankingSystem.Application.DTOs.Account;

public record class AccountResponseDto(
    Guid Id,
    Guid UserId,        
    string UserName,
    string AccountNumber,
    string AccountType,
    decimal Balance,
    string Status,
    DateTimeOffset CreatedAt,
    DateTimeOffset? UpdatedAt
);
