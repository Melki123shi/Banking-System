using System;
using BankingSystem.src.BankingSystem.Application.Interfaces.Services;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;
using BankingSystem.src.BankingSystem.Application.Interfaces.Repositories;
using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Application.Mappings;
using BankingSystem.src.BankingSystem.Application.DTOs.Auth;
using BankingSystem.Migrations;
using BankingSystem.src.BankingSystem.Application.DTOs;
namespace BankingSystem.src.BankingSystem.Application.Services;

public class AccountService : IAccountService
{
    private readonly IAccountRepository _accountRepository;
    private readonly IUserRepository _userRepository;
    private readonly INumberGenerator _numberGenerator;

    public AccountService(IAccountRepository accountRepository, IUserRepository userRepository, INumberGenerator numberGenerator)
    {
        _accountRepository = accountRepository;
        _userRepository = userRepository;
        _numberGenerator = numberGenerator;
    }

    public async Task<AccountResponseDto> CreateAccountAsync(CreateAccountRequestDto CreateAccountRequestDto)
    {
        User? user = await _userRepository.GetUserByIdAsync(CreateAccountRequestDto.UserId);
        if (user is null)
        {
            throw new InvalidOperationException("User does not exist");
        }

        string accountNumber = _numberGenerator.GenerateAccountNumber("223");
        Account? existingAccountNumber = await _accountRepository.GetByAccountNumberAsync(accountNumber);

        if (existingAccountNumber is not null)
        {
            throw new InvalidOperationException("Account Number Already in use");
        }

        Account account = new Account(
            CreateAccountRequestDto.UserId,
            accountNumber,
            CreateAccountRequestDto.Balance,
            CreateAccountRequestDto.AccountType,
            CreateAccountRequestDto.Status
        );

        await _accountRepository.AddAsync(account);

        return account.ToDto();
    }

    public async Task<List<AccountResponseDto>> GetAccountsByIdsAsync(IEnumerable<Guid> accountIds)
    {
        var accounts = await _accountRepository.GetByIdsAsync(accountIds);
        return accounts.Select(account => account.ToDto()).ToList();
    }

    public async Task<UserDetailsResponse> GetUserByAccountIdAsync(Guid accountId)
    {
        User? user = await _accountRepository.GetUserByAccountIdAsync(accountId);
        if (user == null)
        {
            throw new InvalidOperationException("User not found for the given account number");
        }
        return user.ToDto();
    }

    public async Task<AccountResponseDto> GetAccountByIdAsync(Guid accountId)
    {
        Account? account = await _accountRepository.GetByIdAsync(accountId);
        if (account == null)
        {
            throw new InvalidOperationException("Account not found");
        }
        return account.ToDto();
    }

    public async Task<AccountResponseDto> GetAccountByAccountNumberAsync(string accountNumber)
    {
        Account? account = await _accountRepository.GetByAccountNumberAsync(accountNumber);
        if (account == null)
        {
            throw new InvalidOperationException("Account not found");
        }
        return account.ToDto();
    }
    public async Task<PaginatedResponseDto<AccountResponseDto>> GetPaginatedAccountsAsync(int pageNumber, int pageSize)
    {
        var (accounts, totalCount) = await _accountRepository.GetPaginatedAsync(pageNumber, pageSize);

        var tasks = accounts.Select(async account =>
        {
            var user = await _userRepository.GetUserByIdAsync(account.UserId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found for the given account number");
            }

            return new AccountResponseDto(
                account.Id,
                account.UserId,
                user.FirstName + " " + user.LastName,
                account.AccountNumber,
                account.Type.ToString(),
                account.Balance,
                account.Status.ToString(),
                account.CreatedAt,
                account.UpdatedAt
            );
        });

        return new PaginatedResponseDto<AccountResponseDto>
        {
            Items = await Task.WhenAll(tasks),
            PageSize = pageSize,
            PageNumber = pageNumber,
            TotalCount = totalCount
        };
    }

