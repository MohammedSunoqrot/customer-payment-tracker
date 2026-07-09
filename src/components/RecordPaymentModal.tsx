import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { resolveCurrencySymbol, type CurrencyCode } from "../lib/currency"
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
  customerCustomCurrencySymbol,
  defaultMethod,
  onClose,
}: {
  customerId: string
  customerCurrency: CurrencyCode
  customerCustomCurrencySymbol?: string | null
  defaultMethod: PaymentMethod
  onClose: () => void
}) {
  const { t } = useLanguage()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<CurrencyCode>(customerCurrency)
  const [customSymbol, setCustomSymbol] = useState(customerCustomCurrencySymbol ?? "")
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
  const paymentSymbol = resolveCurrencySymbol(currency, customSymbol)
  const customerSymbol = resolveCurrencySymbol(customerCurrency, customerCustomCurrencySymbol)

  const canSave =
    amountNumber > 0 &&
    date &&
    (method !== "other" || methodOther.trim()) &&
    (!isCheck || (dueDate && checkType)) &&
    (!needsExchangeRate || exchangeRateNumber > 0) &&
    (currency !== "OTHER" || customSymbol.trim())

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    await recordPayment(customerId, {
      amount: amountNumber,
      currency,
      customCurrencySymbol: currency === "OTHER" ? customSymbol.trim() : undefined,
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
    <Modal title={t("payment.title")} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("payment.amount")} ({paymentSymbol})
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

        <div className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("payment.currency")}
          <CurrencySelect value={currency} customSymbol={customSymbol} onChange={setCurrency} onCustomSymbolChange={setCustomSymbol} />
        </div>

        {needsExchangeRate && (
          <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
            {t("payment.exchangeRate")} (1 {paymentSymbol} = ? {customerSymbol})
            <input
              type="number"
              inputMode="decimal"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              className="ltr-nums rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
              placeholder={t("payment.exchangeRatePlaceholder")}
            />
            {amountNumber > 0 && exchangeRateNumber > 0 && (
              <span className="ltr-nums text-left text-xs text-stone-500 dark:text-stone-400">
                = {formatAmount(convertedAmount)} {customerSymbol} {t("payment.convertedSuffix")}
              </span>
            )}
          </label>
        )}

        <div className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("detail.paymentMethod")}
          <PaymentMethodSelect
            value={method}
            otherValue={methodOther}
            onChange={setMethod}
            onOtherChange={setMethodOther}
          />
        </div>

        {isCheck && (
          <div className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
            {t("detail.checkType")}
            <CheckTypeSelect value={checkType} onChange={setCheckType} />
          </div>
        )}

        <DateTimeField label={t("payment.dateTime")} value={date} onChange={setDate} />

        {isCheck && <DateTimeField label={t("payment.checkDueDateTime")} value={dueDate} onChange={setDueDate} />}

        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("payment.noteOptional")}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </label>

        <button
          onClick={handleSave}
          disabled={saving || !canSave}
          className="w-full rounded-xl bg-teal-700 py-3 font-medium text-white disabled:opacity-50 dark:bg-teal-600"
        >
          {saving ? t("form.saving") : t("payment.save")}
        </button>
      </div>
    </Modal>
  )
}
