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
            createUserRequest.FirstName[0].ToString().ToUpper() + createUserRequest.FirstName.Substring(1).ToLower(),
            createUserRequest.LastName[0].ToString().ToUpper() + createUserRequest.LastName.Substring(1).ToLower(),
            createUserRequest.Email, 
            createUserRequest.PhoneNumber,
            _passwordHasher.Hash(createUserRequest.Password),
            createUserRequest.DateOfBirth
        );

        await _userRepository.AddAsync(user);

        return new CreateUserResponse(
            user.Id,
            user.FirstName + " " + user.LastName,
            user.PhoneNumber,
            user.Role,
            user.CreatedAt,
            user.DateOfBirth,
            user.Email
        );
    }

    public async Task<PaginatedResponseDto<UserDetailsResponse>> GetPaginatedCustomersAsync( UserSearchParams searchParams,
    int pageNumber,
    int pageSize)
    {
        var pagedUsers = await _userRepository.GetPaginatedCustomersAsync(
            searchParams,
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
            updateUserRequest.FirstName ?? user.FirstName,
            updateUserRequest.LastName ?? user.LastName,
            updateUserRequest.PhoneNumber ?? user.PhoneNumber,
            updateUserRequest.Email ?? user.Email,
            updateUserRequest.IsActive ?? user.IsActive,
            hashedPassword,
            updateUserRequest.DateOfBirth ?? user.DateOfBirth
        );

        await _userRepository.UpdateAsync(user);
    }


    public async Task<CustomerSummaryDto> GetCustomerSummaryAsync()
    {
        int activeCustomers = await _userRepository.GetActiveUserCountAsync();
        int inactiveCustomers = await _userRepository.GetInactiveUserCountAsync();
        int totalCustomers = activeCustomers + inactiveCustomers;
        int newUsersThisMonth = await _userRepository.GetNewUsersCountThisMonthAsync();

        return new CustomerSummaryDto(
            totalCustomers,
            activeCustomers,
            inactiveCustomers,
            newUsersThisMonth
        );
    }

    public async Task DeleteUserAsync(Guid userId)
    {
        User? user = await _userRepository.GetUserByIdAsync(userId)
                        ?? throw new KeyNotFoundException("User not found");
        await _userRepository.DeleteAsync(user);
    }
}
