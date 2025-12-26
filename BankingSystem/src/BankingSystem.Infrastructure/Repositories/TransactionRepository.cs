using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Infrastructure.Persistence;
using BankingSystem.src.BankingSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BankingSystem.src.BankingSystem.Infrastructure.Repositories;

public class TransactionRepository : ITransactionRepository
{
    private readonly ApplicationDbContext _dbContext;

    public TransactionRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Transaction?> GetTransactionByIdAsync(Guid transactionId)
    {
        return await _dbContext.Transactions.FindAsync(transactionId);
    }

    public async Task<IEnumerable<Transaction>> GetTransactionsByAccountIdAsync(Guid accountId)
    {
        return await _dbContext.Transactions
                    .Where(t => t.SenderAccountId == accountId || t.ReceiverAccountId == accountId)
                    .Include(t => t.SenderAccount)
                    .Include(t => t.ReceiverAccount)
                    .AsNoTracking()
                    .ToListAsync();
    }
    public async Task<IEnumerable<Transaction>> GetPaginatedTransactionsAsync(int pageNumber, int pageSize)
    {
        return await _dbContext.Transactions
                    .OrderByDescending(t => t.CompletedAt)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .AsNoTracking()
                    .ToListAsync();
    }

    public async Task AddAsync(Transaction transaction)
    {
        await _dbContext.Transactions.AddAsync(transaction);
        await _dbContext.SaveChangesAsync();
    }

    public async Task UpdateAsync(Transaction transaction)
    {
        _dbContext.Transactions.Update(transaction);
        await _dbContext.SaveChangesAsync();
    }

    public async Task DeleteAsync(Transaction transaction)
    {
        _dbContext.Transactions.Remove(transaction);
        await _dbContext.SaveChangesAsync();
    }

}
