import { CalendarClock, Users } from "lucide-react"
import { NavLink } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"

const navItems = [
  { to: "/", key: "nav.today" as const, icon: CalendarClock, end: true },
  { to: "/customers", key: "nav.customers" as const, icon: Users, end: false },
]

export function BottomNav() {
  const { t } = useLanguage()

  return (
    <nav className="grid grid-cols-2 border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-stone-800 dark:bg-stone-900">
      {navItems.map(({ to, key, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-2.5 text-xs ${
              isActive ? "text-teal-700 dark:text-teal-400" : "text-stone-400 dark:text-stone-500"
            }`
          }
        >
          <Icon size={22} />
          {t(key)}
        </NavLink>
      ))}
    </nav>
  )
}
