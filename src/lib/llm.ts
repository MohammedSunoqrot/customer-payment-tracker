/**
 * Free, keyless chat completion via Pollinations.ai's OpenAI-compatible endpoint
 * (https://text.pollinations.ai/openai) — no signup, no backend, called directly
 * from the browser. Anonymous usage is rate-limited to roughly one request per
 * 15 seconds, which is fine for this app's on-demand, single-user use.
 */

export interface ChatMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export class LlmRequestError extends Error {
  rateLimited: boolean
  constructor(message: string, rateLimited = false) {
    super(message)
    this.rateLimited = rateLimited
  }
}

export async function chatCompletion(messages: ChatMessage[]): Promise<string> {
  let res: Response
  try {
    res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai", messages }),
    })
  } catch {
    throw new LlmRequestError("network error")
  }

  if (res.status === 429) throw new LlmRequestError("rate limited", true)
  if (!res.ok) throw new LlmRequestError(`request failed (${res.status})`)

  const data = await res.json()
  const content = data?.choices?.[0]?.message?.content
  if (typeof content !== "string" || !content.trim()) throw new LlmRequestError("empty response")
  return content.trim()
}
