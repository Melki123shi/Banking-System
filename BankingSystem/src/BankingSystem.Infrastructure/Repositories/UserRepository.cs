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

    public async Task<bool> PhoneNumberExistsAsync(string phoneNumber)
{
    return await _dbContext.Users
        .AnyAsync(u => u.PhoneNumber == phoneNumber);
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
