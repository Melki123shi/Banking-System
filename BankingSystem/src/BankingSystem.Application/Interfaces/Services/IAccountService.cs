using System;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;
namespace BankingSystem.src.BankingSystem.Application.Interfaces.Services;

public interface IAccountService
{
    Task<AccountResponseDto> CreateAccountAsync(CreateAccountRequestDto CreateAccountRequestDto);
    Task<AccountResponseDto> GetAccountByIdAsync(Guid accountId);
    Task<AccountResponseDto> GetAccountByAccountNumberAsync(string accountNumber);

    //! Paginated implementation to be added in the future
    Task<IEnumerable<AccountResponseDto>> GetAllAccountsAsync();
    //! Get accounts by UserId pagination to be added in the future
    Task<IEnumerable<AccountResponseDto>> GetAccountsByUserIdAsync(Guid userId);
    // Task<AccountResponseDto>  UpdateAccountAsync(Guid accountId, UpdateAccountRequestDto UpdateAccountRequestDto);
    Task DeleteAccountAsync(Guid accountId);

    // Account Transaction related methods 
    Task<bool> DepositAsync(Guid accountId, decimal amount);
    Task<bool> WithdrawAsync(Guid accountId, decimal amount);
    Task<bool> TransferAsync(Guid senderAccountId, string receiverAccountNumber, decimal amount);
}
