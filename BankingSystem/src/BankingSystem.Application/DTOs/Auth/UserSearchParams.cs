namespace BankingSystem.src.BankingSystem.Application.DTOs.Auth;

public record class UserSearchParams(
    string? PhoneNumber = null
);