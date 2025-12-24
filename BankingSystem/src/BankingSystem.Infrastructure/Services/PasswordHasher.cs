using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using System.Security.Cryptography;
using System.Text;

namespace BankingSystem.src.BankingSystem.Infrastructure.Services;

public class PasswordHasher : IPasswordHasher
{
     public string Hash(string password)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }

    public bool Verify(string password, string hashedPassword)
        => Hash(password) == hashedPassword;
}
