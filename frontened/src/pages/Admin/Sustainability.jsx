import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { fetchAdminSustainability } from '@/services/adminService'
import { Skeleton } from '@/components/ui/skeleton'

export default function AdminSustainability() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-sustainability'],
    queryFn: fetchAdminSustainability,
  })

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  const metrics = data || {}

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Waste Reduction Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-8 lg:grid-cols-4">
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-sm text-muted-foreground">Food Saved</p>
          <p className="text-2xl font-bold mt-1">{metrics.food_saved_kg ?? 0} kg</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-sm text-muted-foreground">CO₂ Reduction Estimate</p>
          <p className="text-2xl font-bold mt-1">{metrics.co2_reduction_kg ?? 0} kg</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-sm text-muted-foreground">Inventory Saved</p>
          <p className="text-2xl font-bold mt-1">{metrics.inventory_saved_units ?? 0} units</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-sm text-muted-foreground">Discounted Inventory Sold</p>
          <p className="text-2xl font-bold mt-1">{metrics.discounted_inventory_sold ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-sm text-muted-foreground">Expired Inventory</p>
          <p className="text-xl font-bold mt-1 text-red-600">{metrics.expired_inventory ?? 0} products</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <p className="text-sm text-muted-foreground">Near-Expiry Saved</p>
          <p className="text-xl font-bold mt-1 text-green-600">{metrics.near_expiry_products ?? 0} products</p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg border">
        <h3 className="font-bold text-lg mb-4">Waste Reduction Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics.waste_trend || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="waste" stroke="#ef4444" name="Waste (kg)" />
            <Line type="monotone" dataKey="saved" stroke="#22c55e" name="Saved (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
