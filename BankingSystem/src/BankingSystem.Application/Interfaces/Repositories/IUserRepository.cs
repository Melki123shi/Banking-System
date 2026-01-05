using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
using BankingSystem.src.BankingSystem.Domain.Entities;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetUserByIdAsync(Guid userId);
    Task<User?> GetUserByPhoneNumberAsync(string phoneNumber);
    Task AddAsync(User user);
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<(IEnumerable<User> Users, int TotalCount)> GetPaginatedCustomersAsync(
        UserSearchParams searchParams,
        int pageNumber,
        int pageSize
    );
    Task<int> GetActiveUserCountAsync();
    Task<int> GetInactiveUserCountAsync();
    Task<int> GetNewUsersCountThisMonthAsync();
    Task<bool> PhoneNumberExistsAsync(string phoneNumber);
    Task UpdateAsync(User user);
    Task DeleteAsync(User user);
}
