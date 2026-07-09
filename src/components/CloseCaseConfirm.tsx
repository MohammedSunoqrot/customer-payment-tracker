import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { closeCase } from "../lib/actions"
import { Modal } from "./Modal"

export function CloseCaseConfirm({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const { t } = useLanguage()
  const [reason, setReason] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleConfirm() {
    setSaving(true)
    await closeCase(customerId, reason.trim() || undefined)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title={t("close.title")} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-stone-600 dark:text-stone-300">{t("close.body")}</p>

        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("close.reason")}
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            placeholder={t("close.reasonPlaceholder")}
          />
        </label>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-stone-300 py-3 text-stone-600 dark:border-stone-700 dark:text-stone-300"
          >
            {t("close.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white disabled:opacity-50 dark:bg-red-700"
          >
            {saving ? t("close.closing") : t("close.confirm")}
          </button>
        </div>
      </div>
    </Modal>
  )
}
