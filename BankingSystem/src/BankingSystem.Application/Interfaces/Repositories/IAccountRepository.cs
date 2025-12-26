using System;
using BankingSystem.src.BankingSystem.Domain.Entities;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;

public interface IAccountRepository {

    Task<Account?> GetByIdAsync(Guid accountId);
    Task<Account?> GetByAccountNumberAsync(string accountNumber);
    Task<IEnumerable<Account>> GetPaginatedByUserIdAsync(Guid userId, int pageNumber, int pageSize);
    Task<User?> GetUserByAccountIdAsync(Guid accountId);
    Task<IEnumerable<Account>> GetPaginatedAsync(int pageNumber, int pageSize);
    Task AddAsync(Account account);
    Task UpdateAsync( Account account);
    Task DeleteAsync(Account account);

}
