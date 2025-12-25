using System;
using Microsoft.EntityFrameworkCore;
using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Infrastructure.Persistence;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
namespace BankingSystem.src.BankingSystem.Application.Services;

public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly ApplicationDbContext _dbContext;

    public RefreshTokenRepository(ApplicationDbContext context)
    {
        _dbContext = context;
    }

    public async Task<RefreshToken?> GetByTokenAsync(string token)
    {
        return await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(t => t.Token == token && !t.IsRevoked);
    }

    public async Task AddAsync(RefreshToken token)
    {
        await _dbContext.RefreshTokens.AddAsync(token);
    }

    public async Task SaveAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}
