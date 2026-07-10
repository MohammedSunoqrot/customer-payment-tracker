import { useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { resolveCurrencySymbol } from "../lib/currency"
import { daysOverdue, formatTime, isOverdue } from "../lib/date"
import { formatAmount } from "../lib/format"
import { AiRequestError, generateDayPlan } from "../lib/aiClient"
import { getStoredApiKey, setStoredApiKey } from "../lib/aiKey"
import { isPendingItem, type DayViewItem } from "../hooks/useDayView"
import { Modal } from "./Modal"

function buildItemsSummary(items: DayViewItem[], lang: ReturnType<typeof useLanguage>["lang"]): string {
  const lines = items.filter(isPendingItem).map(({ customer }) => {
    const symbol = resolveCurrencySymbol(customer.currency, customer.customCurrencySymbol)
    const amount = `${formatAmount(customer.remainingBalance)} ${symbol}`
    const timing =
      customer.nextContactDate && isOverdue(customer.nextContactDate)
        ? `overdue by ${daysOverdue(customer.nextContactDate)} days`
        : customer.nextContactDate
          ? `due at ${formatTime(customer.nextContactDate, lang)}`
          : "due today"
    return `- ${customer.name}: ${amount} remaining, ${timing}`
  })
  return lines.join("\n")
}

export function AiDayPlanModal({ items, onClose }: { items: DayViewItem[]; onClose: () => void }) {
  const { lang, t } = useLanguage()
  const [apiKey, setApiKey] = useState(getStoredApiKey() ?? "")
  const [plan, setPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    const key = apiKey.trim()
    if (!key) return
    setError(null)
    setPlan(null)
    setLoading(true)
    try {
      setStoredApiKey(key)
      const summary = buildItemsSummary(items, lang)
      const result = await generateDayPlan(key, summary, lang)
      setPlan(result)
    } catch (err) {
      if (err instanceof AiRequestError) {
        if (err.kind === "auth") setError(t("ai.invalidKey"))
        else if (err.kind === "rate_limit") setError(t("ai.rateLimited"))
        else setError(t("ai.apiError"))
      } else {
        setError(t("ai.apiError"))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={t("ai.title")} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-stone-500 dark:text-stone-400">{t("ai.explainer")}</p>

        <label className="flex flex-col gap-1 text-sm text-stone-600 dark:text-stone-300">
          {t("ai.apiKeyLabel")}
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-ant-..."
            className="ltr-nums rounded-lg border border-stone-300 px-3 py-2 text-left dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
          />
        </label>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        {plan && (
          <div className="rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
            {plan}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !apiKey.trim()}
          className="w-full rounded-xl bg-teal-700 py-3 font-medium text-white disabled:opacity-50 dark:bg-teal-600"
        >
          {loading ? t("ai.generating") : t("ai.generate")}
        </button>
      </div>
    </Modal>
  )
}
