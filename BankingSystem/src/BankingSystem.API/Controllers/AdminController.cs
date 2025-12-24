using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace BankingSystem.src.BankingSystem.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IAccountService _accountService;
    private readonly ITransactionService _transactionService;

    private readonly DepositUseCase _depositUseCase;
    private readonly WithdrawUseCase _withdrawUseCase;
    private readonly TransferUseCase _transferUseCase;
    public AdminController(IAccountService accountService,
     ITransactionService transactionService, 
     DepositUseCase depositUseCase,
        WithdrawUseCase withdrawUseCase, 
        TransferUseCase transferUseCase)
    {
        _accountService = accountService;
        _transactionService = transactionService;
        _depositUseCase = depositUseCase;
        _withdrawUseCase = withdrawUseCase;
        _transferUseCase = transferUseCase;
    }

    [HttpGet("accounts")]
    public async Task<ActionResult<IEnumerable<AccountResponseDto>>> GetAccounts(
    [FromQuery] string? accountNumber)
    {
        if (!string.IsNullOrWhiteSpace(accountNumber))
        {
            var account = await _accountService
                .GetAccountByAccountNumberAsync(accountNumber);

            if (account is null)
                return NotFound();

            return Ok(new[] { account });
        }

        var accounts = await _accountService.GetAllAccountsAsync();
        return Ok(accounts);
    }


    [HttpGet("accounts/user/{userId}")]
    public async Task<ActionResult<IEnumerable<AccountResponseDto>>> GetAccountsByUserId(Guid userId)
    {
        var accounts = await _accountService.GetAccountsByUserIdAsync(userId);
        return Ok(accounts);
    }

    [HttpGet("accounts/{accountId}")]
    public async Task<ActionResult<AccountResponseDto>> GetAccountById(Guid accountId)
    {
        var account = await _accountService.GetAccountByIdAsync(accountId);
        if (account == null)
        {
            return NotFound();
        }
        return Ok(account);
    }

    [HttpPost("accounts")]
    public async Task<ActionResult<AccountResponseDto>> CreateAccount([FromBody] CreateAccountRequestDto createAccountRequestDto)
    {
        var account = await _accountService.CreateAccountAsync(createAccountRequestDto);
        return CreatedAtAction(nameof(GetAccountById), new { accountId = account.Id }, account);
    }


    [HttpDelete("accounts/{accountId}")]
    public async Task<IActionResult> DeleteAccount(Guid accountId)
    {
        await _accountService.DeleteAccountAsync(accountId);
        return NoContent();
    }

    // [HttpPut("accounts/{accountId}")]
    // public async Task<IActionResult> UpdateAccount(Guid accountId, [FromBody] UpdateAccountRequestDto updateAccountRequestDto)
    // {
    //     await _accountService.UpdateAccountAsync(accountId, updateAccountRequestDto);
    //     return NoContent();
    // }

    [HttpPost("accounts/{accountId}/deposit")]
    public async Task<IActionResult> Deposit(Guid accountId, [FromBody] DepositRequestDto depositRequestDto)
    {
        var result = await _depositUseCase.DepositAsync(accountId, depositRequestDto);
        return Ok(result);
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<IEnumerable<TransactionDetailDto>>> GetAllTransactions()
    {
        var transactions = await _transactionService.GetAllTransactionsAsync();
        return Ok(transactions);
    }   

    [HttpPost("accounts/{accountId}/withdraw")]
    public async Task<IActionResult> Withdraw(Guid accountId, [FromBody] WithdrawRequestDto withdrawRequestDto)
    {
        var result = await _withdrawUseCase.WithdrawAsync(accountId, withdrawRequestDto);
        return Ok(result);
    }

    [HttpPost("accounts/{accountId}/transfer")]
    public async Task<IActionResult> Transfer(Guid accountId, [FromBody] TransferRequestDto transferRequestDto)
    {
        var result = await _transferUseCase.TransferAsync(accountId, transferRequestDto);
        return Ok(result);
    }
    
}       
