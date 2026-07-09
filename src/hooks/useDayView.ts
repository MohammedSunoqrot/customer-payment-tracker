import { useMemo } from "react"
import { useCustomers } from "../context/CustomersContext"
import { useDayEntries } from "../context/DayEntriesContext"
import { datePart, todayISO } from "../lib/date"
import type { Customer, DayEntry } from "../types"

export interface DayViewItem {
  customer: Customer
  /** null means this customer predates the day-entry system; fall back to their raw schedule. */
  entry: DayEntry | null
}

export function isPendingItem(item: DayViewItem): boolean {
  return !item.entry || item.entry.status === "pending"
}

/**
 * The customers "on the docket" for a given day. Entries are frozen per-day
 * records that are never deleted, so browsing any past day shows exactly what
 * was on that day's list — including items later resolved elsewhere, shown
 * done/grayed rather than removed. When viewing today, still-pending entries
 * from earlier days are carried forward too (the usual overdue behavior).
 */
export function useDayView(selectedDate: string): DayViewItem[] {
  const { customers } = useCustomers()
  const { entries } = useDayEntries()
  const today = todayISO()
  const isToday = selectedDate === today

  return useMemo(() => {
    const byCustomer = new Map<string, DayEntry[]>()
    for (const entry of entries) {
      const arr = byCustomer.get(entry.customerId) ?? []
      arr.push(entry)
      byCustomer.set(entry.customerId, arr)
    }

    const items: DayViewItem[] = []
    for (const customer of customers) {
      const customerEntries = byCustomer.get(customer.id) ?? []
      const representative = isToday
        ? (customerEntries.find((e) => e.date === selectedDate) ??
          customerEntries.find((e) => e.status === "pending" && e.date < selectedDate))
        : customerEntries.find((e) => e.date === selectedDate)

      if (representative) {
        items.push({ customer, entry: representative })
      } else if (
        isToday &&
        customer.status === "active" &&
        customer.nextContactDate &&
        datePart(customer.nextContactDate) <= selectedDate
      ) {
        // Predates the day-entry system: fall back to the raw schedule field.
        items.push({ customer, entry: null })
      }
    }

    return items.sort((a, b) => {
      const aPending = isPendingItem(a)
      const bPending = isPendingItem(b)
      if (aPending !== bPending) return aPending ? -1 : 1
      const aKey = aPending ? (a.customer.nextContactDate ?? "") : (a.entry?.actionAt ?? "")
      const bKey = bPending ? (b.customer.nextContactDate ?? "") : (b.entry?.actionAt ?? "")
      return aKey.localeCompare(bKey)
    })
  }, [customers, entries, selectedDate, isToday])
}
