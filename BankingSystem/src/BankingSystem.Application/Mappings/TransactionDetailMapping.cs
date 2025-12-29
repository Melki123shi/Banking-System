using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Domain.Entities;

namespace BankingSystem.src.BankingSystem.Application.Mappings;

public static class TransactionDetailMapping
{
    public static TransactionDetailDto ToDto(this Transaction transaction)
    {
        return new TransactionDetailDto
        {
            Id = transaction.Id,
            TransactionId = transaction.TransactionId,
            Description = transaction.Description ?? string.Empty,
            TransactionType = transaction.Type,
            Amount = transaction.Amount,
            Status = transaction.Status,
            SenderAccountId = transaction.SenderAccountId,
            SenderAccountNumber = transaction.SenderAccount?.AccountNumber ?? "-",
            ReceiverAccountId = transaction.ReceiverAccountId,
            ReceiverAccountNumber = transaction.ReceiverAccount?.AccountNumber ?? "-",
            CompletedAt = transaction.CompletedAt
        };
    }
}