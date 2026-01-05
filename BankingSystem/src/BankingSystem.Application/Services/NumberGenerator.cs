using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using System.Security.Cryptography;
using System.Linq;

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

    public string GenerateAccountNumber(string branchCode)
    {
        string bankCode = "1002";
        string year = DateTime.UtcNow.Year.ToString();

        // Secure random number
        var random = RandomNumberGenerator.GetInt32(100000, 999999);

        string raw = $"{bankCode}{branchCode}{year}{random}";
        int checkDigit = CalculateCheckDigit(raw);

        return $"{bankCode}-{branchCode}-{year}-{random}-{checkDigit}";
    }

    private static int CalculateCheckDigit(string input)
    {
        int sum = input.Sum(c => c - '0');
        return sum % 10;
    }

}
