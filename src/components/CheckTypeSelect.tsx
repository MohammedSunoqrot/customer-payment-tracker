import type { CheckType } from "../types"

const checkTypeLabels: Record<CheckType, string> = {
  personal: "شخصي",
  endorsed: "جيرو",
}

const checkTypes: CheckType[] = ["personal", "endorsed"]

export function CheckTypeSelect({ value, onChange }: { value: CheckType | null; onChange: (value: CheckType) => void }) {
  return (
    <div className="flex gap-2">
      {checkTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={`flex-1 rounded-lg border py-2 text-sm ${
            value === type ? "border-teal-700 bg-teal-50 text-teal-700" : "border-stone-300 text-stone-600"
          }`}
        >
          {checkTypeLabels[type]}
        </button>
      ))}
    </div>
  )
}
