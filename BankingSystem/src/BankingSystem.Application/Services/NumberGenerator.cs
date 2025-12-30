using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using System.Security.Cryptography;

namespace BankingSystem.src.BankingSystem.Application.Services;

public class NumberGenerator : INumberGenerator
{
    private static int _sequence = 0;
    private static readonly object _lock = new object();

    /* 
         Generates a unique transaction number.
         Format: YYYYMMDDHHMMSS + ChannelCode + 5-digit sequence
         Example: 20251223123045MB00001
    */
    public string GenerateTransactionNumber(string channelCode)
    {
        string timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

        int sequence;
        lock (_lock)
        {
            _sequence = (_sequence + 1) % 100000; // 5-digit sequence
            sequence = _sequence;
        }

        string sequenceStr = sequence.ToString("D5");
        return $"{timestamp}{channelCode}{sequenceStr}";
    }

    public string GenerateAccountNumber(string channelCode)
    {
       byte[] bytes = new byte[8];
    using (var rng = RandomNumberGenerator.Create())
    {
        rng.GetBytes(bytes);
    }

    return BitConverter.ToUInt64(bytes, 0).ToString();
    }

}
