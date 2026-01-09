using System;
using BankingSystem.src.BankingSystem.Application.DTOs;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.Services;
using BankingSystem.src.BankingSystem.Application.UseCases;
using BankingSystem.src.BankingSystem.Domain.Common;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;

public interface ITransactionService
{
    Task<TransactionDetailDto> GetTransactionByIdAsync(Guid transactionId);
    Task<IEnumerable<TransactionDetailDto>> GetTransactionsByAccountIdAsync(Guid accountId);
    Task<PaginatedResponseDto<TransactionDetailDto>> GetTransactionsAsync(TransactionSearchParams searchParams);
    Task<PaginatedResponseDto<UserTransactionReponse>> GetUserTransactionsAsync(Guid userId, TransactionSearchParams searchParams);
    Task<TransactionDetailDto> RecordDepositAsync(Guid accountId, DepositRequestDto depositRequestDto);
    Task<TransactionDetailDto> RecordWithdrawAsync(Guid accountId, WithdrawRequestDto withdrawRequestDto);
    Task<TransactionDetailDto> RecordTransferAsync(Guid senderAccountId, TransferRequestDto transferRequestDto);
    Task<TransactionSummaryDto> GetTransactionSummaryAsync(
            GetTransactionsSummaryRequest request,
            CancellationToken cancellationToken);
}
