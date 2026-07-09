import type { ReactNode } from "react"

const colorClasses = {
  red: "bg-red-100 text-red-700",
  amber: "bg-amber-100 text-amber-700",
  green: "bg-green-100 text-green-700",
  stone: "bg-stone-200 text-stone-600",
  teal: "bg-teal-100 text-teal-700",
} as const

export function Badge({ color, children }: { color: keyof typeof colorClasses; children: ReactNode }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colorClasses[color]}`}>{children}</span>
  )
}
