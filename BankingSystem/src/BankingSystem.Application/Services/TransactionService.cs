using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Application.Mappings;
using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.DTOs;

namespace BankingSystem.src.BankingSystem.Application.Services;

public class TransactionService : ITransactionService
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly IAccountService _accountService;
    public ITransactionNumberGenerator _transactionNumberGenerator;

    public TransactionService(
        ITransactionRepository transactionRepository,
         ITransactionNumberGenerator transactionNumberGenerator,
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



    public async Task<PaginatedResponseDto<TransactionDetailDto>> GetPaginatedTransactionsAsync(
    int pageNumber,
    int pageSize)
    {
        var transactions = await _transactionRepository
            .GetPaginatedTransactionsAsync(pageNumber, pageSize);

        var totalCount = await _transactionRepository.GetTotalCountAsync();

        var accountIds = transactions
            .SelectMany(t => new[] { t.SenderAccountId, t.ReceiverAccountId })
            .Where(id => id.HasValue)
            .Select(id => id!.Value)
            .Distinct()
            .ToList();

        var accounts = await _accountService.GetAccountsByIdsAsync(accountIds);

        var accountMap = accounts.ToDictionary(a => a.Id);

        var items = transactions.Select(t =>
        {
            accountMap.TryGetValue(t.SenderAccountId ?? Guid.Empty, out var sender);
            accountMap.TryGetValue(t.ReceiverAccountId ?? Guid.Empty, out var receiver);

            return new TransactionDetailDto
            {
                Id = t.Id,
                TransactionId = t.TransactionId,
                Amount = t.Amount,
                TransactionType = t.Type,
                Status = t.Status,
                SenderAccountId = t.SenderAccountId,
                SenderAccountNumber = sender?.AccountNumber ?? "-",
                ReceiverAccountId = t.ReceiverAccountId,
                ReceiverAccountNumber = receiver?.AccountNumber ?? "-",
                SenderAccount = sender,
                ReceiverAccount = receiver,
                Description = t.Description ?? string.Empty,
                CompletedAt = t.CompletedAt
            };
        }).ToList();

        return new PaginatedResponseDto<TransactionDetailDto>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }





    public async Task<TransactionDetailDto> RecordWithdrawAsync(Guid accountId, WithdrawRequestDto withdrawRequestDto)
    {

        string transactionId = _transactionNumberGenerator.Generate("M");

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
        string transactionId = _transactionNumberGenerator.Generate("M");

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
        string transactionId = _transactionNumberGenerator.Generate("M");
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

    public async Task<IEnumerable<TransactionDetailDto>> GetPaginatedCustomerTransactionsAsync(Guid customerId, int pageNumber, int pageSize)
    {
        var accounts = await _accountService.GetAccountsByUserIdAsync(customerId);
        if (accounts == null || !accounts.Any())
            throw new InvalidOperationException("No accounts found for the customer");

        var aggregated = new List<Transaction>();

        foreach (var account in accounts)
        {
            var page = await _transactionRepository.GetPaginatedTransactionsByAccountIdAsync(
                account.Id, pageNumber, pageSize);

            if (page != null)
                aggregated.AddRange(page);
        }

        return aggregated.Select(t => t.ToDto());
    }
}
