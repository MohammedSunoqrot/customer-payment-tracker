import { Plus, Users } from "lucide-react"
import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { CustomerListItem } from "../components/CustomerListItem"
import { EmptyState } from "../components/EmptyState"
import { SearchBar } from "../components/SearchBar"
import { useCustomers } from "../context/CustomersContext"
import { useLanguage } from "../context/LanguageContext"
import type { CustomerStatus } from "../types"

type StatusFilter = CustomerStatus | "all"

const filters: { value: StatusFilter; key: "filter.active" | "filter.closed" | "filter.all" }[] = [
  { value: "active", key: "filter.active" },
  { value: "closed", key: "filter.closed" },
  { value: "all", key: "filter.all" },
]

export function CustomersPage() {
  const { t } = useLanguage()
  const { customers } = useCustomers()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active")

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return customers.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false
      if (!term) return true
      return c.name.toLowerCase().includes(term) || c.phone.includes(term)
    })
  }, [customers, search, statusFilter])

  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 flex items-center justify-between bg-stone-50 px-4 pb-2 pt-5 dark:bg-stone-950">
        <h1 className="text-xl font-semibold text-stone-800 dark:text-stone-100">{t("customers.title")}</h1>
        <Link
          to="/customers/new"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-700 text-white dark:bg-teal-600"
          aria-label={t("customers.addAria")}
        >
          <Plus size={20} />
        </Link>
      </header>

      <div className="flex flex-col gap-3 px-4 pb-2">
        <SearchBar value={search} onChange={setSearch} />
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                statusFilter === f.value
                  ? "bg-teal-700 text-white dark:bg-teal-600"
                  : "bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-300"
              }`}
            >
              {t(f.key)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} text={t("customers.empty")} />
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {filtered.map((customer) => (
            <CustomerListItem key={customer.id} customer={customer} />
          ))}
        </div>
      )}
    </div>
  )
}
