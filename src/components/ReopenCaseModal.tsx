import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { nowISO } from "../lib/date"
import { reopenCase } from "../lib/actions"
import { DateTimeField } from "./DateTimeField"
import { Modal } from "./Modal"

export function ReopenCaseModal({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const { t } = useLanguage()
  const [date, setDate] = useState(nowISO())
  const [reason, setReason] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleConfirm() {
    setSaving(true)
    await reopenCase(customerId, date, reason.trim() || undefined)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title={t("reopen.title")} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <DateTimeField label={t("reopen.dateTime")} value={date} onChange={setDate} />

        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("reopen.reason")}
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            placeholder={t("reopen.reasonPlaceholder")}
          />
        </label>

        <button
          onClick={handleConfirm}
          disabled={saving || !date}
          className="w-full rounded-xl bg-teal-700 py-3 font-medium text-white disabled:opacity-50 dark:bg-teal-600"
        >
          {saving ? t("form.saving") : t("reopen.save")}
        </button>
      </div>
    </Modal>
  )
}
