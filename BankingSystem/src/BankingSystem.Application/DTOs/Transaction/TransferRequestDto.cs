using System.ComponentModel.DataAnnotations;

namespace BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public record class TransferRequestDto(
    string ReceiverAccountNumber,
    [Range(0, double.MaxValue)] decimal Amount,
    string? Description
);
