using System;
using System.Security.Cryptography;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services.Auth;
namespace BankingSystem.src.BankingSystem.Application.Services;

public class RefreshTokenGenerator : IRefreshTokenGenerator
{
    public string Generate()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(64);

        return Convert.ToBase64String(randomBytes)
            .Replace("+", "-")
            .Replace("/", "_")
            .Replace("=", "");
    }
}
