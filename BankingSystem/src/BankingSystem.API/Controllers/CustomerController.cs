using System;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BankingSystem.src.BankingSystem.Application.UseCases;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;
namespace BankingSystem.src.BankingSystem.API.Controllers;

[ApiController]
[Route("api/")]
public class CustomerController : ControllerBase
{
    private readonly WithdrawUseCase _withdrawUseCase;
    private readonly TransferUseCase _transferUseCase;
    private readonly IUserManagementService _userService;
    private readonly IAccountService _accountService;
    private readonly ITransactionService _transactionService;
    public CustomerController(
        WithdrawUseCase withdrawUseCase,
        TransferUseCase transferUseCase,
        IUserManagementService userService,
        IAccountService accountService,
        ITransactionService transactionService)
    {
        _withdrawUseCase = withdrawUseCase;
        _transferUseCase = transferUseCase;
        _userService = userService;
        _accountService = accountService;
        _transactionService = transactionService;
    }

    [HttpPost("accounts/{accountId}/withdraw")]
    public async Task<IActionResult> Withdraw(
        Guid accountId,
        [FromBody] WithdrawRequestDto withdrawRequestDto)
    {
        var response = await _withdrawUseCase.WithdrawAsync(accountId, withdrawRequestDto);
        return Ok(response);
    }

    [HttpGet("accounts/summary")]
    public async Task<ActionResult<CustomerSummaryDto>> GetCustomerSummary()
    {
        var summary = await _userService.GetCustomerSummaryAsync();
        return Ok(summary);
    }

    [HttpPost("accounts/{senderAccountId}/transfer")]
    public async Task<IActionResult> Transfer(Guid senderAccountId, [FromBody] TransferRequestDto transferRequestDto)
    {
        var response = await _transferUseCase.TransferAsync(senderAccountId, transferRequestDto);
        return Ok(response);
    }

    [HttpGet("/me/{customerId}")]
    public async Task<IActionResult> GetCustomerDetails(Guid customerId)
    {
        var result = await _userService.GetUserDetailsAsync(customerId);
        return Ok(result);
    }

    [HttpGet("transactions/{customerId}")]
    public async Task<IActionResult> GetAccountTransactions(Guid customerId, [FromQuery] TransactionSearchParams searchParams)
    {
        //! To be implemented using the logged in user's ID
        // var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        // if (claim is null || !Guid.TryParse(claim, out var userId))
        // {
        //     return Unauthorized();
        // }

        // We pass the userId to restrict the search to ONLY this customer
        var user = await _userService.GetUserDetailsAsync(customerId);
        if (user == null)
        {
            return NotFound("User not found");
        }
        var response = await _transactionService.GetUserTransactionsAsync(customerId, searchParams);
        return Ok(response);
    }

    [HttpGet("accounts/{customerId}")]
    public async Task<IActionResult> GetCustomerAccounts(Guid customerId)
    {
        var response = await _accountService.GetAccountsByUserIdAsync(customerId);
        return Ok(response);
    }
}