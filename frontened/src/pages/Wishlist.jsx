import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useProducts } from '@/hooks/useProducts'
import { formatINR, discountPercent } from '@/lib/data'
import { Button } from '@/components/ui/button'

export default function Wishlist() {
  const navigate = useNavigate()
  const { wishlist, removeFromWishlist, addToCart, isInWishlist } = useCart()
  const { products } = useProducts()

  const items = products.filter((product) => wishlist.includes(product.id))

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-1 flex-col items-center justify-center px-4 py-12 text-center">
        <div className="mb-4 grid h-20 w-20 place-items-center rounded-full bg-[#FFF3E0] text-[#FF9900] shadow-soft">
          <Heart className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-bold text-[#111111]">Your Wishlist is Empty</h1>
        <p className="mt-2 max-w-md text-sm text-[#565959]">Start exploring products and save your favorites.</p>
        <Button onClick={() => navigate('/')} className="mt-6">Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C45500]">Wishlist</p>
          <h1 className="text-2xl font-bold text-[#111111] sm:text-3xl">Saved favorites</h1>
          <p className="text-sm text-[#565959]">All your saved products, ready to shop.</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Continue Shopping</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((product) => {
          const off = discountPercent(product)
          const inWishlist = isInWishlist(product.id)
          return (
            <article key={product.id} className="flex flex-col overflow-hidden rounded-xl border border-[#DDDDDD] bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card">
              <button
                type="button"
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex h-40 items-center justify-center bg-gradient-to-br text-6xl transition hover:scale-[1.02]"
                style={{ backgroundImage: 'none' }}
              >
                <span className={product.gradient}>{product.emoji}</span>
              </button>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#007185]">{product.brand || 'AmaCart'}</p>
                <button type="button" onClick={() => navigate(`/product/${product.id}`)} className="text-left text-sm font-semibold text-[#111111] hover:text-[#C45500]">{product.name}</button>
                <div className="flex items-center gap-1 text-xs text-[#565959]">
                  <Star className="h-3.5 w-3.5 fill-[#FF9900] text-[#FF9900]" />
                  <span>{product.rating}</span>
                  <span>({product.reviews?.toLocaleString()})</span>
                </div>
                <p className="text-sm text-[#067D62]">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div>
                    <p className="text-base font-bold text-[#111111]">{formatINR(product.price)}</p>
                    {off > 0 && <p className="text-xs text-[#565959] line-through">{formatINR(product.mrp)}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => addToCart(product)}>
                      <ShoppingCart className="mr-1 h-3.5 w-3.5" /> Cart
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => removeFromWishlist(product.id)} className={inWishlist ? 'text-[#CC0C39]' : ''}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
