import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react"
import { getSnapshot, subscribe } from "../lib/localDb"
import { DEFAULT_CURRENCY } from "../lib/currency"
import type { Customer } from "../types"

interface CustomersContextValue {
  customers: Customer[]
  loading: boolean
}

const CustomersContext = createContext<CustomersContextValue | null>(null)

export function CustomersProvider({ children }: { children: ReactNode }) {
  const db = useSyncExternalStore(subscribe, getSnapshot)

  const customers = useMemo(() => {
    return Object.values(db.customers)
      .map(
        (data) =>
          ({
            ...data,
            currency: data.currency ?? DEFAULT_CURRENCY,
          }) as Customer,
      )
      .sort((a, b) => (a.nextContactDate ?? "").localeCompare(b.nextContactDate ?? ""))
  }, [db])

  return <CustomersContext.Provider value={{ customers, loading: false }}>{children}</CustomersContext.Provider>
}

export function useCustomers(): CustomersContextValue {
  const ctx = useContext(CustomersContext)
  if (!ctx) throw new Error("useCustomers must be used within CustomersProvider")
  return ctx
}
