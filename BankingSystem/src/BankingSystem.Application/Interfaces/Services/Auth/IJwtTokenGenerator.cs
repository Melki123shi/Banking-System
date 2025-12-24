using System;
using BankingSystem.src.BankingSystem.Domain.Entities;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;


public interface IJwtTokenGenerator
{
    (string Token, DateTime ExpiresAt) Generate(User user);
}
