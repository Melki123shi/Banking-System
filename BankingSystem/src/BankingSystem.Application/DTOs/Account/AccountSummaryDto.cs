namespace BankingSystem.src.BankingSystem.Application.DTOs.Account;

public record class AccountSummaryDto(
    int TotalAccounts,
    decimal TotalBalance,
    int ActiveAccounts,
    decimal ActiveBalance,
    int InactiveAccounts,
    decimal InactiveBalance
);