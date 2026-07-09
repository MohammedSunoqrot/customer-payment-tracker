import type { ReactNode } from "react"

const colorClasses = {
  red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  green: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
  stone: "bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400",
} as const

export function Badge({ color, children }: { color: keyof typeof colorClasses; children: ReactNode }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${colorClasses[color]}`}>{children}</span>
  )
}
