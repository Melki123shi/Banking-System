using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;

namespace BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public class TransactionDetailDto
{
    public Guid Id { get; set; }
    public string TransactionId { get; set; } = null!;
    public string Description { get; set; } = null!;
    public TransactionType TransactionType { get; set; }
    public decimal Amount { get; set; }
    public TransactionStatus Status { get; set; }
    public Guid? SenderAccountId { get; set; }
    public string SenderAccountNumber { get; set; } = null!;
    public Guid? ReceiverAccountId { get; set; }
    public string ReceiverAccountNumber { get; set; } = null!;
    public DateTime? CompletedAt { get; set; }
    public AccountResponseDto? SenderAccount { get; set; }
    public AccountResponseDto? ReceiverAccount { get; set; }
}
