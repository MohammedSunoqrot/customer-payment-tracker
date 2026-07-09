import { Outlet } from "react-router-dom"
import { BottomNav } from "./BottomNav"
import { DemoBanner } from "./DemoBanner"

export function AppShell() {
  return (
    <div className="mx-auto flex h-screen max-w-md flex-col bg-stone-50">
      <DemoBanner />
      <main className="flex flex-1 flex-col overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
