namespace BankingSystem.src.BankingSystem.Application.DTOs.Auth;

public record class LoginResponse(string Token, DateTime ExpiresAt);
