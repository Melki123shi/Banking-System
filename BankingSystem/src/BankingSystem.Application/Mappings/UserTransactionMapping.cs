using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Domain.Entities;
namespace BankingSystem.src.BankingSystem.Application.Mappings;

public static class UserTransactionMapping
{
    public static UserTransactionReponse ToDto(
        this Transaction transaction,
        Guid customerId)
    {
        bool isDeposit = transaction.Type == TransactionType.Deposit;
        bool isOutgoing = !isDeposit && transaction.SenderAccount?.UserId == customerId;

        var customerAccount = isOutgoing
            ? transaction.SenderAccount
            : transaction.ReceiverAccount;

        var counterpartyAccount = isOutgoing
            ? transaction.ReceiverAccount
            : transaction.SenderAccount;

        return new UserTransactionReponse(
            transaction.TransactionId.ToString(),
            transaction.Amount,
            transaction.CreatedAt,
            isOutgoing ? "OUT" : "IN",
            customerAccount?.AccountNumber ?? "-",
            counterpartyAccount?.User?.Name ?? "System",
            counterpartyAccount?.AccountNumber ?? "-",
            transaction.Type.ToString(),
            transaction.Description!
        );
    }

}
