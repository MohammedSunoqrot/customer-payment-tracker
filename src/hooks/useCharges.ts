import { useMemo, useSyncExternalStore } from "react"
import { getSnapshot, subscribe } from "../lib/localDb"
import type { Charge } from "../types"

export function useCharges(customerId: string | undefined) {
  const db = useSyncExternalStore(subscribe, getSnapshot)

  const charges = useMemo(() => {
    if (!customerId) return []
    return ((db.charges[customerId] ?? []) as Charge[]).slice().sort((a, b) => b.date.localeCompare(a.date))
  }, [db, customerId])

  return { charges, loading: false }
}
