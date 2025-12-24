using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
namespace BankingSystem.src.BankingSystem.Application.UseCases;

public class WithdrawUseCase
{
    private readonly IAccountService _accountService;
    private readonly ITransactionService _transactionService;

    public WithdrawUseCase(IAccountService accountService, ITransactionService transactionService)
    {
        _accountService = accountService;
        _transactionService = transactionService;
    }

    public async Task<TransactionDetailDto> WithdrawAsync(
    Guid accountId,
    WithdrawRequestDto withdrawRequestDto)
    {
        var success = await _accountService.WithdrawAsync(
            accountId,
            withdrawRequestDto.Amount
        );

        if (!success)
            throw new Exception("Withdraw failed. Please try again.");

        return await _transactionService.RecordWithdrawAsync(
            accountId,
            withdrawRequestDto
        );
    }
}
