using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;

namespace BankingSystem.src.BankingSystem.Application.UseCases;

public class DepositUseCase
{
    private readonly IAccountService _accountService;
    private readonly ITransactionService _transactionService;

    public DepositUseCase(IAccountService accountService, ITransactionService transactionService)
    {
        _accountService = accountService;
        _transactionService = transactionService;
    }

    public async Task<TransactionDetailDto> DepositAsync(Guid accountId, DepositRequestDto depositRequestDto)
    {
        // Update Account Balance
        bool IsSuccess = await _accountService.DepositAsync(accountId, depositRequestDto.Amount);
        if (!IsSuccess)
        {
            throw new Exception("Deposit failed. Please try again.");
        }

        // Record Transaction
        //! handle transaction failed
        return await _transactionService.RecordDepositAsync(accountId, depositRequestDto);
        
    }

}
