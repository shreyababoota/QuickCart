import { useQuery } from '@tanstack/react-query'
import { fetchAdminCustomers } from '@/services/adminService'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminCustomers() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-customers'],
    queryFn: fetchAdminCustomers,
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Customer Information</h1>
      {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="overflow-x-auto bg-card rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">City</th>
                <th className="px-4 py-3 text-left">Goals</th>
                <th className="px-4 py-3 text-left">Orders</th>
                <th className="px-4 py-3 text-left">Spent</th>
                <th className="px-4 py-3 text-left">Persona</th>
              </tr>
            </thead>
            <tbody>
              {data.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-secondary/50">
                  <td className="px-4 py-3 font-semibold">{customer.name}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.goals ?? 0}</td>
                  <td className="px-4 py-3">{customer.orders}</td>
                  <td className="px-4 py-3">₹{customer.spent?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{customer.persona}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
