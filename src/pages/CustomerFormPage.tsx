import { ArrowLeft, ArrowRight } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CurrencySelect } from "../components/CurrencySelect"
import { DateTimeField } from "../components/DateTimeField"
import { PaymentMethodSelect } from "../components/PaymentMethodSelect"
import { useLanguage } from "../context/LanguageContext"
import { useCustomer } from "../hooks/useCustomer"
import { resolveCurrencySymbol, DEFAULT_CURRENCY, type CurrencyCode } from "../lib/currency"
import { nowISO } from "../lib/date"
import { addCustomer, updateCustomer } from "../lib/actions"
import type { PaymentMethod } from "../types"

export function CustomerFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = Boolean(id)
  const existing = useCustomer(id)
  const navigate = useNavigate()
  const { dir, t } = useLanguage()
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft

  const [name, setName] = useState(existing?.name ?? "")
  const [phone, setPhone] = useState(existing?.phone ?? "")
  const [currency, setCurrency] = useState<CurrencyCode>(existing?.currency ?? DEFAULT_CURRENCY)
  const [customCurrencySymbol, setCustomCurrencySymbol] = useState(existing?.customCurrencySymbol ?? "")
  const [totalOwed, setTotalOwed] = useState(existing ? String(existing.totalOwed) : "")
  const [paymentType, setPaymentType] = useState<PaymentMethod>(existing?.paymentType ?? "cash")
  const [paymentTypeOther, setPaymentTypeOther] = useState(existing?.paymentTypeOther ?? "")
  const [notes, setNotes] = useState(existing?.notes ?? "")
  const [nextContactDate, setNextContactDate] = useState(existing?.nextContactDate ?? nowISO())
  const [saving, setSaving] = useState(false)

  if (isEdit && !existing) {
    return (
      <div className="flex flex-1 items-center justify-center text-stone-400 dark:text-stone-600">
        <p>{t("detail.notFound")}</p>
      </div>
    )
  }

  const canSave =
    name.trim() &&
    phone.trim() &&
    (isEdit || Number(totalOwed) > 0) &&
    (paymentType !== "other" || paymentTypeOther.trim()) &&
    (currency !== "OTHER" || customCurrencySymbol.trim())

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSave) return
    setSaving(true)

    if (isEdit && id) {
      await updateCustomer(id, {
        name,
        phone,
        currency,
        customCurrencySymbol: currency === "OTHER" ? customCurrencySymbol.trim() : undefined,
        paymentType,
        paymentTypeOther: paymentType === "other" ? paymentTypeOther.trim() : undefined,
        notes,
        nextContactDate,
      })
      navigate(`/customers/${id}`)
    } else {
      const newId = await addCustomer({
        name,
        phone,
        currency,
        customCurrencySymbol: currency === "OTHER" ? customCurrencySymbol.trim() : undefined,
        totalOwed: Number(totalOwed),
        paymentType,
        paymentTypeOther: paymentType === "other" ? paymentTypeOther.trim() : undefined,
        notes,
        nextContactDate,
      })
      navigate(`/customers/${newId}`)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-4 dark:border-stone-800 dark:bg-stone-900">
        <button onClick={() => navigate(-1)} aria-label={t("detail.backAria")} className="text-stone-500 dark:text-stone-400">
          <BackIcon size={22} />
        </button>
        <h1 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
          {isEdit ? t("form.editCustomer") : t("form.newCustomer")}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("form.name")}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("form.phone")}
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="ltr-nums rounded-lg border border-stone-300 px-3 py-2 text-left dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
            required
          />
        </label>

        <div className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("form.currency")}
          <CurrencySelect
            value={currency}
            customSymbol={customCurrencySymbol}
            onChange={setCurrency}
            onCustomSymbolChange={setCustomCurrencySymbol}
          />
        </div>

        {!isEdit && (
          <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
            {t("form.amountOwed")} ({resolveCurrencySymbol(currency, customCurrencySymbol)})
            <input
              type="number"
              inputMode="decimal"
              value={totalOwed}
              onChange={(e) => setTotalOwed(e.target.value)}
              className="ltr-nums rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
              required
            />
          </label>
        )}

        <div className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("form.paymentMethod")}
          <PaymentMethodSelect
            value={paymentType}
            otherValue={paymentTypeOther}
            onChange={setPaymentType}
            onOtherChange={setPaymentTypeOther}
          />
        </div>

        <DateTimeField label={t("form.nextFollowUp")} value={nextContactDate ?? ""} onChange={setNextContactDate} />

        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("form.notes")}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="rounded-lg border border-stone-300 px-3 py-2 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </label>

        <button
          type="submit"
          disabled={saving || !canSave}
          className="w-full rounded-xl bg-teal-700 py-3 font-medium text-white disabled:opacity-50 dark:bg-teal-600"
        >
          {saving ? t("form.saving") : t("form.save")}
        </button>
      </form>
    </div>
  )
}
