using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.src.BankingSystem.Infrastructure.Repositories;

public class AccountRepository : IAccountRepository
{
    private readonly ApplicationDbContext _dbContext;

    public AccountRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Account account)
    {
        await _dbContext.Accounts.AddAsync(account);
        await _dbContext.SaveChangesAsync();
    }

    public async Task<Account?> GetByIdAsync(Guid accountId)
    {
        return await _dbContext.Accounts
            .FirstOrDefaultAsync(a => a.Id == accountId);
    }

    public async Task<User?> GetUserByAccountIdAsync(Guid accountId)
    {
        var account =  await _dbContext.Accounts
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == accountId);
        return account?.User;
    }

    public async Task<IEnumerable<Account>> GetPaginatedByUserIdAsync(Guid userId, int pageNumber, int pageSize)
    {
        return await _dbContext.Accounts
            .Where(a => a.UserId == userId)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<IEnumerable<Account>> GetByUserIdAsync(Guid userId)
    {
        return await _dbContext.Accounts
            .Where(a => a.UserId == userId)
            .ToListAsync();
    }

    public async Task<Account?> GetByAccountNumberAsync(string accountNumber)
    {
        return await _dbContext.Accounts.FirstOrDefaultAsync(a => a.AccountNumber == accountNumber);
    }

    public async Task<IEnumerable<Account>> GetPaginatedAsync(int pageNumber, int pageSize)
    {
        return await _dbContext.Accounts
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task UpdateAsync(Account account)
    {
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Account account)
    {
        _dbContext.Accounts.Remove(account);
        await _dbContext.SaveChangesAsync();
    }

}
