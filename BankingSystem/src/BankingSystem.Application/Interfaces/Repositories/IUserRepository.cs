using System;
using BankingSystem.src.BankingSystem.Domain.Entities;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<User?> GetUserByIdAsync(Guid userId);
    Task<User?> GetUserByPhoneNumberAsync(string phoneNumber);
    Task AddAsync(User user);
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<bool> PhoneNumberExistsAsync(string phoneNumber);
    Task UpdateAsync(User user);
    Task DeleteAsync(User user);
}
