import { CalendarClock, MessageCircleQuestion, Users } from "lucide-react"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import { useLanguage } from "../context/LanguageContext"
import { ChatAssistant } from "./ChatAssistant"

const navItems = [
  { to: "/", key: "nav.today" as const, icon: CalendarClock, end: true },
  { to: "/customers", key: "nav.customers" as const, icon: Users, end: false },
]

export function BottomNav() {
  const { t } = useLanguage()
  const [chatOpen, setChatOpen] = useState(false)

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto grid max-w-md grid-cols-3 border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)] dark:border-stone-800 dark:bg-stone-900">
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
        <button
          onClick={() => setChatOpen(true)}
          className="flex flex-col items-center gap-1 py-2.5 text-xs text-stone-400 dark:text-stone-500"
        >
          <MessageCircleQuestion size={22} />
          {t("nav.chat")}
        </button>
      </nav>
      <ChatAssistant open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}
