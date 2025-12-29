using BankingSystem.src.BankingSystem.Domain.Entities;
using BankingSystem.src.BankingSystem.Application.DTOs.Account;

namespace BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public class TransactionDetailDto
{
    public Guid Id { get; set; }
    public string TransactionId { get; set; }
    public string Description { get; set; }
    public TransactionType TransactionType { get; set; }
    public decimal Amount { get; set; }
    public TransactionStatus Status { get; set; }
    public Guid? SenderAccountId { get; set; }
    public string SenderAccountNumber { get; set; }
    public Guid? ReceiverAccountId { get; set; }
    public string ReceiverAccountNumber { get; set; }
    public DateTime? CompletedAt { get; set; }
    public AccountResponseDto? SenderAccount { get; set; }
    public AccountResponseDto? ReceiverAccount { get; set; }
}
