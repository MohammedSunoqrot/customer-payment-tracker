import { generateId, mutate } from "./localDb"
import { datePart, nowISO, todayISO } from "./date"
import type {
  ContactStatus,
  DayEntryAction,
  EditCustomerInput,
  NewChargeInput,
  NewCustomerInput,
  NewDeductionInput,
  NewPaymentInput,
} from "../types"

// ---------------------------------------------------------------------------
// Day entries: a frozen per-day record of a customer's follow-up status, kept
// forever so browsing any past day still shows exactly what was on that
// day's list, even after the customer has since been rescheduled elsewhere.
// ---------------------------------------------------------------------------

function ensureDayEntry(customerId: string, date: string): void {
  mutate((db) => {
    const id = `${customerId}_${date}`
    if (!db.dayEntries[id]) {
      db.dayEntries[id] = { id, customerId, date, status: "pending", createdAt: Date.now() }
    }
  })
}

/** Marks every still-pending entry for this customer as done (optionally only those due by a given date). */
function resolvePendingDayEntries(
  customerId: string,
  action: DayEntryAction,
  note: string | undefined,
  onlyUpToDate?: string,
): void {
  mutate((db) => {
    for (const entry of Object.values(db.dayEntries)) {
      if (entry.customerId !== customerId || entry.status !== "pending") continue
      if (onlyUpToDate && (entry.date as string) > onlyUpToDate) continue
      entry.status = "done"
      entry.action = action
      entry.note = note ?? null
      entry.actionAt = nowISO()
    }
  })
}

