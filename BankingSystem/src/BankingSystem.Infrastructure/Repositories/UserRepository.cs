using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.src.BankingSystem.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _dbContext;

    public UserRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _dbContext.Users.FindAsync(userId);
    }

    public async Task<IEnumerable<User>> GetAllUsersAsync()
    {
        return await _dbContext.Users.ToListAsync();
    }

    public async Task<(IEnumerable<User> Users, int TotalCount)> GetPaginatedCustomersAsync(
    int pageNumber,
    int pageSize)
    {
        var query = _dbContext.Users.AsQueryable().Where(u => u.Role.ToString() == "Customer");

        var totalCount = await query.CountAsync();

        var users = await query
            .Where(u => u.Role.ToString() == "Customer")
            .OrderBy(u => u.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (users, totalCount);
    }

    public async Task<bool> PhoneNumberExistsAsync(string phoneNumber)
    {
        return await _dbContext.Users
            .AnyAsync(u => u.PhoneNumber == phoneNumber);
    }

    public async Task<int> GetInactiveUserCountAsync()
    {
        return await _dbContext.Users.Where(u => !u.IsActive).CountAsync();
    }
    public async Task<int> GetNewUsersCountThisMonthAsync()
    {
        var currentMonth = DateTime.UtcNow.Month;
        var currentYear = DateTime.UtcNow.Year;

        return await _dbContext.Users
            .Where(u => u.CreatedAt.Month == currentMonth && u.CreatedAt.Year == currentYear)
            .CountAsync();
    }
    public async Task<int> GetActiveUserCountAsync()
    {
        return await _dbContext.Users.Where(u => u.IsActive).CountAsync();
    }


    public async Task<User?> GetUserByPhoneNumberAsync(string phoneNumber)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);
    }

    public async Task AddAsync(User user)
    {
        await _dbContext.Users.AddAsync(user);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(User user)
    {
        _dbContext.Users.Update(user);
        await _dbContext.SaveChangesAsync();
    }

    //! Fix this logic on what happens when deleting a user with accounts
    public async Task DeleteAsync(User user)
    {
        _dbContext.Users.Remove(user);
        await _dbContext.SaveChangesAsync();
    }

}
