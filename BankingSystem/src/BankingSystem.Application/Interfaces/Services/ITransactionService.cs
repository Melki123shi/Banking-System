using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;

public interface ITransactionService
{
    Task<TransactionDetailDto> GetTransactionByIdAsync(Guid transactionId);
    Task<IEnumerable<TransactionDetailDto>> GetTransactionsByAccountIdAsync(Guid accountId);
    Task<IEnumerable<TransactionDetailDto>> GetPaginatedCustomerTransactionsAsync(Guid customerId, int pageNumber, int pageSize);
    Task<IEnumerable<TransactionDetailDto>> GetPaginatedTransactionsAsync(int pageNumber, int pageSize);
    Task<TransactionDetailDto> RecordDepositAsync(Guid accountId, DepositRequestDto depositRequestDto);
    Task<TransactionDetailDto> RecordWithdrawAsync(Guid accountId, WithdrawRequestDto withdrawRequestDto);
    Task<TransactionDetailDto> RecordTransferAsync(Guid senderAccountId, TransferRequestDto transferRequestDto);
}