    public async Task<IEnumerable<AccountResponseDto>> GetAccountsByUserIdAsync(Guid userId)
    {
        var accounts = await _accountRepository.GetByUserIdAsync(userId);
        return accounts.Select(account => account.ToDto());
    }

    public async Task<AccountResponseDto> UpdateAccountAsync(
    Guid accountId,
    UpdateAccountRequestDto request)
    {
        var account = await _accountRepository.GetByIdAsync(accountId);
        if (account is null)
            throw new InvalidOperationException("Account not found");

        var user = await _userRepository.GetUserByIdAsync(account.UserId);
        if (user is null)
            throw new InvalidOperationException("User does not exist");

        account.Update(
            request.AccountNumber,
            request.Balance,
            request.Type,
            request.Status
        );

        await _accountRepository.UpdateAsync(account);

        return new AccountResponseDto(
            account.Id,
            account.UserId,
            user.FirstName + " " + user.LastName,
            account.AccountNumber,
            account.Type.ToString(),
            account.Balance,
            account.Status.ToString(),
            account.CreatedAt,
            account.UpdatedAt
        );
    }


    public async Task DeleteAccountAsync(Guid accountId)
    {
        Account? account = await _accountRepository.GetByIdAsync(accountId);
        if (account == null)
        {
            throw new InvalidOperationException("Account not found");
        }
        await _accountRepository.DeleteAsync(account);
    }

    public async Task<bool> WithdrawAsync(Guid accountId, decimal amount)
    {
        var account = await _accountRepository.GetByIdAsync(accountId);

        if (account == null)
            throw new InvalidOperationException("Account not found");

        account.Withdraw(amount);

        await _accountRepository.UpdateAsync(account);
        return true;
    }

    public async Task<bool> DepositAsync(Guid accountId, decimal amount)
    {
        Account? account = await _accountRepository.GetByIdAsync(accountId);
        if (account == null)
        {
            throw new InvalidOperationException("Account not found");
        }

        account.Deposit(amount);
        await _accountRepository.UpdateAsync(account);
        return true;
    }

    public async Task<bool> TransferAsync(Guid senderAccountId, string receiverAccountNumber, decimal amount)
    {

        Account? toAccount = await _accountRepository.GetByAccountNumberAsync(receiverAccountNumber);
        Account? fromAccount = await _accountRepository.GetByIdAsync(senderAccountId);

        if (fromAccount == null)
            throw new InvalidOperationException("Sender account not found");

        else if (toAccount == null)
            throw new InvalidOperationException("Receiver account not found");

        else if (senderAccountId == toAccount.Id)
            throw new InvalidOperationException("Cannot transfer to the same account");

        else if (amount > fromAccount.Balance) // Assuming 100 must be kept as minimum balance
            throw new InvalidOperationException("Balance is insufficient for the transfer");

        // Withdraw from source account
        fromAccount.Withdraw(amount);
        await _accountRepository.UpdateAsync(fromAccount);

        // Deposit to destination account
        toAccount.Deposit(amount);
        await _accountRepository.UpdateAsync(toAccount);

        return true;
    }

    public async Task<AccountSummaryDto> GetAccountSummaryAsync()
    {
        int totalAccounts = await _accountRepository.GetTotalCountAsync();
        decimal totalBalance = await _accountRepository.GetTotalBalanceAsync();
        int activeAccounts = await _accountRepository.GetActiveTotalCountAsync();
        decimal activeBalance = await _accountRepository.GetActiveTotalBalanceAsync();
        int inactiveAccounts = await _accountRepository.GetInactiveTotalCountAsync();
        decimal inactiveBalance = await _accountRepository.GetInactiveTotalBalanceAsync();

        return new AccountSummaryDto(
            totalAccounts,
            totalBalance,
            activeAccounts,
            activeBalance,
            inactiveAccounts,
            inactiveBalance
        );
    }
}

