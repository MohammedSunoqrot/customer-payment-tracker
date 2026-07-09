import { useState } from "react"
import { currencySymbols, type CurrencyCode } from "../lib/currency"
import { nowISO } from "../lib/date"
import { addDeduction } from "../lib/actions"
import { DateTimeField } from "./DateTimeField"
import { Modal } from "./Modal"

export function AddDeductionModal({
  customerId,
  customerCurrency,
  onClose,
}: {
  customerId: string
  customerCurrency: CurrencyCode
  onClose: () => void
}) {
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(nowISO())
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  const amountNumber = Number(amount)
  const canSave = amountNumber > 0 && date

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    await addDeduction(customerId, { amount: amountNumber, note: note.trim() || undefined, date })
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="تسجيل خصم" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-stone-600">
          مبلغ الخصم ({currencySymbols[customerCurrency]})
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="ltr-nums rounded-lg border border-stone-300 px-3 py-2 text-lg"
            placeholder="0"
            autoFocus
          />
        </label>

        <DateTimeField label="تاريخ ووقت الخصم" value={date} onChange={setDate} />

        <label className="flex flex-col gap-1 text-sm text-stone-600">
          سبب الخصم (اختياري)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="rounded-lg border border-stone-300 px-3 py-2"
            placeholder="مثال: خصم بسبب تأخير الشحنة"
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving || !canSave}
          className="w-full rounded-xl bg-purple-700 py-3 font-medium text-white disabled:opacity-50"
        >
          {saving ? "جارٍ الحفظ..." : "تسجيل الخصم"}
        </button>
      </div>
    </Modal>
  )
}
