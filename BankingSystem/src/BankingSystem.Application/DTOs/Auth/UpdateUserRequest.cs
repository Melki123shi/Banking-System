namespace BankingSystem.src.BankingSystem.Application.DTOs.Auth;

public record class UpdateUserRequest(Guid Id,
 string? FirstName = null, 
 string? LastName = null, 
 string? Password = null, 
string? PhoneNumber = null,
 bool? IsActive = null, 
 DateTime? DateOfBirth = null,
  string? Email = null);