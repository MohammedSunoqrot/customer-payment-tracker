import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "light" | "dark"
const STORAGE_KEY = "customer-payment-tracker-theme"

function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function getStoredOverride(): Theme | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === "light" || stored === "dark" ? stored : null
}

interface ThemeContextValue {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getStoredOverride() ?? (systemPrefersDark() ? "dark" : "light"))

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  // Follow system changes live, but only while the user hasn't manually overridden.
  useEffect(() => {
    if (getStoredOverride()) return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light")
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark"
      localStorage.setItem(STORAGE_KEY, next)
      return next
    })
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
  return ctx
}
