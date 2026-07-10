import { useEffect, useState } from "react"
import { useLanguage } from "../context/LanguageContext"
import { buildCustomersContext } from "../lib/aiContext"
import { chatCompletion, LlmRequestError } from "../lib/llm"
import { isPendingItem, type DayViewItem } from "../hooks/useDayView"
import { Modal } from "./Modal"

const SYSTEM_PROMPT = {
  ar: "أنت مساعد يساعد صاحب عمل صغير على تحديد أولويات مكالمات متابعة الدفعات اليومية. اكتب خطة موجزة من 2-4 جمل: من يجب الاتصال به أولاً ولماذا، بناءً على المبلغ المتبقي ومدة التأخير. لا تستخدم تنسيق ماركداون، نص عادي فقط.",
  en: "You help a small business owner prioritize their daily payment follow-up calls. Write a brief 2-4 sentence plan: who to call first and why, based on remaining balance and how overdue they are. No markdown, plain text only.",
} as const

export function AiDayPlanModal({ items, onClose }: { items: DayViewItem[]; onClose: () => void }) {
  const { lang, t } = useLanguage()
  const [plan, setPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function generate() {
    setError(null)
    setLoading(true)
    try {
      const customers = items.filter(isPendingItem).map((item) => item.customer)
      const context = buildCustomersContext(customers, lang)
      const reply = await chatCompletion([
        { role: "system", content: SYSTEM_PROMPT[lang] },
        { role: "user", content: context },
      ])
      setPlan(reply)
    } catch (err) {
      setError(err instanceof LlmRequestError && err.rateLimited ? t("ai.rateLimited") : t("ai.apiError"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void generate()
    // Run once when the modal opens; `generate` reads the latest `items` via closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal title={t("ai.title")} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-stone-500 dark:text-stone-400">{t("ai.explainer")}</p>

        {loading && <p className="text-sm text-stone-400 dark:text-stone-500">{t("ai.generating")}</p>}
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        {plan && (
          <div className="rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-700 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300">
            {plan}
          </div>
        )}

        {!loading && (
          <button
            onClick={generate}
            className="w-full rounded-xl bg-teal-700 py-3 font-medium text-white dark:bg-teal-600"
          >
            {t("ai.generate")}
          </button>
        )}
      </div>
    </Modal>
  )
}
