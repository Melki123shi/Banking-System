using System;

namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;

public interface INumberGenerator
{
       string GenerateTransactionNumber(string channelCode);
       string GenerateAccountNumber(string branchCode);
}
