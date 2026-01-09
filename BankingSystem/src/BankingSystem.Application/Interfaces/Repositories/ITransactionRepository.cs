using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.Services;
using BankingSystem.src.BankingSystem.Domain.Common;
using BankingSystem.src.BankingSystem.Domain.Entities;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;

public interface ITransactionRepository
{
    Task<Transaction?> GetTransactionByIdAsync(Guid transactionId);
    Task<IEnumerable<Transaction>> GetTransactionsByAccountIdAsync(Guid accountId);
    Task<IEnumerable<Transaction>> GetPaginatedTransactionsByAccountIdAsync(Guid accountId, int pageNumber, int pageSize);
    Task<(IEnumerable<Transaction> Items, int TotalCount)> GetTransactionsAsync(
         TransactionSearchParams searchParams,
         Guid? userId = null);

    Task<int> GetTotalCountAsync();
    Task AddAsync(Transaction transaction);
    Task UpdateAsync(Transaction transaction);
    Task DeleteAsync(Transaction transaction);

 Task<TransactionSummaryDto> GetTransactionSummaryAsync(
    DateRange? range,
    IReadOnlyCollection<TransactionType> types,
    CancellationToken ct);
}
