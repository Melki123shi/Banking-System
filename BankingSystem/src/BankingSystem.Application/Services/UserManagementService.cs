using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Application.Interfaces;
using BankingSystem.src.BankingSystem.Application.Mappings;
using BankingSystem.src.BankingSystem.Application.DTOs;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;


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
        if (await _userRepository.PhoneNumberExistsAsync(createUserRequest.PhoneNumber))
            throw new InvalidOperationException("Phone number already exists");
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

    public async Task<PaginatedResponseDto<UserDetailsResponse>> GetPaginatedCustomersAsync(
    int pageNumber,
    int pageSize)
    {
        var pagedUsers = await _userRepository.GetPaginatedCustomersAsync(
            pageNumber,
            pageSize
        );

        return new PaginatedResponseDto<UserDetailsResponse>
        {
            Items = pagedUsers.Users.Select(user => user.ToDto()),
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = pagedUsers.TotalCount
        };
    }

    public async Task<UserDetailsResponse> GetUserDetailsAsync(Guid userId)
    {
        User? user = await _userRepository.GetUserByIdAsync(userId);
        return user!.ToDto();
    }


    public async Task UpdateUserAsync(Guid id, UpdateUserRequest updateUserRequest)
    {
        User? user = await _userRepository.GetUserByIdAsync(id)
                        ?? throw new KeyNotFoundException("User not found");

        var hashedPassword = user.HashedPassword;
        if (!string.IsNullOrEmpty(updateUserRequest.Password))
        {
            hashedPassword = _passwordHasher.Hash(updateUserRequest.Password);
        }
        user.UpdateDetails(
            updateUserRequest.Name ?? user.Name,
            updateUserRequest.PhoneNumber ?? user.PhoneNumber,
            updateUserRequest.IsActive ?? user.IsActive,
            hashedPassword
        );

        await _userRepository.UpdateAsync(user);
    }

    public async Task<CustomerSummeryDto> GetCustomerSummeryAsync()
    {
        var activeUsersCount = await _userRepository.GetActiveUserCountAsync();
        var (users, totalCount) = await _userRepository.GetPaginatedCustomersAsync(1, int.MaxValue);
        var inactiveUsersCount = totalCount - activeUsersCount;

        return new CustomerSummeryDto(
            TotalCustomers: totalCount,
            ActiveCustomers: activeUsersCount,
            InactiveCustomers: inactiveUsersCount
        );  
    }

    public async Task DeleteUserAsync(Guid userId)
    {
        User? user = await _userRepository.GetUserByIdAsync(userId)
                        ?? throw new KeyNotFoundException("User not found");
        await _userRepository.DeleteAsync(user);
    }
}
