namespace BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public record class DepositRequestDto(
    decimal Amount,
    string? Description
    );
