import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatINR } from '@/lib/data'
import { normalizeProduct } from '@/lib/productMapper'

export default function ForgetListCard({ title = 'You may have forgotten:', items = [], onAdd, planId }) {
  if (!items.length) return null

  return (
    <div className="rounded-lg border border-[#FF9900]/40 bg-[#FFF8F0] p-4 shadow-soft">
      <h3 className="mb-3 text-sm font-bold text-[#C45500]">{title}</h3>
      <div className="space-y-2">
        {items.map((item, idx) => {
          const product = item.is_label_only ? null : normalizeProduct(item, idx)
          return (
            <div key={item.id || idx} className="flex items-center justify-between gap-2 rounded-md bg-white px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#111111]">{item.name || product?.name}</p>
                {product?.price > 0 && (
                  <p className="text-xs text-[#565959]">{formatINR(product.price)}</p>
                )}
              </div>
              {product && !item.is_label_only && onAdd && (
                <Button size="sm" variant="outline" onClick={() => onAdd(planId, product.id, product.name, product)}>
                  <Plus className="h-3.5 w-3.5" /> Add
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
