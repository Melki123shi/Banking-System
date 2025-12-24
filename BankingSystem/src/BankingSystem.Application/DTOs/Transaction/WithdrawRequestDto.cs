namespace BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public record class WithdrawRequestDto(
    decimal Amount,
    string? Description);
