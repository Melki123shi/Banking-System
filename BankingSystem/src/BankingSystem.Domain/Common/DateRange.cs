using System;

namespace BankingSystem.src.BankingSystem.Domain.Common;

public sealed class DateRange
{
    public DateTime From { get; }
    public DateTime To { get; }

    private DateRange(DateTime from, DateTime to)
    {
        From = from;
        To = to;
    }

    public static DateRange Create(DateTime from, DateTime to)
    {
        if (from >= to)
            throw new ArgumentException("From must be earlier than To");

        return new DateRange(from, to);
    }

    public static DateRange Today()
    {
        var today = DateTime.UtcNow.Date;
        return new DateRange(today, today.AddDays(1));
    }

    public static DateRange ThisWeek()
    {
        var today = DateTime.UtcNow.Date;
        var diff = (7 + (today.DayOfWeek - DayOfWeek.Monday)) % 7;
        var start = today.AddDays(-diff);
        return new DateRange(start, start.AddDays(7));
    }

    public static DateRange ThisMonth()
    {
        var now = DateTime.UtcNow;
        var start = new DateTime(now.Year, now.Month, 1);
        return new DateRange(start, start.AddMonths(1));
    }

    public static DateRange ThisYear()
    {
        var now = DateTime.UtcNow;
        var start = new DateTime(now.Year, 1, 1);
        return new DateRange(start, start.AddYears(1));
    }
}
