import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react"
import { getSnapshot, subscribe } from "../lib/localDb"
import type { DayEntry } from "../types"

interface DayEntriesContextValue {
  entries: DayEntry[]
  loading: boolean
}

const DayEntriesContext = createContext<DayEntriesContextValue | null>(null)

export function DayEntriesProvider({ children }: { children: ReactNode }) {
  const db = useSyncExternalStore(subscribe, getSnapshot)
  const entries = useMemo(() => Object.values(db.dayEntries) as DayEntry[], [db])

  return <DayEntriesContext.Provider value={{ entries, loading: false }}>{children}</DayEntriesContext.Provider>
}

export function useDayEntries(): DayEntriesContextValue {
  const ctx = useContext(DayEntriesContext)
  if (!ctx) throw new Error("useDayEntries must be used within DayEntriesProvider")
  return ctx
}
