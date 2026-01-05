using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
using BankingSystem.src.BankingSystem.Application.DTOs;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;

public interface IUserManagementService

{
    Task<CreateUserResponse> CreateUserAsync(CreateUserRequest createUserRequest);
    Task<UserDetailsResponse> GetUserDetailsAsync(Guid userId);
    Task<PaginatedResponseDto<UserDetailsResponse>> GetPaginatedCustomersAsync(
        UserSearchParams searchParams,
        int pageNumber,
        int pageSize
    );
    Task<CustomerSummaryDto> GetCustomerSummaryAsync();

    Task UpdateUserAsync(Guid id, UpdateUserRequest updateUserRequest);
    Task DeleteUserAsync(Guid userId);
}
