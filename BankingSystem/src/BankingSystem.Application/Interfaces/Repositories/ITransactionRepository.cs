using System;
using BankingSystem.src.BankingSystem.Domain.Entities;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;

public interface ITransactionRepository
{
    Task<Transaction?> GetTransactionByIdAsync(Guid transactionId);
    Task<IEnumerable<Transaction>> GetTransactionsByAccountIdAsync(Guid accountId);
    Task<IEnumerable<Transaction>> GetPaginatedTransactionsAsync(int pageNumber, int pageSize);
    Task<IEnumerable<Transaction>> GetPaginatedTransactionsByAccountIdAsync(Guid accountId, int pageNumber, int pageSize);
    Task AddAsync(Transaction transaction);
    Task UpdateAsync(Transaction transaction);
    Task DeleteAsync(Transaction transaction);
}
