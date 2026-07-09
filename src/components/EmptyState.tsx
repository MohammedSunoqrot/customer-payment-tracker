import type { LucideIcon } from "lucide-react"

export function EmptyState({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center text-stone-400">
      <Icon size={40} strokeWidth={1.5} />
      <p>{text}</p>
    </div>
  )
}
