import { useQuery } from '@tanstack/react-query'
import { getOrders } from '@/services/api'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatINR } from '@/lib/data'
import { Package, Star } from 'lucide-react'

export default function Orders() {
  const { data = [], isLoading } = useQuery({ queryKey: ['orders'], queryFn: getOrders })

  return (
    <div className="w-full max-w-7xl mx-auto flex-1 px-6 py-8">
      <h1 className="mb-2 text-3xl font-bold text-[#111111]">Previous Orders</h1>
      <p className="mb-8 text-sm text-[#565959]">Track and manage your recent purchases</p>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="rounded-lg border border-[#DDDDDD] bg-white p-10 text-center shadow-soft">
          <Package className="mx-auto h-10 w-10 text-[#565959]" />
          <p className="mt-4 text-[#565959]">No orders yet. Start shopping to see your order history here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((order) => (
            <div
              key={order.id}
              className="h-full rounded-lg border border-[#DDDDDD] bg-white p-5 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-[#111111]">{order.id}</h3>
                  <p className="text-sm text-[#565959]">
                    Purchased on {order.purchase_date || order.date}
                  </p>
                </div>
                <Badge status={order.status}>{order.status}</Badge>
              </div>

              {order.rating && (
                <div className="mt-3 flex items-center gap-1 text-sm text-[#FF9900]">
                  <Star className="h-4 w-4 fill-[#FF9900]" />
                  <span className="font-semibold">{order.rating}</span>
                </div>
              )}

              {order.review && (
                <p className="mt-2 text-sm italic text-[#565959]">"{order.review}"</p>
              )}

              {order.intent && (
                <p className="mt-2 text-xs text-[#007185]">Goal: {order.intent}</p>
              )}

              <div className="mt-4 flex justify-between border-t border-[#DDDDDD] pt-4 font-bold text-[#111111]">
                <span>Order Total</span>
                <span>{formatINR(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
