import { useQuery } from '@tanstack/react-query'
import { fetchAdminInventory } from '@/services/adminService'
import { normalizeProduct } from '@/lib/productMapper'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle } from 'lucide-react'

export default function AdminInventory() {
  const { data = [], isLoading } = useQuery({
    queryKey: ['admin-inventory'],
    queryFn: fetchAdminInventory,
  })

  const products = data.map((p, i) => normalizeProduct(p, i))
  const lowItems = products.filter((p) => p.stock < 30)
  const nearExpiry = products.filter((p) => p.expiryLabel)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>

      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-amber-900">Low Stock Alert</p>
            <p className="text-sm text-amber-800">{lowItems.length} items below optimal stock levels</p>
          </div>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <div>
            <p className="font-semibold text-red-900">Near Expiry Products</p>
            <p className="text-sm text-red-800">{nearExpiry.length} items expiring within 7 days</p>
          </div>
        </div>
      </div>

      {isLoading ? <Skeleton className="h-64 w-full" /> : (
        <div className="overflow-x-auto bg-card rounded-lg border">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Expiry</th>
                <th className="px-4 py-3 text-left">Auto Discount</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 30).map((product) => (
                <tr key={product.id} className={`border-b hover:bg-secondary/50 ${product.stock < 30 ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3 font-semibold">{product.emoji} {product.name}</td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3">{product.stock}</td>
                  <td className="px-4 py-3">₹{product.price}</td>
                  <td className="px-4 py-3 text-sm">{product.expiryLabel || '—'}</td>
                  <td className="px-4 py-3">
                    {product.expiryDiscountPercent > 0 ? (
                      <span className="rounded bg-[#CC0C39] px-2 py-0.5 text-xs font-bold text-white">
                        {product.expiryDiscountPercent}% off
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
