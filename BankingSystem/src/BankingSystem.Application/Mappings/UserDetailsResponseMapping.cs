using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
namespace BankingSystem.src.BankingSystem.Application.Mappings;

public static class UserDetailsResponseMapping
{
    public static UserDetailsResponse ToDto(this Domain.Entities.User user)
    {
        return new UserDetailsResponse(
             user.Id,
            user.FirstName + " " + user.LastName,
            user.PhoneNumber,
            user.Email,
            user.DateOfBirth,
            user.Role,
            user.IsActive,
            user.CreatedAt,
            user.UpdatedAt
        );
    }
}
