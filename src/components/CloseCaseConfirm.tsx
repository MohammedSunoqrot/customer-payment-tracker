import { useState } from "react"
import { closeCase } from "../lib/actions"
import { Modal } from "./Modal"

export function CloseCaseConfirm({ customerId, onClose }: { customerId: string; onClose: () => void }) {
  const [reason, setReason] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleConfirm() {
    setSaving(true)
    await closeCase(customerId, reason.trim() || undefined)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="إغلاق الملف" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-stone-600">
          سيتم إيقاف هذا العميل من قائمة المتابعة اليومية. يمكنك إعادة فتح الملف لاحقًا في أي وقت.
        </p>

        <label className="flex flex-col gap-1 text-sm text-stone-600">
          سبب الإغلاق (اختياري)
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            className="rounded-lg border border-stone-300 px-3 py-2"
            placeholder="مثال: تم سداد كامل المبلغ"
          />
        </label>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl border border-stone-300 py-3 text-stone-600">
            إلغاء
          </button>
          <button
            onClick={handleConfirm}
            disabled={saving}
            className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white disabled:opacity-50"
          >
            {saving ? "جارٍ الإغلاق..." : "إغلاق الملف"}
          </button>
        </div>
      </div>
    </Modal>
  )
}
