import { useQuery } from '@tanstack/react-query'
import { getStats, getProducts } from '@/services/api'
import { fetchAdminAnalytics } from '@/services/adminService'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { salesTrend } from '@/lib/data'
import { Link } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  })
  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: fetchAdminAnalytics,
  })
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: getProducts })

  const merged = analytics || stats

  const cards = merged
    ? [
        { label: 'Total Users', value: merged.users },
        { label: 'Active Users', value: merged.active_users ?? merged.users },
        { label: 'Products', value: merged.products },
        { label: 'Cart Adds', value: merged.cart_adds ?? 0 },
        { label: 'Cart Removes', value: merged.cart_removes ?? 0 },
        { label: 'Orders', value: merged.orders },
        { label: 'Reviews', value: merged.reviews },
        { label: 'Goals Created', value: merged.goals_created ?? 0 },
      ]
    : []

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        {statsLoading
          ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          : cards.map((stat) => (
              <div key={stat.label} className="bg-card p-6 rounded-lg border">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
            ))}
      </div>

      {merged?.revenue !== undefined && (
        <div className="mb-8 bg-card p-6 rounded-lg border">
          <p className="text-muted-foreground text-sm">Total Revenue</p>
          <p className="text-3xl font-bold mt-1">₹{merged.revenue?.toLocaleString()}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8 mb-8">
        <Link to="/admin/orders" className="bg-card p-6 rounded-lg border hover:shadow-lg transition">
          <h3 className="font-bold text-lg"> Orders</h3>
          <p className="text-muted-foreground">{merged?.orders ?? 0} orders</p>
        </Link>
        <Link to="/admin/inventory" className="bg-card p-6 rounded-lg border hover:shadow-lg transition">
          <h3 className="font-bold text-lg"> Inventory</h3>
          <p className="text-muted-foreground">{products.length} products</p>
        </Link>
        <Link to="/admin/customers" className="bg-card p-6 rounded-lg border hover:shadow-lg transition">
          <h3 className="font-bold text-lg"> Customers</h3>
          <p className="text-muted-foreground">{merged?.users ?? 0} customers</p>
        </Link>
        <Link to="/admin/sustainability" className="bg-card p-6 rounded-lg border hover:shadow-lg transition">
          <h3 className="font-bold text-lg"> Sustainability</h3>
          <p className="text-muted-foreground">Waste tracking</p>
        </Link>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <h3 className="font-bold text-lg mb-4">Sales Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesTrend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#FF9900" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
