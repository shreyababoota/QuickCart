import { useQuery } from '@tanstack/react-query'
import { fetchAdminOrders } from '@/services/orderService'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminOrders() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: fetchAdminOrders,
  })

  const totalRevenue = data.reduce((sum, o) => sum + (o.revenue || o.total || 0), 0)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      <p className="mb-8 text-muted-foreground">Total Revenue: ₹{totalRevenue.toLocaleString()}</p>

      {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="overflow-x-auto bg-card rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Revenue</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Intent</th>
              </tr>
            </thead>
            <tbody>
              {data.map((order) => (
                <tr key={order.id} className="border-b hover:bg-secondary/50">
                  <td className="px-4 py-3 font-semibold">{order.id}</td>
                  <td className="px-4 py-3">{order.customer}</td>
                  <td className="px-4 py-3">{order.date}</td>
                  <td className="px-4 py-3">₹{order.total}</td>
                  <td className="px-4 py-3">₹{order.revenue || order.total}</td>
                  <td className="px-4 py-3"><Badge>{order.status}</Badge></td>
                  <td className="px-4 py-3 text-sm">{order.intent || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
