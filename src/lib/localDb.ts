/**
 * A tiny local-only data store standing in for Firestore in the public demo:
 * everything lives in this browser's localStorage, nothing syncs anywhere.
 * Shape mirrors the original Firestore collections so the rest of the app
 * (hooks, actions, components) didn't need to change.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Rec = Record<string, any>

export interface DbShape {
  customers: Record<string, Rec>
  payments: Record<string, Rec[]> // keyed by customerId
  charges: Record<string, Rec[]>
  deductions: Record<string, Rec[]>
  dayEntries: Record<string, Rec> // keyed by `${customerId}_${date}`
}

const STORAGE_KEY = "customer-payment-tracker-db-v1"

function emptyDb(): DbShape {
  return { customers: {}, payments: {}, charges: {}, deductions: {}, dayEntries: {} }
}

function load(): DbShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...emptyDb(), ...JSON.parse(raw) }
  } catch {
    // corrupted or inaccessible storage: start fresh
  }
  return emptyDb()
}

let state: DbShape = load()
const listeners = new Set<() => void>()

function persistAndNotify() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): DbShape {
  return state
}

/** Mutate the store in place, then persist + notify subscribers. */
export function mutate(fn: (db: DbShape) => void): void {
  fn(state)
  state = { ...state }
  persistAndNotify()
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
}
