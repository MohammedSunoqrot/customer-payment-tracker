import { useMemo, useSyncExternalStore } from "react"
import { getSnapshot, subscribe } from "../lib/localDb"
import type { Deduction } from "../types"

export function useDeductions(customerId: string | undefined) {
  const db = useSyncExternalStore(subscribe, getSnapshot)

  const deductions = useMemo(() => {
    if (!customerId) return []
    return ((db.deductions[customerId] ?? []) as Deduction[]).slice().sort((a, b) => b.date.localeCompare(a.date))
  }, [db, customerId])

  return { deductions, loading: false }
}
