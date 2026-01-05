using System.ComponentModel.DataAnnotations;

namespace BankingSystem.src.BankingSystem.Application.DTOs.Auth;

public record class CreateUserRequest(
   [Required] string FirstName,
   [Required] string LastName,
   [Required] [Phone] string PhoneNumber, 
   DateTime? DateOfBirth,
   string? Email,
   [Required] string Password
   );