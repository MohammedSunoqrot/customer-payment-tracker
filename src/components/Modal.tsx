import { X } from "lucide-react"
import type { ReactNode } from "react"
import { useLanguage } from "../context/LanguageContext"

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  const { t } = useLanguage()

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] dark:bg-stone-900 sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">{title}</h2>
          <button onClick={onClose} className="text-stone-400 dark:text-stone-500" aria-label={t("modal.closeAria")}>
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
