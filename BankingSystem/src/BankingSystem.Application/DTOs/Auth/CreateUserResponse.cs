namespace BankingSystem.src.BankingSystem.Application.DTOs.Auth;

public record class CreateUserResponse(Guid UserId, string Name, string PhoneNumber, UserRole Role, DateTime CreatedAt, DateTime? DateOfBirth, string? Email);
