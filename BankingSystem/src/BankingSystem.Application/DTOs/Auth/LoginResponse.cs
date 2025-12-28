using BankingSystem.src.BankingSystem.Domain.Entities;

namespace BankingSystem.src.BankingSystem.Application.DTOs.Auth;

public record class LoginResponse(
    string AccessToken,
    DateTime AccessTokenExpiresAt,
    string RefreshToken,
    User user
    );
