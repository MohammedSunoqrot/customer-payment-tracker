import type { Lang } from "./i18n"

/**
 * Plain date strings are "YYYY-MM-DD"; datetime strings are "YYYY-MM-DDTHH:mm"
 * (the exact format produced/consumed by <input type="date"|"datetime-local">).
 * Both are lexicographically sortable, so string comparison == chronological order.
 */

export function todayISO(): string {
  return dateToISO(new Date())
}

export function dateToISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function nowISO(): string {
  const date = new Date()
  const h = String(date.getHours()).padStart(2, "0")
  const mi = String(date.getMinutes()).padStart(2, "0")
  return `${dateToISO(date)}T${h}:${mi}`
}

export function datePart(iso: string): string {
  return iso.split("T")[0]
}

/** Adds days to a date or datetime string, preserving the time-of-day portion if present. */
export function addDaysISO(iso: string, days: number): string {
  const [isoDatePart, timePart] = iso.split("T")
  const [y, m, d] = isoDatePart.split("-").map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + days)
  const newDatePart = dateToISO(date)
  return timePart ? `${newDatePart}T${timePart}` : newDatePart
}

export function isOverdue(iso: string | null): boolean {
  if (!iso) return false
  return datePart(iso) < todayISO()
}

export function isToday(iso: string | null): boolean {
  if (!iso) return false
  return datePart(iso) === todayISO()
}

export function daysOverdue(iso: string): number {
  const [y1, m1, d1] = datePart(iso).split("-").map(Number)
  const [y2, m2, d2] = todayISO().split("-").map(Number)
  const a = Date.UTC(y1, m1 - 1, d1)
  const b = Date.UTC(y2, m2 - 1, d2)
  return Math.max(0, Math.round((b - a) / 86_400_000))
}

function toDateObject(iso: string): Date {
  const [isoDatePart, timePart] = iso.split("T")
  const [y, m, d] = isoDatePart.split("-").map(Number)
  const [h, mi] = (timePart ?? "00:00").split(":").map(Number)
  return new Date(y, m - 1, d, h, mi)
}

function locale(lang: Lang): string {
  return lang === "ar" ? "ar-EG-u-nu-latn" : "en-US"
}

export function formatDate(iso: string | null, lang: Lang): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat(locale(lang), { year: "numeric", month: "long", day: "numeric" }).format(toDateObject(iso))
}

export function formatDateTime(iso: string | null, lang: Lang): string {
  if (!iso) return "—"
  return new Intl.DateTimeFormat(locale(lang), {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(toDateObject(iso))
}

export function formatTime(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { hour: "2-digit", minute: "2-digit", hour12: true }).format(toDateObject(iso))
}

export function formatWeekdayDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(locale(lang), { weekday: "long", year: "numeric", month: "long", day: "numeric" }).format(
    toDateObject(iso),
  )
}
