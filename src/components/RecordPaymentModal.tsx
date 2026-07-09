import { useState } from "react"
import { currencySymbols, type CurrencyCode } from "../lib/currency"
import { nowISO } from "../lib/date"
import { formatAmount } from "../lib/format"
import { recordPayment } from "../lib/actions"
import type { CheckType, PaymentMethod } from "../types"
import { CheckTypeSelect } from "./CheckTypeSelect"
import { CurrencySelect } from "./CurrencySelect"
import { DateTimeField } from "./DateTimeField"
import { Modal } from "./Modal"
import { PaymentMethodSelect } from "./PaymentMethodSelect"

export function RecordPaymentModal({
  customerId,
  customerCurrency,
  defaultMethod,
  onClose,
}: {
  customerId: string
  customerCurrency: CurrencyCode
  defaultMethod: PaymentMethod
  onClose: () => void
}) {
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<CurrencyCode>(customerCurrency)
  const [exchangeRate, setExchangeRate] = useState("")
  const [method, setMethod] = useState<PaymentMethod>(defaultMethod)
  const [methodOther, setMethodOther] = useState("")
  const [checkType, setCheckType] = useState<CheckType | null>(null)
  const [date, setDate] = useState(nowISO())
  const [dueDate, setDueDate] = useState(nowISO())
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  const isCheck = method === "check"
  const needsExchangeRate = currency !== customerCurrency
  const amountNumber = Number(amount)
  const exchangeRateNumber = Number(exchangeRate)
  const convertedAmount = needsExchangeRate ? amountNumber * exchangeRateNumber : amountNumber

  const canSave =
    amountNumber > 0 &&
    date &&
    (method !== "other" || methodOther.trim()) &&
    (!isCheck || (dueDate && checkType)) &&
    (!needsExchangeRate || exchangeRateNumber > 0)

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    await recordPayment(customerId, {
      amount: amountNumber,
      currency,
      exchangeRate: needsExchangeRate ? exchangeRateNumber : undefined,
      method,
      methodOther: method === "other" ? methodOther.trim() : undefined,
      checkType: isCheck ? checkType ?? undefined : undefined,
      note: note.trim() || undefined,
      date,
      dueDate: isCheck ? dueDate : undefined,
    })
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="تسجيل دفعة" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-stone-600">
          المبلغ ({currencySymbols[currency]})
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

        <div className="flex flex-col gap-1 text-sm text-stone-600">
          عملة الدفعة
          <CurrencySelect value={currency} onChange={setCurrency} />
        </div>

        {needsExchangeRate && (
          <label className="flex flex-col gap-1 text-sm text-stone-600">
            سعر الصرف (1 {currencySymbols[currency]} = ؟ {currencySymbols[customerCurrency]})
            <input
              type="number"
              inputMode="decimal"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              className="ltr-nums rounded-lg border border-stone-300 px-3 py-2"
              placeholder="مثال: 0.27"
            />
            {amountNumber > 0 && exchangeRateNumber > 0 && (
              <span className="ltr-nums text-left text-xs text-stone-500">
                = {formatAmount(convertedAmount)} {currencySymbols[customerCurrency]} من رصيد العميل
              </span>
            )}
          </label>
        )}

        <div className="flex flex-col gap-1 text-sm text-stone-600">
          طريقة الدفع
          <PaymentMethodSelect
            value={method}
            otherValue={methodOther}
            onChange={setMethod}
            onOtherChange={setMethodOther}
          />
        </div>

        {isCheck && (
          <div className="flex flex-col gap-1 text-sm text-stone-600">
            نوع الشيك
            <CheckTypeSelect value={checkType} onChange={setCheckType} />
          </div>
        )}

        <DateTimeField label="تاريخ ووقت الدفعة" value={date} onChange={setDate} />

        {isCheck && <DateTimeField label="تاريخ ووقت استحقاق الشيك" value={dueDate} onChange={setDueDate} />}

        <label className="flex flex-col gap-1 text-sm text-stone-600">
          ملاحظة (اختياري)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="rounded-lg border border-stone-300 px-3 py-2"
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving || !canSave}
          className="w-full rounded-xl bg-teal-700 py-3 font-medium text-white disabled:opacity-50"
        >
          {saving ? "جارٍ الحفظ..." : "حفظ الدفعة"}
        </button>
      </div>
    </Modal>
  )
}
