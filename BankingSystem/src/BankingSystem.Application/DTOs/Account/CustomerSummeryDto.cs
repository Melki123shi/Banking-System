namespace BankingSystem.src.BankingSystem.Application.DTOs.Account;

public record class CustomerSummeryDto(
    int TotalCustomers,
    int ActiveCustomers,
    int InactiveCustomers
);