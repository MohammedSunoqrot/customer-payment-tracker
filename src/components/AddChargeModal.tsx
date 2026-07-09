import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { resolveCurrencySymbol, type CurrencyCode } from "../lib/currency"
import { nowISO } from "../lib/date"
import { addCharge } from "../lib/actions"
import { DateTimeField } from "./DateTimeField"
import { Modal } from "./Modal"

export function AddChargeModal({
  customerId,
  customerCurrency,
  customerCustomCurrencySymbol,
  onClose,
}: {
  customerId: string
  customerCurrency: CurrencyCode
  customerCustomCurrencySymbol?: string | null
  onClose: () => void
}) {
  const { t } = useLanguage()
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState(nowISO())
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  const amountNumber = Number(amount)
  const canSave = amountNumber > 0 && date
  const symbol = resolveCurrencySymbol(customerCurrency, customerCustomCurrencySymbol)

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    await addCharge(customerId, { amount: amountNumber, note: note.trim() || undefined, date })
    setSaving(false)
    onClose()
  }

  return (
    <Modal title={t("charge.title")} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("charge.amount")} ({symbol})
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="ltr-nums rounded-lg border border-stone-300 px-3 py-2 text-lg dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            placeholder="0"
            autoFocus
          />
        </label>

        <DateTimeField label={t("charge.dateTime")} value={date} onChange={setDate} />

        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("charge.reason")}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            placeholder={t("charge.reasonPlaceholder")}
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving || !canSave}
          className="w-full rounded-xl bg-amber-600 py-3 font-medium text-white disabled:opacity-50 dark:bg-amber-700"
        >
          {saving ? t("form.saving") : t("charge.save")}
        </button>
      </div>
    </Modal>
  )
}
