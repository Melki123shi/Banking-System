using Microsoft.EntityFrameworkCore;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.Domain.Entities;
public interface IApplicationDbContext
{
    DbSet<User> Users { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

}
