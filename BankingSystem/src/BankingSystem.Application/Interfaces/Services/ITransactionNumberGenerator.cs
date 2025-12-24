using System;

namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;

public interface ITransactionNumberGenerator
{
    string Generate(string channelCode);
}
