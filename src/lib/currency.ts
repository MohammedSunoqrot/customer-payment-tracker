export type CurrencyCode = "ILS" | "USD" | "JOD"

export const currencyLabels: Record<CurrencyCode, string> = {
  ILS: "شيكل",
  USD: "دولار",
  JOD: "دينار",
}

export const currencySymbols: Record<CurrencyCode, string> = {
  ILS: "₪",
  USD: "$",
  JOD: "د.أ",
}

export const DEFAULT_CURRENCY: CurrencyCode = "ILS"
