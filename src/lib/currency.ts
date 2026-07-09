export type CurrencyCode = "ILS" | "USD" | "JOD" | "OTHER"

export const currencySymbols: Record<Exclude<CurrencyCode, "OTHER">, string> = {
  ILS: "₪",
  USD: "$",
  JOD: "د.أ",
}

/** Resolves the display symbol for a currency, falling back to the manually entered symbol for "OTHER". */
export function resolveCurrencySymbol(code: CurrencyCode, customSymbol?: string | null): string {
  if (code === "OTHER") return customSymbol?.trim() || "?"
  return currencySymbols[code]
}

export const DEFAULT_CURRENCY: CurrencyCode = "ILS"
