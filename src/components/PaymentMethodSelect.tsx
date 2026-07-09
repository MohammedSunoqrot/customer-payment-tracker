import { useLanguage } from "../context/LanguageContext"
import type { PaymentMethod } from "../types"

const methods: PaymentMethod[] = ["cash", "check", "other"]

export function PaymentMethodSelect({
  value,
  otherValue,
  onChange,
  onOtherChange,
}: {
  value: PaymentMethod
  otherValue: string
  onChange: (value: PaymentMethod) => void
  onOtherChange: (value: string) => void
}) {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {methods.map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => onChange(method)}
            className={`flex-1 rounded-lg border py-2 text-sm ${
              value === method
                ? "border-teal-700 bg-teal-50 text-teal-700 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-400"
                : "border-stone-300 text-stone-600 dark:border-stone-700 dark:text-stone-300"
            }`}
          >
            {t(`method.${method}` as const)}
          </button>
        ))}
      </div>
      {value === "other" && (
        <input
          type="text"
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder={t("method.otherPlaceholder")}
          className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500"
        />
      )}
    </div>
  )
}
