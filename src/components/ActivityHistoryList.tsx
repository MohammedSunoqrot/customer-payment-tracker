import { Receipt } from "lucide-react"
import { useCharges } from "../hooks/useCharges"
import { useDeductions } from "../hooks/useDeductions"
import { usePayments } from "../hooks/usePayments"
import type { CurrencyCode } from "../lib/currency"
import { ChargeHistoryItem } from "./ChargeHistoryItem"
import { DeductionHistoryItem } from "./DeductionHistoryItem"
import { EmptyState } from "./EmptyState"
import { PaymentHistoryItem } from "./PaymentHistoryItem"

export function ActivityHistoryList({
  customerId,
  customerCurrency,
}: {
  customerId: string
  customerCurrency: CurrencyCode
}) {
  const { payments, loading: paymentsLoading } = usePayments(customerId)
  const { charges, loading: chargesLoading } = useCharges(customerId)
  const { deductions, loading: deductionsLoading } = useDeductions(customerId)

  if (paymentsLoading || chargesLoading || deductionsLoading) return null

  const items = [
    ...payments.map((payment) => ({ type: "payment" as const, date: payment.date, payment })),
    ...charges.map((charge) => ({ type: "charge" as const, date: charge.date, charge })),
    ...deductions.map((deduction) => ({ type: "deduction" as const, date: deduction.date, deduction })),
  ].sort((a, b) => b.date.localeCompare(a.date))

  if (items.length === 0) return <EmptyState icon={Receipt} text="لا توجد حركات مسجلة بعد" />

  return (
    <div className="rounded-2xl border border-stone-200 bg-white px-4">
      {items.map((item) => {
        if (item.type === "payment") {
          return (
            <PaymentHistoryItem
              key={item.payment.id}
              payment={item.payment}
              customerId={customerId}
              customerCurrency={customerCurrency}
            />
          )
        }
        if (item.type === "charge") {
          return <ChargeHistoryItem key={item.charge.id} charge={item.charge} currency={customerCurrency} />
        }
        return <DeductionHistoryItem key={item.deduction.id} deduction={item.deduction} currency={customerCurrency} />
      })}
    </div>
  )
}
