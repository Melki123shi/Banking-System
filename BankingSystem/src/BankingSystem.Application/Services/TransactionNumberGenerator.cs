using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
namespace BankingSystem.src.BankingSystem.Application.Services;

public class TransactionNumberGenerator : ITransactionNumberGenerator
{
    private static int _sequence = 0;
    private static readonly object _lock = new object();

    /* 
         Generates a unique transaction number.
         Format: YYYYMMDDHHMMSS + ChannelCode + 5-digit sequence
         Example: 20251223123045MB00001
    */
    public string Generate(string channelCode)
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

}
