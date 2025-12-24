using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
namespace BankingSystem.src.BankingSystem.Application.UseCases;

public class TransferUseCase
{
    private readonly IAccountService _accountService;
    private readonly ITransactionService _transactionService;

    public TransferUseCase(IAccountService accountService, ITransactionService transactionService)
    {
        _accountService = accountService;
        _transactionService = transactionService;
    }

    public async Task<TransactionDetailDto> TransferAsync(Guid senderAccountId, TransferRequestDto transferRequestDto)
    {
        // Update Account Balance
        bool IsSuccess = await _accountService.TransferAsync(senderAccountId, transferRequestDto.ReceiverAccountNumber, transferRequestDto.Amount);
        if (!IsSuccess)
        {
            throw new Exception("Transfer failed. Please try again.");
        }

        // Record Transaction
        return await _transactionService.RecordTransferAsync(senderAccountId, transferRequestDto);
    }

}
