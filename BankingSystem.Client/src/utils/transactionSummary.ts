import type { TransactionSummaryDto, TransactionType } from "@/lib/types";

export function resolveSummaryValue<T>(
  summary: TransactionSummaryDto | undefined,
  type: TransactionType,
  selector: (s: TransactionSummaryDto) => T,
  typeSelector: (t: any) => T
): T | undefined {
  if (!summary) return undefined;

  return type === "All"
    ? selector(summary)
    : typeSelector(summary.byType?.[type]);
}
