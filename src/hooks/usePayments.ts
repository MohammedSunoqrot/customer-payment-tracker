import { useMemo, useSyncExternalStore } from "react"
import { getSnapshot, subscribe } from "../lib/localDb"
import { DEFAULT_CURRENCY } from "../lib/currency"
import type { Payment } from "../types"

export function usePayments(customerId: string | undefined) {
  const db = useSyncExternalStore(subscribe, getSnapshot)

  const payments = useMemo(() => {
    if (!customerId) return []
    return ((db.payments[customerId] ?? []) as Payment[])
      .map((data) => ({ ...data, currency: data.currency ?? DEFAULT_CURRENCY, convertedAmount: data.convertedAmount ?? data.amount }))
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [db, customerId])

  return { payments, loading: false }
}
