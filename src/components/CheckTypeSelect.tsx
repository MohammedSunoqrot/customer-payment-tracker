import { useLanguage } from "../context/LanguageContext"
import type { CheckType } from "../types"

const checkTypes: CheckType[] = ["personal", "endorsed"]

export function CheckTypeSelect({ value, onChange }: { value: CheckType | null; onChange: (value: CheckType) => void }) {
  const { t } = useLanguage()

  return (
    <div className="flex gap-2">
      {checkTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`flex-1 rounded-lg border py-2 text-sm ${
            value === type
              ? "border-teal-700 bg-teal-50 text-teal-700 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-400"
              : "border-stone-300 text-stone-600 dark:border-stone-700 dark:text-stone-300"
          }`}
        >
          {t(`checkType.${type}` as const)}
        </button>
      ))}
    </div>
  )
}
