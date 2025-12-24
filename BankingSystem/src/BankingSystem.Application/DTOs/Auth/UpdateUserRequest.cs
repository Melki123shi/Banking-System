namespace BankingSystem.src.BankingSystem.Application.DTOs.Auth;

public record class UpdateUserRequest(Guid Id, string? Name = null, string? Password = null, string? PhoneNumber = null);