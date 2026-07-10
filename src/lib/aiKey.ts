const STORAGE_KEY = "customer-payment-tracker-anthropic-key"

export function getStoredApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setStoredApiKey(key: string): void {
  if (key) localStorage.setItem(STORAGE_KEY, key)
  else localStorage.removeItem(STORAGE_KEY)
}
