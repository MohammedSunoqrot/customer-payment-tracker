import { HashRouter, Route, Routes } from "react-router-dom"
import { AppBadgeSync } from "./components/AppBadgeSync"
import { AppShell } from "./components/AppShell"
import { CustomersProvider } from "./context/CustomersContext"
import { DayEntriesProvider } from "./context/DayEntriesContext"
import { CustomerDetailPage } from "./pages/CustomerDetailPage"
import { CustomerFormPage } from "./pages/CustomerFormPage"
import { CustomersPage } from "./pages/CustomersPage"
import { TodayPage } from "./pages/TodayPage"

export default function App() {
  return (
    <CustomersProvider>
      <DayEntriesProvider>
        <AppBadgeSync />
        <HashRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<TodayPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/new" element={<CustomerFormPage />} />
              <Route path="/customers/:id" element={<CustomerDetailPage />} />
              <Route path="/customers/:id/edit" element={<CustomerFormPage />} />
            </Route>
          </Routes>
        </HashRouter>
      </DayEntriesProvider>
    </CustomersProvider>
  )
}
