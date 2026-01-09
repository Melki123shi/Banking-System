using BankingSystem.src.BankingSystem.Application.DTOs.Transaction;

public sealed record TransactionSummaryDto(
    int TotalTransactions,
    decimal TotalAmount,

    int CompletedTransactions,
    decimal CompletedAmount,
    int FailedTransactions,
    decimal FailedAmount,
    int PendingTransactions,
    decimal PendingAmount,

    IReadOnlyDictionary<TransactionType, TransactionTypeSummary> ByType
)
{
    public static TransactionSummaryDto FromAggregates(
        IEnumerable<dynamic> aggregates)
    {
        var list = aggregates.ToList();

        int Count(Func<dynamic, bool> p) => list.Where(p).Sum(x => (int)x.Count);
        decimal Amount(Func<dynamic, bool> p) => list.Where(p).Sum(x => (decimal)x.Amount);

        var byType = list
            .GroupBy(x => (TransactionType)x.Type)
            .ToDictionary(
                g => g.Key,
                g => new TransactionTypeSummary(
                    TotalTransactions: g.Sum(x => (int)x.Count),
                    TotalAmount: g.Sum(x => (decimal)x.Amount),

                    CompletedTransactions: g.Where(x => x.Status == TransactionStatus.Completed).Sum(x => (int)x.Count),
                    CompletedAmount: g.Where(x => x.Status == TransactionStatus.Completed).Sum(x => (decimal)x.Amount),

                    FailedTransactions: g.Where(x => x.Status == TransactionStatus.Failed).Sum(x => (int)x.Count),
                    FailedAmount: g.Where(x => x.Status == TransactionStatus.Failed).Sum(x => (decimal)x.Amount),

                    PendingTransactions: g.Where(x => x.Status == TransactionStatus.Pending).Sum(x => (int)x.Count),
                    PendingAmount: g.Where(x => x.Status == TransactionStatus.Pending).Sum(x => (decimal)x.Amount)
                ));

        return new TransactionSummaryDto(
            TotalTransactions: Count(_ => true),
            TotalAmount: Amount(_ => true),

            CompletedTransactions: Count(x => x.Status == TransactionStatus.Completed),
            CompletedAmount: Amount(x => x.Status == TransactionStatus.Completed),

            FailedTransactions: Count(x => x.Status == TransactionStatus.Failed),
            FailedAmount: Amount(x => x.Status == TransactionStatus.Failed),

            PendingTransactions: Count(x => x.Status == TransactionStatus.Pending),
            PendingAmount: Amount(x => x.Status == TransactionStatus.Pending),

            ByType: byType
        );
    }
}
