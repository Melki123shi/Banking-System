using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;

public interface IAccountService
{
    Task<AccountResponseDto> CreateAccountAsync(CreateAccountRequestDto CreateAccountRequestDto);
    Task<AccountResponseDto> GetAccountByIdAsync(Guid accountId);
    Task<AccountResponseDto> GetAccountByAccountNumberAsync(string accountNumber);

    Task<UserDetailsResponse> GetUserByAccountIdAsync(Guid accountId);

    //! Paginated implementation to be added in the future
    Task<IEnumerable<AccountResponseDto>> GetPaginatedAccountsAsync(int pageNumber, int pageSize);
    //! Get accounts by UserId pagination to be added in the future
    Task<IEnumerable<AccountResponseDto>> GetPaginatedAccountsByUserIdAsync(Guid userId, int pageNumber, int pageSize);
    // Task<AccountResponseDto>  UpdateAccountAsync(Guid accountId, UpdateAccountRequestDto UpdateAccountRequestDto);
    Task DeleteAccountAsync(Guid accountId);

    // Account Transaction related methods 
    Task<bool> DepositAsync(Guid accountId, decimal amount);
    Task<bool> WithdrawAsync(Guid accountId, decimal amount);
    Task<bool> TransferAsync(Guid senderAccountId, string receiverAccountNumber, decimal amount);
}
