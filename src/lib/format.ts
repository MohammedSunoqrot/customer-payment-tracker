const amountFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
})

/** Formats amounts with Western digits (kept LTR via the .ltr-nums class at render site). */
export function formatAmount(amount: number): string {
  return amountFormatter.format(amount)
}
