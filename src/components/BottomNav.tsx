import { CalendarClock, Users } from "lucide-react"
import { NavLink } from "react-router-dom"

const navItems = [
  { to: "/", label: "اليوم", icon: CalendarClock, end: true },
  { to: "/customers", label: "العملاء", icon: Users, end: false },
]

export function BottomNav() {
  return (
    <nav className="grid grid-cols-2 border-t border-stone-200 bg-white pb-[env(safe-area-inset-bottom)]">
      {navItems.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-2.5 text-xs ${
              isActive ? "text-teal-700" : "text-stone-400"
            }`
          }
        >
          <Icon size={22} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
