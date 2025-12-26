using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
namespace BankingSystem.src.BankingSystem.Application.Mappings;

public static class UserDetailsResponseMapping
{
    public static UserDetailsResponse ToDto(this Domain.Entities.User user)
    {
        return new UserDetailsResponse(
             user.Id,
            user.Name,
            user.PhoneNumber,
            user.Role,
            user.IsActive,
            user.CreatedAt,
            user.UpdatedAt
        );
    }
}
