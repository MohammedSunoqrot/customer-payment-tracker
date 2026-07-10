import type { Lang } from "./i18n"

const SYSTEM_PROMPT: Record<Lang, string> = {
  ar: "أنت مساعد يساعد صاحب عمل صغير على تحديد أولويات مكالمات متابعة الدفعات اليومية. اكتب خطة موجزة من 2-4 جمل: من يجب الاتصال به أولاً ولماذا، بناءً على المبلغ المتأخر ومدة التأخير. لا تستخدم تنسيق ماركداون، نص عادي فقط.",
  en: "You help a small business owner prioritize their daily payment follow-up calls. Write a brief 2-4 sentence plan: who to call first and why, based on amount owed and how overdue they are. No markdown, plain text only.",
}

export type AiErrorKind = "auth" | "rate_limit" | "other"

export class AiRequestError extends Error {
  kind: AiErrorKind
  constructor(kind: AiErrorKind, message: string) {
    super(message)
    this.kind = kind
  }
}

/** Dynamically imported so the SDK never lands in the main bundle unless this feature is opened. */
export async function generateDayPlan(apiKey: string, itemsSummary: string, lang: Lang): Promise<string> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk")
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 500,
      system: SYSTEM_PROMPT[lang],
      messages: [{ role: "user", content: itemsSummary }],
    })

    const textBlock = response.content.find((block) => block.type === "text")
    return textBlock && textBlock.type === "text" ? textBlock.text : ""
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) throw new AiRequestError("auth", err.message)
    if (err instanceof Anthropic.RateLimitError) throw new AiRequestError("rate_limit", err.message)
    throw new AiRequestError("other", err instanceof Error ? err.message : String(err))
  }
}
