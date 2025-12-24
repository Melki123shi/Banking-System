using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
using BankingSystem.src.BankingSystem.Domain.Entities;


namespace BankingSystem.src.BankingSystem.Infrastructure.Services;

public class UserManagementService : IUserManagementService
{
    private readonly IUserRepository _userRepository = null!;
    private readonly IPasswordHasher _passwordHasher = null!;

    public UserManagementService(IUserRepository userRepository, IPasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<CreateUserResponse> CreateUserAsync(CreateUserRequest createUserRequest)
    {
        var user = new User(
            createUserRequest.Name,
            createUserRequest.PhoneNumber,
            _passwordHasher.Hash(createUserRequest.Password)
        );

        await _userRepository.AddAsync(user);

        return new CreateUserResponse(
            user.Id,
            user.Name,
            user.PhoneNumber,
            user.Role,
            user.CreatedAt
        );
    }

    public async Task<IEnumerable<UserDetailsResponse>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllUsersAsync();
        return users.Select(user => new UserDetailsResponse(
            user.Id,
            user.Name,
            user.PhoneNumber,
            user.Role,
            user.IsActive,
            user.CreatedAt,
            user.UpdatedAt
        ));
    }

    public async Task<UserDetailsResponse> GetUserDetailsAsync(Guid userId)
    {
        User? user = await _userRepository.GetUserByIdAsync(userId);
        return new UserDetailsResponse(
            user!.Id,
            user.Name,
            user.PhoneNumber,
            user.Role,
            user.IsActive,
            user.CreatedAt,
            user.UpdatedAt
        );
    }

    public async Task UpdateUserAsync(Guid id, UpdateUserRequest updateUserRequest)
    {
        User? user = await _userRepository.GetUserByIdAsync(id)
                        ?? throw new KeyNotFoundException("User not found");
        user.UpdateDetails(
            updateUserRequest.Name ?? user.Name,
            updateUserRequest.PhoneNumber ?? user.PhoneNumber
        );

        await _userRepository.UpdateAsync(user);
    }

    public async Task DeleteUserAsync(Guid userId)
    {
        User? user = await _userRepository.GetUserByIdAsync(userId)
                        ?? throw new KeyNotFoundException("User not found");
        await _userRepository.DeleteAsync(user);
    }
}
