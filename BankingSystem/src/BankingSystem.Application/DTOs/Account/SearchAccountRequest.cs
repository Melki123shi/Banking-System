namespace BankingSystem.src.BankingSystem.Application.DTOs.Account;

public record class SearchAccountRequest(string? Name, string? AccountNumber, int PageNumber = 1, int PageSize = 10);