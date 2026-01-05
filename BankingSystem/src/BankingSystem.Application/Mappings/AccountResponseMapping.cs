using System;

namespace BankingSystem.src.BankingSystem.Application.Mappings;

public static class AccountResponseMapping
{
    public static DTOs.Account.AccountResponseDto ToDto(this Domain.Entities.Account account)
    {
        return new DTOs.Account.AccountResponseDto(
            account.Id,
            account.UserId, 
            account.User?.FirstName + " " + account.User?.LastName ?? string.Empty,
            account.AccountNumber,
            account.Type.ToString(),
            account.Balance,
            account.Status.ToString(),
            account.CreatedAt,
            account.UpdatedAt
        );
    }

}