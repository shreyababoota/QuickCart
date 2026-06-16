import { Link, useNavigate } from 'react-router-dom'
import { Heart, Plus, Star, Clock, Minus } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { discountPercent, daysUntil, formatINR } from '@/lib/data'
import { Button } from '@/components/ui/button'
import AddToPlanMenu from '@/components/AddToPlanMenu'
import { cn } from '@/lib/utils'

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const { addToCart, wishlist, toggleWishlist, items, setQty } = useCart()
  const off = product.expiryDiscountPercent || discountPercent(product)
  const days = daysUntil(product.expiryDate)
  const inCart = items.find((i) => i.product.id === product.id)
  const wished = wishlist.includes(product.id)

  return (
    <div
      onClick={(e) => {
        if (e.target.closest('button, a')) return
        navigate(`/product/${product.id}`)
      }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-lg border border-[#DDDDDD] bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          toggleWishlist(product.id)
        }}
        aria-label="Wishlist"
        className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full border border-[#DDDDDD] bg-white transition-colors hover:border-[#FF9900] hover:bg-[#FFF3E0]"
      >
        <Heart className={cn("h-4 w-4", wished ? "fill-[#CC0C39] text-[#CC0C39]" : "text-[#565959]")} />
      </button>

      {off > 0 && (
        <span className="absolute left-2 top-2 z-10 rounded-md bg-[#CC0C39] px-2 py-0.5 text-xs font-bold text-white">
          {off}% OFF
        </span>
      )}

      <Link
        to={`/product/${product.id}`}
        className={cn("flex h-36 items-center justify-center bg-gradient-to-br text-6xl", product.gradient)}
      >
        <span className="transition-transform duration-300 group-hover:scale-110">{product.emoji}</span>
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.brand && (
          <p className="text-xs font-medium text-[#007185]">{product.brand}</p>
        )}

        <Link to={`/product/${product.id}`} className="line-clamp-2 text-sm font-semibold leading-tight text-[#111111] hover:text-[#C45500]">
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-xs text-[#565959]">
          <span className="flex items-center gap-0.5 text-[#FF9900]">
            <Star className="h-3 w-3 fill-[#FF9900] text-[#FF9900]" /> {product.rating}
          </span>
          {product.reviews && (
            <span className="text-[#565959]">({product.reviews.toLocaleString()})</span>
          )}
        </div>

        {product.expiryDate && (
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              days <= 3 ? "text-[#CC0C39]" : days <= 7 ? "text-[#C45500]" : "text-[#565959]",
            )}
          >
            <Clock className="h-3 w-3" />
            {days <= 0 ? "Expired" : days <= 7 ? `Expires in ${days}d` : `Best before ${product.expiryDate}`}
          </div>
        )}

        <div className="mt-auto flex flex-col gap-2 pt-2">
          <div className="leading-tight">
            <span className="text-base font-bold text-[#111111]">{formatINR(product.price)}</span>
            {off > 0 && <span className="ml-1 text-xs text-[#565959] line-through">{formatINR(product.mrp)}</span>}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {inCart ? (
              <div className="flex items-center gap-0.5 rounded-md border border-[#DDDDDD] bg-[#F7F7F7]">
                <button className="grid h-8 w-8 place-items-center text-[#111111] hover:bg-[#EAEDED]" onClick={(e) => {
                  e.stopPropagation()
                  setQty(product.id, inCart.qty - 1)
                }}>
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="min-w-5 text-center text-sm font-bold text-[#111111]">{inCart.qty}</span>
                <button className="grid h-8 w-8 place-items-center text-[#111111] hover:bg-[#EAEDED]" onClick={(e) => {
                  e.stopPropagation()
                  setQty(product.id, inCart.qty + 1)
                }}>
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <Button size="sm" className="h-8 gap-1 px-2.5" onClick={(e) => {
                e.stopPropagation()
                addToCart(product)
              }}>
                <Plus className="h-3.5 w-3.5" /> Cart
              </Button>
            )}
            <AddToPlanMenu product={product} size="sm" className="h-8 px-2.5 text-xs" />
          </div>
        </div>
      </div>
    </div>
  )
}
