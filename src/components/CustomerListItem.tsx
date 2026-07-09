import { Link } from "react-router-dom"
import { currencySymbols } from "../lib/currency"
import { formatAmount } from "../lib/format"
import type { Customer } from "../types"
import { Badge } from "./Badge"

export function CustomerListItem({ customer }: { customer: Customer }) {
  return (
    <Link
      to={`/customers/${customer.id}`}
      className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm active:bg-stone-50"
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate font-medium text-stone-800">{customer.name}</span>
        <span className="ltr-nums text-left text-sm text-stone-500">{customer.phone}</span>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="ltr-nums text-left text-sm font-medium text-stone-700">
          {formatAmount(customer.remainingBalance)} {currencySymbols[customer.currency]}
        </span>
        {customer.status === "closed" && <Badge color="stone">مغلق</Badge>}
      </div>
    </Link>
  )
}
