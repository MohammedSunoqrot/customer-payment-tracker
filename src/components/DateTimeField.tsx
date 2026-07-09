import { useLanguage } from "../context/LanguageContext"
import { formatDateTime } from "../lib/date"

export function DateTimeField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const { lang } = useLanguage()

  return (
    <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
      {label}
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ltr-nums rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:[color-scheme:dark]"
      />
      {value && <span className="text-xs font-medium text-teal-700 dark:text-teal-400">{formatDateTime(value, lang)}</span>}
    </label>
  )
}
