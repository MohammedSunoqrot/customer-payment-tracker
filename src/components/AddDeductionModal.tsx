import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { resolveCurrencySymbol, type CurrencyCode } from "../lib/currency"
import { nowISO } from "../lib/date"
import { addDeduction } from "../lib/actions"
import { DateTimeField } from "./DateTimeField"
import { Modal } from "./Modal"

export function AddDeductionModal({
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
    await addDeduction(customerId, { amount: amountNumber, note: note.trim() || undefined, date })
    setSaving(false)
    onClose()
  }

  return (
    <Modal title={t("deduction.title")} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("deduction.amount")} ({symbol})
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

        <DateTimeField label={t("deduction.dateTime")} value={date} onChange={setDate} />

        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("deduction.reason")}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            placeholder={t("deduction.reasonPlaceholder")}
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving || !canSave}
          className="w-full rounded-xl bg-purple-700 py-3 font-medium text-white disabled:opacity-50 dark:bg-purple-800"
        >
          {saving ? t("form.saving") : t("deduction.save")}
        </button>
      </div>
    </Modal>
  )
}
