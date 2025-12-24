using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;

namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;

public interface IUserManagementService

{
    Task<CreateUserResponse> CreateUserAsync(CreateUserRequest createUserRequest);
    Task<UserDetailsResponse> GetUserDetailsAsync(Guid userId);
    // To be updated to support pagination in the future
    Task<IEnumerable<UserDetailsResponse>> GetAllUsersAsync();
    Task UpdateUserAsync(Guid id, UpdateUserRequest updateUserRequest);
    Task DeleteUserAsync(Guid userId);
}
