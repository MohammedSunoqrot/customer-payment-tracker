import { paymentMethodLabels } from "../lib/format"
import type { PaymentMethod } from "../types"

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
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        {(Object.keys(paymentMethodLabels) as PaymentMethod[]).map((method) => (
          <button
            key={method}
            type="button"
            onClick={() => onChange(method)}
            className={`flex-1 rounded-lg border py-2 text-sm ${
              value === method ? "border-teal-700 bg-teal-50 text-teal-700" : "border-stone-300 text-stone-600"
            }`}
          >
            {paymentMethodLabels[method]}
          </button>
        ))}
      </div>
      {value === "other" && (
        <input
          type="text"
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="نوع طريقة الدفع"
          className="rounded-lg border border-stone-300 px-3 py-2"
        />
      )}
    </div>
  )
}
