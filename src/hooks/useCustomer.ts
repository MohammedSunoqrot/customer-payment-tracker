import { useCustomers } from "../context/CustomersContext"
import type { Customer } from "../types"

export function useCustomer(customerId: string | undefined): Customer | undefined {
  const { customers } = useCustomers()
  return customers.find((c) => c.id === customerId)
}
