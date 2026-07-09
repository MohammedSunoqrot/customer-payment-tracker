import { ArrowRight, CalendarClock, CircleCheck, MinusCircle, PlusCircle, Pencil, Phone, RotateCcw, Wallet } from "lucide-react"
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
import { useCustomer } from "../hooks/useCustomer"
import { currencySymbols } from "../lib/currency"
import { formatArabicDateTime, isOverdue } from "../lib/date"
import { formatAmount, paymentMethodLabels } from "../lib/format"
import { telHref } from "../lib/phone"

type OpenModal = "reschedule" | "payment" | "close" | "reopen" | "charge" | "deduction" | null

export function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const customer = useCustomer(id)
  const [openModal, setOpenModal] = useState<OpenModal>(null)

  if (!customer) {
    return (
      <div className="flex flex-1 items-center justify-center text-stone-400">
        <p>العميل غير موجود</p>
      </div>
    )
  }

  const overdue = customer.status === "active" && isOverdue(customer.nextContactDate)
  const methodLabel =
    customer.paymentType === "other" ? customer.paymentTypeOther || "أخرى" : paymentMethodLabels[customer.paymentType]
  const currencySymbol = currencySymbols[customer.currency]

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-4">
        <button onClick={() => navigate(-1)} aria-label="رجوع" className="text-stone-500">
          <ArrowRight size={22} />
        </button>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-lg font-semibold text-stone-800">{customer.name}</span>
          <a href={telHref(customer.phone)} className="ltr-nums flex items-center gap-1 text-left text-sm text-teal-700">
            <Phone size={13} /> {customer.phone}
          </a>
        </div>
        <Link to={`/customers/${customer.id}/edit`} className="text-stone-400" aria-label="تعديل بيانات العميل">
          <Pencil size={20} />
        </Link>
      </header>

      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-500">المبلغ المتبقي</span>
            {customer.status === "closed" ? (
              <Badge color="stone">مغلق</Badge>
            ) : overdue ? (
              <Badge color="red">متأخر</Badge>
            ) : (
              <Badge color="teal">نشط</Badge>
            )}
          </div>
          <div className="ltr-nums mt-1 text-left text-2xl font-bold text-stone-800">
            {formatAmount(customer.remainingBalance)} <span className="text-base font-normal text-stone-500">{currencySymbol}</span>
          </div>
          <div className="mt-2 flex justify-between text-xs text-stone-400">
            <span>الإجمالي: {formatAmount(customer.totalOwed)} {currencySymbol}</span>
            <span>طريقة الدفع: {methodLabel}</span>
          </div>
        </div>

        {customer.status === "active" && (
          <div className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white p-4">
            <CalendarClock size={18} className="text-stone-400" />
            <span className="text-sm text-stone-600">
              الموعد القادم: <span className="font-medium">{formatArabicDateTime(customer.nextContactDate)}</span>
            </span>
          </div>
        )}

        {customer.lastContactAt && (
          <p className="px-1 text-xs text-stone-400">
            آخر اتصال: {customer.lastContactStatus === "contacted" ? "تم الرد" : "لم يتم الرد"} ·{" "}
            {formatArabicDateTime(customer.lastContactAt)}
          </p>
        )}

        {customer.notes && (
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <span className="mb-1 block text-sm text-stone-500">ملاحظات</span>
            <p className="whitespace-pre-wrap text-stone-700">{customer.notes}</p>
          </div>
        )}

        {(customer.closeReason || customer.reopenReason) && (
          <div className="rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-600">
            {customer.status === "closed" && customer.closeReason && <p>سبب الإغلاق: {customer.closeReason}</p>}
            {customer.status === "active" && customer.reopenReason && <p>سبب إعادة الفتح: {customer.reopenReason}</p>}
          </div>
        )}

        <ContactStatusButtons customer={customer} />

        <button
          onClick={() => setOpenModal("payment")}
          className="flex flex-col items-center gap-1 rounded-2xl bg-teal-700 py-4 text-white"
        >
          <Wallet size={20} />
          <span className="text-sm font-medium">تسجيل دفعة</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setOpenModal("charge")}
            className="flex flex-col items-center gap-1 rounded-2xl border border-amber-300 bg-amber-50 py-4 text-amber-700"
          >
            <PlusCircle size={20} />
            <span className="text-sm font-medium">زيادة المبلغ المستحق</span>
          </button>

          <button
            onClick={() => setOpenModal("deduction")}
            className="flex flex-col items-center gap-1 rounded-2xl border border-purple-300 bg-purple-50 py-4 text-purple-700"
          >
            <MinusCircle size={20} />
            <span className="text-sm font-medium">تسجيل خصم</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {customer.status === "active" ? (
            <button
              onClick={() => setOpenModal("reschedule")}
              className="flex flex-col items-center gap-1 rounded-2xl border border-stone-300 bg-white py-4 text-stone-700"
            >
              <CalendarClock size={20} />
              <span className="text-sm font-medium">تحديد موعد متابعة</span>
            </button>
          ) : (
            <button
              onClick={() => setOpenModal("reopen")}
              className="flex flex-col items-center gap-1 rounded-2xl border border-stone-300 bg-white py-4 text-stone-700"
            >
              <RotateCcw size={20} />
              <span className="text-sm font-medium">إعادة فتح الملف</span>
            </button>
          )}

          {customer.status === "active" && (
            <button
              onClick={() => setOpenModal("close")}
              className="flex flex-col items-center gap-1 rounded-2xl border border-red-200 bg-red-50 py-4 text-red-700"
            >
              <CircleCheck size={20} />
              <span className="text-sm font-medium">إغلاق الملف</span>
            </button>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-sm font-medium text-stone-500">سجل الحركات</h2>
          <ActivityHistoryList customerId={customer.id} customerCurrency={customer.currency} />
        </div>
      </div>

      {openModal === "reschedule" && (
        <RescheduleModal customerId={customer.id} currentNotes={customer.notes} onClose={() => setOpenModal(null)} />
      )}
      {openModal === "payment" && (
        <RecordPaymentModal
          customerId={customer.id}
          customerCurrency={customer.currency}
          defaultMethod={customer.paymentType}
          onClose={() => setOpenModal(null)}
        />
      )}
      {openModal === "charge" && (
        <AddChargeModal customerId={customer.id} customerCurrency={customer.currency} onClose={() => setOpenModal(null)} />
      )}
      {openModal === "deduction" && (
        <AddDeductionModal customerId={customer.id} customerCurrency={customer.currency} onClose={() => setOpenModal(null)} />
      )}
      {openModal === "close" && <CloseCaseConfirm customerId={customer.id} onClose={() => setOpenModal(null)} />}
      {openModal === "reopen" && <ReopenCaseModal customerId={customer.id} onClose={() => setOpenModal(null)} />}
    </div>
  )
}
