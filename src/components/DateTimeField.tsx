import { formatArabicDateTime } from "../lib/date"

export function DateTimeField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-stone-600">
      {label}
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="ltr-nums rounded-lg border border-stone-300 px-3 py-2"
      />
      {value && <span className="text-xs font-medium text-teal-700">{formatArabicDateTime(value)}</span>}
    </label>
  )
}
