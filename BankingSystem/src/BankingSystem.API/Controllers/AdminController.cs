using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
namespace BankingSystem.src.BankingSystem.API.Controllers;

[ApiController]
[Route("api/admin")]
// [Authorize(Roles = "Admin")]
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
    public async Task<ActionResult<IEnumerable<AccountResponseDto>>> GetPaginatedAccounts(
    [FromQuery] string? accountNumber, [FromQuery] int pageNumber, [FromQuery] int pageSize)
    {
        if (!string.IsNullOrWhiteSpace(accountNumber))
        {
            var account = await _accountService
                .GetAccountByAccountNumberAsync(accountNumber);

            if (account is null)
                return NotFound();

            return Ok(new[] { account });
        }

        var accounts = await _accountService.GetPaginatedAccountsAsync(pageNumber, pageSize);
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

    [HttpGet("accounts/{accountId}/user")]
    public async Task<ActionResult<UserDetailsResponse>> GetUserByAccountId(Guid accountId)
    {
        var users = await _accountService.GetUserByAccountIdAsync(accountId);
        return Ok(users);
    }


    [HttpDelete("accounts/{accountId}")]
    public async Task<IActionResult> DeleteAccount(Guid accountId)
    {
        await _accountService.DeleteAccountAsync(accountId);
        return NoContent();
    }

    [HttpPut("accounts/{accountId}")]
    public async Task<IActionResult> UpdateAccount(Guid accountId, [FromBody] UpdateAccountRequestDto updateAccountRequestDto)
    {
        var response = await _accountService.UpdateAccountAsync(accountId, updateAccountRequestDto);
        return Ok(response);
    }

    [HttpPost("accounts/{accountId}/deposit")]
    public async Task<IActionResult> Deposit(Guid accountId, [FromBody] DepositRequestDto depositRequestDto)
    {
        var result = await _depositUseCase.DepositAsync(accountId, depositRequestDto);
        return Ok(result);
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<IEnumerable<TransactionDetailDto>>> GetPaginatedTransactionsAsync([FromQuery] TransactionSearchParams searchParams)
    {
        var response = await _transactionService.GetTransactionsAsync(searchParams);
        return Ok(response);
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
