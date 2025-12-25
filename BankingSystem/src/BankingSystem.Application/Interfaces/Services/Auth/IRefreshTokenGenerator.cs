using System;

namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services.Auth;

public interface IRefreshTokenGenerator
{
    string Generate();
}
