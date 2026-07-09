import { Search } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { t } = useLanguage()

  return (
    <div className="relative">
      <Search size={18} className="absolute start-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("customers.search")}
        className="w-full rounded-xl border border-stone-300 bg-white py-2.5 ps-10 pe-3 text-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500"
      />
    </div>
  )
}
