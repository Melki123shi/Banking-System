using System.ComponentModel.DataAnnotations;

namespace BankingSystem.src.BankingSystem.Application.DTOs.Auth;

public record class CreateUserRequest(
   [Required] string Name,  
   [Required] [Phone] string PhoneNumber, 
   [Required] string Password
   );