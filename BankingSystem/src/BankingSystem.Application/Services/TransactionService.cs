using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Application.Mappings;
using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.DTOs;
using BankingSystem.src.BankingSystem.Application.UseCases;
using BankingSystem.src.BankingSystem.Domain.Enums;
using BankingSystem.src.BankingSystem.Domain.Common;

namespace BankingSystem.src.BankingSystem.Application.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IAccountService _accountService;
    public INumberGenerator _transactionNumberGenerator;

    public TransactionService(
        ITransactionRepository transactionRepository,
         INumberGenerator transactionNumberGenerator,
         IAccountService accountService)
    {
        _transactionRepository = transactionRepository;
        _transactionNumberGenerator = transactionNumberGenerator;
        _accountService = accountService;
    }

    public async Task<TransactionDetailDto> GetTransactionByIdAsync(Guid transactionId)
    {
        Transaction? transaction = await _transactionRepository.GetTransactionByIdAsync(transactionId);
        if (transaction == null)
        {
            throw new Exception("Transaction not found");
        }
        return transaction.ToDto();
    }

    public async Task<IEnumerable<TransactionDetailDto>> GetTransactionsByAccountIdAsync(Guid accountId)
    {
        var transactions = await _transactionRepository.GetTransactionsByAccountIdAsync(accountId);
        return transactions.Select(transaction => transaction.ToDto());
    }

    public async Task<PaginatedResponseDto<TransactionDetailDto>> GetTransactionsAsync(TransactionSearchParams searchParams)
    {
        var (items, total) = await _transactionRepository.GetTransactionsAsync(searchParams);
        return new PaginatedResponseDto<TransactionDetailDto>
        {
            Items = items.Select(t => t.ToDto()),
            PageNumber = searchParams.PageNumber,
            PageSize = searchParams.PageSize,
            TotalCount = total
        };
    }



    public async Task<PaginatedResponseDto<UserTransactionReponse>> GetUserTransactionsAsync(Guid userId, TransactionSearchParams searchParams)
    {
        var (items, total) = await _transactionRepository.GetTransactionsAsync(searchParams, userId);

        return new PaginatedResponseDto<UserTransactionReponse>
        {
            Items = items.Select(transaction =>
               new UserTransactionReponse(
                    transaction.TransactionId,
                    transaction.Amount,
                    transaction.CreatedAt,
                    transaction.Type.ToString() == "Deposit" ? "IN" : "OUT",
                    transaction.SenderAccount?.AccountNumber ?? string.Empty,
                    (transaction.SenderAccount?.UserId == userId
                        ? transaction.ReceiverAccount?.User.FirstName + " " + transaction.ReceiverAccount?.User.LastName
                        : transaction.SenderAccount?.User.FirstName + " " + transaction.SenderAccount?.User.LastName) ?? string.Empty,
                    (transaction.SenderAccount?.UserId == userId
                        ? transaction.ReceiverAccount?.AccountNumber
                        : transaction.SenderAccount?.AccountNumber) ?? string.Empty,
                    transaction.Type.ToString(),
                    transaction.Description ?? string.Empty
                )
     ),
            TotalCount = total
        };
    }


    public async Task<TransactionDetailDto> RecordWithdrawAsync(Guid accountId, WithdrawRequestDto withdrawRequestDto)
    {

        string transactionId = _transactionNumberGenerator.GenerateTransactionNumber("M");

        Transaction transaction = new Transaction(
            transactionId,
            withdrawRequestDto.Amount,
            TransactionType.Withdrawal,
            accountId,
            null,
            withdrawRequestDto.Description,
            DateTime.UtcNow
        );

        transaction.Complete();
        await _transactionRepository.AddAsync(transaction);

        return transaction.ToDto();
    }

    public async Task<TransactionDetailDto> RecordDepositAsync(Guid accountId, DepositRequestDto depositRequestDto)
    {
        string transactionId = _transactionNumberGenerator.GenerateTransactionNumber("M");

        Transaction transaction = new Transaction(
            transactionId,
            depositRequestDto.Amount,
            TransactionType.Deposit,
            accountId,
            null,
            depositRequestDto.Description,
            DateTime.UtcNow
        );

        transaction.Complete();
        await _transactionRepository.AddAsync(transaction);

        return transaction.ToDto();
    }

    public async Task<TransactionDetailDto> RecordTransferAsync(Guid senderAccountId, TransferRequestDto transferRequestDto)
    {
        string transactionId = _transactionNumberGenerator.GenerateTransactionNumber("M");
        var receiverAccountId = await _accountService.GetAccountByAccountNumberAsync(transferRequestDto.ReceiverAccountNumber);

        if (receiverAccountId == null)
            throw new InvalidOperationException("Receiver account not found");

        Transaction transaction = new Transaction(
            transactionId,
            transferRequestDto.Amount,
            TransactionType.Transfer,
            senderAccountId,
            receiverAccountId.Id,
            transferRequestDto.Description,
            DateTime.UtcNow
        );

        transaction.Complete();
        await _transactionRepository.AddAsync(transaction);

        return transaction.ToDto();
    }


    public async Task<TransactionSummaryDto> GetTransactionSummaryAsync(
     GetTransactionsSummaryRequest request,
     CancellationToken cancellationToken)
    {
        // Validate custom period
        if (request.Period == SummaryPeriod.Custom)
        {
            if (!request.From.HasValue || !request.To.HasValue)
                throw new ArgumentException("From and To are required for custom period");

            if (request.To < request.From)
                throw new ArgumentException("To must be greater than or equal to From");
        }

        // Resolve date range
        DateRange? range = request.Period switch
        {
            SummaryPeriod.All => null,
            SummaryPeriod.ThisWeek => DateRange.ThisWeek(),
            SummaryPeriod.ThisMonth => DateRange.ThisMonth(),
            SummaryPeriod.ThisYear => DateRange.ThisYear(),
            SummaryPeriod.Custom => DateRange.Create(
                request.From!.Value,
                request.To!.Value),
            _ => null
        };

        return await _transactionRepository.GetTransactionSummaryAsync(
            range,
            request.Types!,
            cancellationToken);
    }

}
