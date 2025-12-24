using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BankingSystem.src.BankingSystem.Application.UseCases;
using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
namespace BankingSystem.src.BankingSystem.API.Controllers;

[ApiController]
[Route("api/")]
[Authorize(Roles = "Customer, Admin")]
public class CustomerController : ControllerBase
{
    private readonly WithdrawUseCase _withdrawUseCase;
    private readonly TransferUseCase _transferUseCase;
    private readonly IUserManagementService _userService;
    public CustomerController(
        WithdrawUseCase withdrawUseCase,
        TransferUseCase transferUseCase,
        IUserManagementService userService)
    {
        _withdrawUseCase = withdrawUseCase;
        _transferUseCase = transferUseCase;
        _userService = userService;
    }

    [HttpPost("accounts/{accountId}/withdraw")]
    public async Task<IActionResult> Withdraw(
        Guid accountId,
        [FromBody] WithdrawRequestDto withdrawRequestDto)
    {
        var response = await _withdrawUseCase.WithdrawAsync(accountId, withdrawRequestDto);
        return Ok(response);
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


}
