import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CircleCheck,
  MinusCircle,
  PlusCircle,
  Pencil,
  Phone,
  RotateCcw,
  Wallet,
} from "lucide-react"
import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ActivityHistoryList } from "../components/ActivityHistoryList"
import { AddChargeModal } from "../components/AddChargeModal"
import { AddDeductionModal } from "../components/AddDeductionModal"
import { Badge } from "../components/Badge"
import { CloseCaseConfirm } from "../components/CloseCaseConfirm"
import { ContactStatusButtons } from "../components/ContactStatusButtons"
import { RecordPaymentModal } from "../components/RecordPaymentModal"
import { ReopenCaseModal } from "../components/ReopenCaseModal"
import { RescheduleModal } from "../components/RescheduleModal"
import { useLanguage } from "../context/LanguageContext"
import { useCustomer } from "../hooks/useCustomer"
import { resolveCurrencySymbol } from "../lib/currency"
import { formatDateTime, isOverdue } from "../lib/date"
import { formatAmount } from "../lib/format"
import { telHref } from "../lib/phone"

type OpenModal = "reschedule" | "payment" | "close" | "reopen" | "charge" | "deduction" | null

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { lang, dir, t } = useLanguage()
  const customer = useCustomer(id)
  const [openModal, setOpenModal] = useState<OpenModal>(null)
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft

  if (!customer) {
    return (
      <div className="flex flex-1 items-center justify-center text-stone-400 dark:text-stone-600">
        <p>{t("detail.notFound")}</p>
      </div>
    )
  }

  const overdue = customer.status === "active" && isOverdue(customer.nextContactDate)
  const methodLabel =
    customer.paymentType === "other" ? customer.paymentTypeOther || t("method.other") : t(`method.${customer.paymentType}` as const)
  const currencySymbol = resolveCurrencySymbol(customer.currency, customer.customCurrencySymbol)

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-4 dark:border-stone-800 dark:bg-stone-900">
        <button onClick={() => navigate(-1)} aria-label={t("detail.backAria")} className="text-stone-500 dark:text-stone-400">
          <BackIcon size={22} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-lg font-semibold text-stone-800 dark:text-stone-100">{customer.name}</span>
          <a
            href={telHref(customer.phone)}
            className="ltr-nums flex items-center gap-1 text-left text-sm text-teal-700 dark:text-teal-400"
          >
            <Phone size={13} /> {customer.phone}
          </a>
        </div>
        <Link to={`/customers/${customer.id}/edit`} className="text-stone-400 dark:text-stone-500" aria-label={t("detail.editAria")}>
          <Pencil size={20} />
        </Link>
      </header>

      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500 dark:text-stone-400">{t("detail.remainingBalance")}</span>
            {customer.status === "closed" ? (
              <Badge color="stone">{t("status.closed")}</Badge>
            ) : overdue ? (
              <Badge color="red">{t("status.overdue")}</Badge>
            ) : (
              <Badge color="teal">{t("status.active")}</Badge>
            )}
          </div>
          <div className="ltr-nums mt-1 text-left text-2xl font-bold text-stone-800 dark:text-stone-100">
            {formatAmount(customer.remainingBalance)}{" "}
            <span className="text-base font-normal text-stone-500 dark:text-stone-400">{currencySymbol}</span>
          </div>
          <div className="mt-2 flex justify-between text-xs text-stone-400 dark:text-stone-500">
            <span>
              {t("detail.total")}: {formatAmount(customer.totalOwed)} {currencySymbol}
            </span>
            <span>
              {t("detail.paymentMethod")}: {methodLabel}
            </span>
          </div>
        </div>

        {customer.status === "active" && (
          <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <CalendarClock size={18} className="text-stone-400 dark:text-stone-500" />
            <span className="text-sm text-stone-600 dark:text-stone-300">
              {t("detail.nextAppointment")}:{" "}
              <span className="font-medium">{formatDateTime(customer.nextContactDate, lang)}</span>
            </span>
          </div>
        )}

        {customer.lastContactAt && (
          <p className="px-1 text-xs text-stone-400 dark:text-stone-500">
            {t("detail.lastContact")}:{" "}
            {customer.lastContactStatus === "contacted" ? t("detail.contactedShort") : t("detail.notContactedShort")} ·{" "}
            {formatDateTime(customer.lastContactAt, lang)}
          </p>
        )}

        {customer.notes && (
          <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <span className="mb-1 block text-sm text-stone-500 dark:text-stone-400">{t("detail.notes")}</span>
            <p className="whitespace-pre-wrap text-stone-700 dark:text-stone-300">{customer.notes}</p>
          </div>
        )}

        {(customer.closeReason || customer.reopenReason) && (
          <div className="rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
            {customer.status === "closed" && customer.closeReason && (
              <p>
                {t("detail.closeReason")}: {customer.closeReason}
              </p>
            )}
            {customer.status === "active" && customer.reopenReason && (
              <p>
                {t("detail.reopenReason")}: {customer.reopenReason}
              </p>
            )}
          </div>
        )}

        <ContactStatusButtons customer={customer} />

        <button
          onClick={() => setOpenModal("payment")}
          className="flex flex-col items-center gap-1 rounded-2xl bg-teal-700 py-4 text-white dark:bg-teal-600"
        >
          <Wallet size={20} />
          <span className="text-sm font-medium">{t("detail.recordPayment")}</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setOpenModal("charge")}
            className="flex flex-col items-center gap-1 rounded-2xl border border-amber-300 bg-amber-50 py-4 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400"
          >
            <PlusCircle size={20} />
            <span className="text-sm font-medium">{t("detail.increaseAmount")}</span>
          </button>

          <button
            onClick={() => setOpenModal("deduction")}
            className="flex flex-col items-center gap-1 rounded-2xl border border-purple-300 bg-purple-50 py-4 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-400"
          >
            <MinusCircle size={20} />
            <span className="text-sm font-medium">{t("detail.recordDeduction")}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {customer.status === "active" ? (
            <button
              onClick={() => setOpenModal("reschedule")}
              className="flex flex-col items-center gap-1 rounded-2xl border border-stone-300 bg-white py-4 text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <CalendarClock size={20} />
              <span className="text-sm font-medium">{t("detail.reschedule")}</span>
            </button>
          ) : (
            <button
              onClick={() => setOpenModal("reopen")}
              className="flex flex-col items-center gap-1 rounded-2xl border border-stone-300 bg-white py-4 text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
            >
              <RotateCcw size={20} />
              <span className="text-sm font-medium">{t("detail.reopenCase")}</span>
            </button>
          )}

          {customer.status === "active" && (
            <button
              onClick={() => setOpenModal("close")}
              className="flex flex-col items-center gap-1 rounded-2xl border border-red-200 bg-red-50 py-4 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400"
            >
              <CircleCheck size={20} />
              <span className="text-sm font-medium">{t("detail.closeCase")}</span>
            </button>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-sm font-medium text-stone-500 dark:text-stone-400">{t("detail.activityLog")}</h2>
          <ActivityHistoryList
            customerId={customer.id}
            customerCurrency={customer.currency}
            customerCustomCurrencySymbol={customer.customCurrencySymbol}
          />
        </div>
      </div>

      {openModal === "reschedule" && (
        <RescheduleModal customerId={customer.id} currentNotes={customer.notes} onClose={() => setOpenModal(null)} />
      )}
      {openModal === "payment" && (
        <RecordPaymentModal
          customerId={customer.id}
          customerCurrency={customer.currency}
          customerCustomCurrencySymbol={customer.customCurrencySymbol}
          defaultMethod={customer.paymentType}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === "charge" && (
        <AddChargeModal
          customerId={customer.id}
          customerCurrency={customer.currency}
          customerCustomCurrencySymbol={customer.customCurrencySymbol}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === "deduction" && (
        <AddDeductionModal
          customerId={customer.id}
          customerCurrency={customer.currency}
          customerCustomCurrencySymbol={customer.customCurrencySymbol}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === "close" && <CloseCaseConfirm customerId={customer.id} onClose={() => setOpenModal(null)} />}
      {openModal === "reopen" && <ReopenCaseModal customerId={customer.id} onClose={() => setOpenModal(null)} />}
    </div>
  )
}
