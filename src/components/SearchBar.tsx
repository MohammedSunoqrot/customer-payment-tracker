import { Search } from "lucide-react"

export function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="بحث بالاسم أو رقم الجوال"
        className="w-full rounded-xl border border-stone-300 bg-white py-2.5 ps-10 pe-3 text-sm"
      />
    </div>
  )
}
