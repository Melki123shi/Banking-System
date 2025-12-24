namespace BankingSystem.src.BankingSystem.Application.DTOs.Auth;

public record class UserDetailsResponse(
    Guid Id,
    string Name,
    string PhoneNumber,
    UserRole Role,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? UpdatedAt
);
