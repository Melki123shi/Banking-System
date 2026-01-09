using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Infrastructure.Persistence;
using BankingSystem.src.BankingSystem.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.Services;
using BankingSystem.src.BankingSystem.Domain.Common;

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

    public async Task<(IEnumerable<Transaction> Items, int TotalCount)>
    GetPaginatedTransactionsForCustomerAsync(
        Guid customerId,
        int pageNumber,
        int pageSize)
    {
        var query = _dbContext.Transactions
            .Include(t => t.SenderAccount)
                .ThenInclude(a => a!.User)
            .Include(t => t.ReceiverAccount)
                .ThenInclude(a => a!.User)
            .Where(t =>
                t.SenderAccount!.UserId == customerId ||
                t.ReceiverAccount!.UserId == customerId
            );

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return (items, totalCount);
    }
    public async Task<(IEnumerable<Transaction> Items, int TotalCount)> GetTransactionsAsync(
        TransactionSearchParams searchParams,
        Guid? userId = null)
    {
        var query = _dbContext.Transactions
            .Include(t => t.SenderAccount)
                .ThenInclude(a => a!.User)
            .Include(t => t.ReceiverAccount)
                .ThenInclude(a => a!.User)
            .AsQueryable();

        // 1. Filter by UserId (Checks if user is either Sender or Receiver)
        if (userId.HasValue)
        {
            query = query.Where(t =>
                (t.SenderAccount != null && t.SenderAccount.UserId == userId.Value) ||
                (t.ReceiverAccount != null && t.ReceiverAccount.UserId == userId.Value)
            );
        }

        // 2. Filter by Name (Checks the User linked to either account)
        if (!string.IsNullOrWhiteSpace(searchParams.Name))
        {
            query = query.Where(t =>
                (t.SenderAccount != null && (t.SenderAccount.User.FirstName.Contains(searchParams.Name) || t.SenderAccount.User.LastName.Contains(searchParams.Name))) ||
                (t.ReceiverAccount != null && (t.ReceiverAccount.User.FirstName.Contains(searchParams.Name) || t.ReceiverAccount.User.LastName.Contains(searchParams.Name)))
            );
        }

        // 3. Filter by AccountNumber (Checks either Sender or Receiver account number)
        if (!string.IsNullOrWhiteSpace(searchParams.AccountNumber))
        {
            query = query.Where(t =>
                (t.SenderAccount != null && t.SenderAccount.AccountNumber.Contains(searchParams.AccountNumber)) ||
                (t.ReceiverAccount != null && t.ReceiverAccount.AccountNumber.Contains(searchParams.AccountNumber))
            );
        }

        // 4. Execution
        int totalCount = await query.CountAsync();

        var items = await query
            .OrderByDescending(t => t.CreatedAt)
            .Skip((searchParams.PageNumber - 1) * searchParams.PageSize)
            .Take(searchParams.PageSize)
            .AsNoTracking()
            .ToListAsync();

        return (items, totalCount);
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

    public async Task<IEnumerable<Transaction>> GetPaginatedTransactionsByAccountIdAsync(Guid accountId, int pageNumber, int pageSize)
    {
        return await _dbContext.Transactions
                    .Where(t => t.SenderAccountId == accountId || t.ReceiverAccountId == accountId)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .AsNoTracking()
                    .ToListAsync();
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _dbContext.Transactions.CountAsync();
    }

    public async Task<TransactionSummaryDto> GetTransactionSummaryAsync(
       DateRange? range,
       IReadOnlyCollection<TransactionType>? types,
       CancellationToken ct)
    {
        var query = _dbContext.Transactions.AsQueryable();

        if (range is not null)
        {
            query = query.Where(t =>
                t.CreatedAt >= range.From &&
                t.CreatedAt < range.To);
        }

        if (types is { Count: > 0 })
        {
            query = query.Where(t => types.Contains(t.Type));
        }

        var aggregates = await query
            .GroupBy(t => new { t.Type, t.Status })
            .Select(g => new
            {
                g.Key.Type,
                g.Key.Status,
                Count = g.Count(),
                Amount = g.Sum(x => x.Amount)
            })
            .ToListAsync(ct);

        return TransactionSummaryDto.FromAggregates(aggregates);
    }


}