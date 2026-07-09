import { useState } from "react"
import { nowISO } from "../lib/date"
import { reopenCase } from "../lib/actions"
import { DateTimeField } from "./DateTimeField"
import { Modal } from "./Modal"

export function ReopenCaseModal({ customerId, onClose }: { customerId: string; onClose: () => void }) {
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
    <Modal title="إعادة فتح الملف" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <DateTimeField label="تاريخ ووقت أول متابعة" value={date} onChange={setDate} />

        <label className="flex flex-col gap-1 text-sm text-stone-600">
          سبب إعادة الفتح (اختياري)
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="rounded-lg border border-stone-300 px-3 py-2"
            placeholder="مثال: عاد للتواصل لتسوية جديدة"
          />
        </label>

        <button
          onClick={handleConfirm}
          disabled={saving || !date}
          className="w-full rounded-xl bg-teal-700 py-3 font-medium text-white disabled:opacity-50"
        >
          {saving ? "جارٍ الحفظ..." : "إعادة فتح الملف"}
        </button>
      </div>
    </Modal>
  )
}