/** Marks today's entry as done with a contacted/not_contacted outcome, creating it first if needed. */
function upsertTodayContactEntry(customerId: string, action: "contacted" | "not_contacted"): void {
  const today = todayISO()
  mutate((db) => {
    const id = `${customerId}_${today}`
    const existing = db.dayEntries[id]
    db.dayEntries[id] = {
      id,
      customerId,
      date: today,
      status: "done",
      action,
      actionAt: nowISO(),
      createdAt: existing?.createdAt ?? Date.now(),
    }
  })
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export async function addCustomer(input: NewCustomerInput): Promise<string> {
  const id = generateId()
  mutate((db) => {
    db.customers[id] = {
      id,
      name: input.name.trim(),
      phone: input.phone.trim(),
      currency: input.currency,
      totalOwed: input.totalOwed,
      remainingBalance: input.totalOwed,
      paymentType: input.paymentType,
      paymentTypeOther: input.paymentTypeOther ?? "",
      notes: input.notes.trim(),
      nextContactDate: input.nextContactDate,
      status: "active",
      closeReason: null,
      reopenReason: null,
      lastContactStatus: null,
      lastContactAt: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
  })
  if (input.nextContactDate) {
    ensureDayEntry(id, datePart(input.nextContactDate))
  }
  return id
}

export async function updateCustomer(customerId: string, input: EditCustomerInput): Promise<void> {
  mutate((db) => {
    Object.assign(db.customers[customerId], {
      name: input.name.trim(),
      phone: input.phone.trim(),
      currency: input.currency,
      paymentType: input.paymentType,
      paymentTypeOther: input.paymentTypeOther ?? "",
      notes: input.notes.trim(),
      nextContactDate: input.nextContactDate,
      updatedAt: Date.now(),
    })
  })
  if (input.nextContactDate) {
    ensureDayEntry(customerId, datePart(input.nextContactDate))
  }
}

export async function reschedule(customerId: string, nextContactDate: string, note?: string): Promise<void> {
  mutate((db) => {
    Object.assign(db.customers[customerId], {
      nextContactDate,
      ...(note ? { notes: note.trim() } : {}),
      updatedAt: Date.now(),
    })
  })
  resolvePendingDayEntries(customerId, "rescheduled", undefined, todayISO())
  ensureDayEntry(customerId, datePart(nextContactDate))
}

export async function closeCase(customerId: string, reason?: string): Promise<void> {
  mutate((db) => {
    Object.assign(db.customers[customerId], {
      status: "closed",
      nextContactDate: null,
      closeReason: reason ?? null,
      updatedAt: Date.now(),
    })
  })
  resolvePendingDayEntries(customerId, "closed", reason)
}

export async function reopenCase(customerId: string, nextContactDate: string, reason?: string): Promise<void> {
  mutate((db) => {
    Object.assign(db.customers[customerId], {
      status: "active",
      nextContactDate,
      reopenReason: reason ?? null,
      updatedAt: Date.now(),
    })
  })
  ensureDayEntry(customerId, datePart(nextContactDate))
}

export async function markContactStatus(customerId: string, status: ContactStatus): Promise<void> {
  mutate((db) => {
    Object.assign(db.customers[customerId], {
      lastContactStatus: status,
      lastContactAt: nowISO(),
      updatedAt: Date.now(),
    })
  })
  upsertTodayContactEntry(customerId, status)
}

// ---------------------------------------------------------------------------
// Payments, charges, deductions
// ---------------------------------------------------------------------------

export async function recordPayment(customerId: string, input: NewPaymentInput): Promise<void> {
  const isCheck = input.method === "check"
  const convertedAmount = input.exchangeRate ? input.amount * input.exchangeRate : input.amount

  mutate((db) => {
    const customer = db.customers[customerId]
    const payments = (db.payments[customerId] ??= [])
    payments.push({
      id: generateId(),
      amount: input.amount,
      currency: input.currency,
      exchangeRate: input.exchangeRate ?? null,
      convertedAmount,
      method: input.method,
      methodOther: input.methodOther ?? "",
      checkType: isCheck ? (input.checkType ?? null) : null,
      note: input.note ?? "",
      date: input.date,
      dueDate: isCheck ? (input.dueDate ?? null) : null,
      bounced: false,
      createdAt: Date.now(),
    })
    customer.remainingBalance = (customer.remainingBalance as number) - convertedAmount
    customer.updatedAt = Date.now()
  })
}

/**
 * Toggles a check payment between bounced (مرجع) and cleared, reversing or
 * re-applying its effect on the customer's remaining balance accordingly.
 */
export async function setCheckBounced(customerId: string, paymentId: string, bounced: boolean): Promise<void> {
  mutate((db) => {
    const customer = db.customers[customerId]
    const payment = (db.payments[customerId] ?? []).find((p) => p.id === paymentId)
    if (!customer || !payment) return

    const convertedAmount = (payment.convertedAmount ?? payment.amount) as number
    const wasBounced = Boolean(payment.bounced)
    if (wasBounced === bounced) return

    const delta = bounced ? convertedAmount : -convertedAmount
    customer.remainingBalance = (customer.remainingBalance as number) + delta
    customer.updatedAt = Date.now()
    payment.bounced = bounced
  })
}

export async function addCharge(customerId: string, input: NewChargeInput): Promise<void> {
  mutate((db) => {
    const customer = db.customers[customerId]
    const charges = (db.charges[customerId] ??= [])
    charges.push({ id: generateId(), amount: input.amount, note: input.note ?? "", date: input.date, createdAt: Date.now() })
    customer.totalOwed = (customer.totalOwed as number) + input.amount
    customer.remainingBalance = (customer.remainingBalance as number) + input.amount
    customer.updatedAt = Date.now()
  })
}

/**
 * Reduces the remaining balance the same way a payment would, but recorded
 * separately since no money was actually received (discount, waived amount,
 * correction, etc).
 */
export async function addDeduction(customerId: string, input: NewDeductionInput): Promise<void> {
  mutate((db) => {
    const customer = db.customers[customerId]
    const deductions = (db.deductions[customerId] ??= [])
    deductions.push({ id: generateId(), amount: input.amount, note: input.note ?? "", date: input.date, createdAt: Date.now() })
    customer.remainingBalance = (customer.remainingBalance as number) - input.amount
    customer.updatedAt = Date.now()
  })
}
