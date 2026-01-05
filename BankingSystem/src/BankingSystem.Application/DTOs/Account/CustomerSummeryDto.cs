namespace BankingSystem.src.BankingSystem.Application.DTOs.Account;

public record class CustomerSummaryDto(
    int TotalCustomers,
    int ActiveCustomers,
    int InactiveCustomers,
    int NewUsersThisMonth
);