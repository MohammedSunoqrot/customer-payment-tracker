import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { translations, type Lang, type TranslationKey } from "../lib/i18n"

const STORAGE_KEY = "customer-payment-tracker-lang"

function getStoredLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === "en" ? "en" : "ar"
}

interface LanguageContextValue {
  lang: Lang
  dir: "rtl" | "ltr"
  toggleLang: () => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(getStoredLang)
  const dir = lang === "ar" ? "rtl" : "ltr"

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  function toggleLang() {
    setLang((prev) => {
      const next = prev === "ar" ? "en" : "ar"
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  function t(key: TranslationKey): string {
    return translations[lang][key]
  }

  return <LanguageContext.Provider value={{ lang, dir, toggleLang, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
