using System;
using BankingSystem.src.BankingSystem.Domain.Entities;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;

public interface IAccountRepository {

    Task<Account?> GetByIdAsync(Guid accountId);
    Task<Account?> GetByAccountNumberAsync(string accountNumber);
    Task<IEnumerable<Account>> GetByUserIdAsync(Guid userId);
    Task<User?> GetUserByAccountIdAsync(Guid accountId);
    Task<(IEnumerable<Account>, int)> GetPaginatedAsync(int pageNumber, int pageSize);
    Task<List<Account>> GetByIdsAsync(IEnumerable<Guid> accountIds);
    Task<int> GetTotalCountAsync();
    Task<decimal> GetTotalBalanceAsync();
    Task<int> GetActiveTotalCountAsync();
    Task<decimal> GetActiveTotalBalanceAsync();
    Task<int> GetInactiveTotalCountAsync();
    Task<decimal> GetInactiveTotalBalanceAsync();
    Task AddAsync(Account account);
    Task UpdateAsync( Account account);
    Task DeleteAsync(Account account);

}
