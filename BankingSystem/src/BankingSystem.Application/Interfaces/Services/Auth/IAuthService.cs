using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;

namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
    // Task<CreateUserResponse> CreateUserAsync(string name, string phoneNumber, string password, UserRole role);
}
