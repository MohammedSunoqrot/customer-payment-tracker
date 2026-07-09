import { Moon, Sun } from "lucide-react"
import { useLanguage } from "../context/LanguageContext"
import { useTheme } from "../context/ThemeContext"

export function DemoBanner() {
  const { lang, toggleLang, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex shrink-0 items-center gap-2 bg-amber-100 px-3 py-1.5 dark:bg-amber-950">
      <button
        onClick={toggleLang}
        aria-label={t("banner.langAria")}
        className="shrink-0 rounded-full border border-amber-300 px-2 py-0.5 text-xs font-medium text-amber-900 dark:border-amber-700 dark:text-amber-200"
      >
        {lang === "ar" ? "EN" : "عربي"}
      </button>

      <div className="flex-1 text-center text-[11px] leading-tight text-amber-900 dark:text-amber-200">
        نسخة تجريبية — البيانات محفوظة على هذا الجهاز فقط ولا تُزامَن
        <span className="mx-1 text-amber-700 dark:text-amber-500">·</span>
        <span dir="ltr" className="inline-block">
          Demo — data stays on this device only, nothing syncs
        </span>
      </div>

      <button
        onClick={toggleTheme}
        aria-label={t("banner.themeAria")}
        className="shrink-0 text-amber-900 dark:text-amber-200"
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  )
}
