import { resolveCurrencySymbol } from "./currency"
import { formatDateTime } from "./date"
import { formatAmount } from "./format"
import type { Lang } from "./i18n"
import type { Customer } from "../types"

/** Compact, plain-text snapshot of every customer's current state for an LLM prompt. */
export function buildCustomersContext(customers: Customer[], lang: Lang): string {
  if (customers.length === 0) return lang === "ar" ? "لا يوجد عملاء بعد." : "No customers yet."

  return customers
    .map((c) => {
      const symbol = resolveCurrencySymbol(c.currency, c.customCurrencySymbol)
      const remaining = `${formatAmount(c.remainingBalance)} ${symbol}`
      const total = `${formatAmount(c.totalOwed)} ${symbol}`
      const lastContact = c.lastContactAt
        ? `${c.lastContactStatus === "contacted" ? "answered" : "not answered"} on ${formatDateTime(c.lastContactAt, lang)}`
        : "never contacted"
      const nextFollowUp = c.status === "active" && c.nextContactDate ? formatDateTime(c.nextContactDate, lang) : "none (case closed or unscheduled)"
      return `- ${c.name}, phone ${c.phone}: owes ${remaining} remaining out of ${total} total, status: ${c.status}, last contact: ${lastContact}, next follow-up: ${nextFollowUp}`
    })
    .join("\n")
}
