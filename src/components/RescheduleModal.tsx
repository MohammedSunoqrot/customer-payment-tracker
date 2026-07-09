import { useState } from "react"
import { addDaysISO, nowISO, todayISO } from "../lib/date"
import { reschedule } from "../lib/actions"
import { DateTimeField } from "./DateTimeField"
import { Modal } from "./Modal"

const quickOptions = [
  { label: "غدًا", days: 1 },
  { label: "بعد 3 أيام", days: 3 },
  { label: "بعد أسبوع", days: 7 },
]

/** Today + N days, at the current moment's time-of-day (as requested: "set that moment time"). */
function quickPick(days: number): string {
  return `${addDaysISO(todayISO(), days)}T${nowISO().split("T")[1]}`
}

export function RescheduleModal({
  customerId,
  currentNotes,
  onClose,
}: {
  customerId: string
  currentNotes: string
  onClose: () => void
}) {
  const [date, setDate] = useState(quickPick(1))
  const [note, setNote] = useState(currentNotes)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await reschedule(customerId, date, note)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="تحديد موعد متابعة" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          {quickOptions.map((opt) => (
            <button
              key={opt.days}
              type="button"
              onClick={() => setDate(quickPick(opt.days))}
              className={`flex-1 rounded-lg border py-2 text-sm ${
                date === quickPick(opt.days) ? "border-teal-700 bg-teal-50 text-teal-700" : "border-stone-300 text-stone-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <DateTimeField label="تاريخ ووقت المتابعة" value={date} onChange={setDate} />

        <label className="flex flex-col gap-1 text-sm text-stone-600">
          ملاحظات للمكالمة القادمة
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="rounded-lg border border-stone-300 px-3 py-2"
            placeholder="مثال: طلب المهلة حتى نهاية الشهر"
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving || !date}
          className="w-full rounded-xl bg-teal-700 py-3 font-medium text-white disabled:opacity-50"
        >
          {saving ? "جارٍ الحفظ..." : "حفظ الموعد"}
        </button>
      </div>
    </Modal>
  )
}
