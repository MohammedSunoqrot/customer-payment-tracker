import type { CurrencyCode } from "../lib/currency"

export type PaymentMethod = "cash" | "check" | "other"

export type CheckType = "personal" | "endorsed" // شخصي، جيرو

export type CustomerStatus = "active" | "closed"

export type ContactStatus = "contacted" | "not_contacted"

export interface Customer {
  id: string
  name: string
  phone: string
  currency: CurrencyCode
  totalOwed: number
  remainingBalance: number
  paymentType: PaymentMethod
  paymentTypeOther?: string
  notes: string
  nextContactDate: string | null // "YYYY-MM-DDTHH:mm"
  status: CustomerStatus
  closeReason?: string | null
  reopenReason?: string | null
  lastContactStatus?: ContactStatus | null
  lastContactAt?: string | null // "YYYY-MM-DDTHH:mm"
  createdAt: number
  updatedAt: number
}

export type NewCustomerInput = Pick<
  Customer,
  "name" | "phone" | "currency" | "totalOwed" | "paymentType" | "paymentTypeOther" | "notes" | "nextContactDate"
>

export type EditCustomerInput = Pick<
  Customer,
  "name" | "phone" | "currency" | "paymentType" | "paymentTypeOther" | "notes" | "nextContactDate"
>

export interface Payment {
  id: string
  amount: number // in this payment's own currency
  currency: CurrencyCode
  exchangeRate?: number // units of customer currency per 1 unit of payment currency; only when currency differs
  convertedAmount: number // amount actually deducted from balance, in the customer's currency
  method: PaymentMethod
  methodOther?: string
  checkType?: CheckType | null // only meaningful when method === "check"
  note?: string
  date: string // "YYYY-MM-DDTHH:mm"
  dueDate?: string | null // "YYYY-MM-DDTHH:mm", only meaningful when method === "check"
  bounced?: boolean // only meaningful when method === "check"
  createdAt: number
}

export type NewPaymentInput = Pick<
  Payment,
  "amount" | "currency" | "exchangeRate" | "method" | "methodOther" | "checkType" | "note" | "date" | "dueDate"
>

/** A manual increase to the amount a customer owes (e.g. they bought something new). */
export interface Charge {
  id: string
  amount: number // in the customer's currency
  note?: string
  date: string // "YYYY-MM-DDTHH:mm"
  createdAt: number
}

export type NewChargeInput = Pick<Charge, "amount" | "note" | "date">

/** A manual reduction of the balance that is not a received payment (discount, waived amount, correction). */
export interface Deduction {
  id: string
  amount: number // in the customer's currency
  note?: string
  date: string // "YYYY-MM-DDTHH:mm"
  createdAt: number
}

export type NewDeductionInput = Pick<Deduction, "amount" | "note" | "date">

export type DayEntryAction = "contacted" | "not_contacted" | "rescheduled" | "closed"

/**
 * A frozen, per-day record of a customer's follow-up status. Created when a
 * customer becomes due on a given day; resolved (never deleted) once acted on,
 * so browsing any past day still shows exactly what was on that day's list.
 */
export interface DayEntry {
  id: string // `${customerId}_${date}`
  customerId: string
  date: string // "YYYY-MM-DD"
  status: "pending" | "done"
  action?: DayEntryAction
  note?: string
  actionAt?: string // "YYYY-MM-DDTHH:mm"
  createdAt: number
}
