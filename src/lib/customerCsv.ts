import { addCustomer } from "./actions"
import { parseCsv, toCsv } from "./csv"
import { DEFAULT_CURRENCY, type CurrencyCode } from "./currency"
import { nowISO } from "./date"
import type { Customer, PaymentMethod } from "../types"

const EXPORT_HEADERS = [
  "name",
  "phone",
  "currency",
  "customCurrencySymbol",
  "totalOwed",
  "remainingBalance",
  "paymentType",
  "paymentTypeOther",
  "notes",
  "nextContactDate",
  "status",
  "closeReason",
]

export function exportCustomersCsv(customers: Customer[]): string {
  const rows = customers.map((c) => [
    c.name,
    c.phone,
    c.currency,
    c.customCurrencySymbol ?? "",
    String(c.totalOwed),
    String(c.remainingBalance),
    c.paymentType,
    c.paymentTypeOther ?? "",
    c.notes,
    c.nextContactDate ?? "",
    c.status,
    c.closeReason ?? "",
  ])
  return toCsv(EXPORT_HEADERS, rows)
}

const VALID_CURRENCIES: CurrencyCode[] = ["ILS", "USD", "JOD", "OTHER"]
const VALID_METHODS: PaymentMethod[] = ["cash", "check", "other"]

export interface ImportResult {
  imported: number
  skipped: number
}

/**
 * Bulk-adds new customers from a CSV. Column order is flexible — matched by
 * header name (case-insensitive) — so both the app's own export and a
 * hand-built spreadsheet with at least name/phone/totalOwed work.
 */
export async function importCustomersCsv(text: string): Promise<ImportResult> {
  const rows = parseCsv(text)
  if (rows.length < 2) return { imported: 0, skipped: 0 }

  const header = rows[0].map((h) => h.trim().toLowerCase())
  const col = (name: string) => header.indexOf(name)
  const nameIdx = col("name")
  const phoneIdx = col("phone")
  const totalOwedIdx = col("totalowed")

  if (nameIdx === -1 || phoneIdx === -1 || totalOwedIdx === -1) {
    return { imported: 0, skipped: rows.length - 1 }
  }

  const currencyIdx = col("currency")
  const customSymbolIdx = col("customcurrencysymbol")
  const paymentTypeIdx = col("paymenttype")
  const paymentTypeOtherIdx = col("paymenttypeother")
  const notesIdx = col("notes")
  const nextContactIdx = col("nextcontactdate")

  let imported = 0
  let skipped = 0

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const name = row[nameIdx]?.trim()
    const phone = row[phoneIdx]?.trim()
    const totalOwed = Number(row[totalOwedIdx])

    if (!name || !phone || !Number.isFinite(totalOwed) || totalOwed <= 0) {
      skipped++
      continue
    }

    const currencyRaw = (currencyIdx >= 0 ? row[currencyIdx]?.trim().toUpperCase() : "") || DEFAULT_CURRENCY
    const currency = VALID_CURRENCIES.includes(currencyRaw as CurrencyCode) ? (currencyRaw as CurrencyCode) : DEFAULT_CURRENCY

    const paymentTypeRaw = (paymentTypeIdx >= 0 ? row[paymentTypeIdx]?.trim().toLowerCase() : "") || "cash"
    const paymentType = VALID_METHODS.includes(paymentTypeRaw as PaymentMethod) ? (paymentTypeRaw as PaymentMethod) : "cash"

    const nextContactDate = (nextContactIdx >= 0 ? row[nextContactIdx]?.trim() : "") || nowISO()

    await addCustomer({
      name,
      phone,
      currency,
      customCurrencySymbol: customSymbolIdx >= 0 ? (row[customSymbolIdx]?.trim() ?? undefined) : undefined,
      totalOwed,
      paymentType,
      paymentTypeOther: paymentTypeOtherIdx >= 0 ? (row[paymentTypeOtherIdx]?.trim() ?? undefined) : undefined,
      notes: notesIdx >= 0 ? (row[notesIdx]?.trim() ?? "") : "",
      nextContactDate,
    })
    imported++
  }

  return { imported, skipped }
}
