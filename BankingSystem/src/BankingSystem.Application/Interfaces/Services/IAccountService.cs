using System;
using BankingSystem.src.BankingSystem.Application.DTOs;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;

public interface IAccountService
{
    Task<AccountResponseDto> CreateAccountAsync(CreateAccountRequestDto CreateAccountRequestDto);
    Task<AccountResponseDto> GetAccountByIdAsync(Guid accountId);
    Task<AccountResponseDto> GetAccountByAccountNumberAsync(string accountNumber);

    Task<UserDetailsResponse> GetUserByAccountIdAsync(Guid accountId);
    Task<List<AccountResponseDto>> GetAccountsByIdsAsync(IEnumerable<Guid> accountIds);

    Task<AccountSummaryDto> GetAccountSummaryAsync();

    Task<PaginatedResponseDto<AccountResponseDto>> GetPaginatedAccountsAsync(int pageNumber, int pageSize);
    Task<IEnumerable<AccountResponseDto>> GetAccountsByUserIdAsync(Guid userId);
    Task<AccountResponseDto>  UpdateAccountAsync(Guid accountId, UpdateAccountRequestDto UpdateAccountRequestDto);
    Task DeleteAccountAsync(Guid accountId);

    // Account Transaction related methods 
    Task<bool> DepositAsync(Guid accountId, decimal amount);
    Task<bool> WithdrawAsync(Guid accountId, decimal amount);
    Task<bool> TransferAsync(Guid senderAccountId, string receiverAccountNumber, decimal amount);
}
