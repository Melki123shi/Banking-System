namespace BankingSystem.src.BankingSystem.Application.DTOs.Auth;

public record class RefreshTokenResponseDto(
    string RefreshToken,
    DateTime RefreshTokenExpiresAt
    );
