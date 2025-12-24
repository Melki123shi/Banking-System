using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Application.Mappings;
using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

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

    public async Task<IEnumerable<TransactionDetailDto>> GetAllTransactionsAsync()
    {
        var transactions = await _transactionRepository.GetAllTransactionsAsync();
        return transactions.Select(transaction => transaction.ToDto());
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
}
