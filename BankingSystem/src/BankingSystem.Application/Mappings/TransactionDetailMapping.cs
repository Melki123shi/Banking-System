using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
namespace BankingSystem.src.BankingSystem.Application.Mappings;

public static class TransactionDetailMapping
{
    public static TransactionDetailDto ToDto(this Domain.Entities.Transaction transaction)
    {
        return new TransactionDetailDto(
            transaction.Id,
            transaction.TransactionId,
            transaction.Description!,
            transaction.Type,
            transaction.Amount,
            transaction.Status,
            transaction.SenderAccountId,
            transaction.ReceiverAccountId,
            transaction.CreatedAt
        );
    }
}
