import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProduct } from '@/services/api'
import { fetchProductReviewSummary } from '@/services/reviewService'
import { Plus, Minus, Heart, Star, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { discountPercent, formatINR } from '@/lib/data'
import NotFound from './NotFound'
import AddToPlanMenu from '@/components/AddToPlanMenu'
import { cn } from '@/lib/utils'

function ReviewSummary({ summary, loading }) {
  if (loading) return <Skeleton className="mt-4 h-24 w-full rounded-lg" />
  if (!summary || summary.total_reviews === 0) return null

  return (
    <div className="mt-6 rounded-lg border border-[#DDDDDD] bg-[#F7F7F7] p-4">
      <h3 className="mb-2 text-sm font-bold text-[#111111]">Review Summary</h3>
      <div className="flex items-center gap-2">
        <Star className="h-4 w-4 fill-[#FF9900] text-[#FF9900]" />
        <span className="font-bold text-[#111111]">{summary.average_rating} Rating</span>
        <span className="text-xs text-[#565959]">({summary.total_reviews} reviews)</span>
      </div>
      {summary.most_liked?.length > 0 && (
        <p className="mt-2 text-sm text-[#565959]">
          <span className="font-semibold text-[#067D62]">Most users liked:</span>{' '}
          {summary.most_liked.join(', ')}
        </p>
      )}
      {summary.most_complaints?.length > 0 && (
        <p className="mt-1 text-sm text-[#565959]">
          <span className="font-semibold text-[#CC0C39]">Most complaints:</span>{' '}
          {summary.most_complaints.join(', ')}
        </p>
      )}
      <p className="mt-2 text-xs text-[#565959]">{summary.summary}</p>
    </div>
  )
}

export default function ProductDetail() {
  const { productId } = useParams()
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
  })
  const { data: reviewSummary, isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', productId, product?.backendId],
    queryFn: () => fetchProductReviewSummary(productId, product?.backendId),
    enabled: !!product,
  })
  const { addToCart, items, setQty, wishlist, toggleWishlist } = useCart()

  if (isLoading) return <div className="mx-auto max-w-7xl flex-1 px-4 py-8"><Skeleton className="h-96 w-full rounded-lg" /></div>
  if (!product) return <NotFound />

  const inCart = items.find((i) => i.product.id === product.id)
  const wished = wishlist.includes(product.id)
  const discount = product.expiryDiscountPercent || discountPercent(product)

  return (
    <div className="mx-auto max-w-7xl flex-1 px-4 py-8">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-[#007185] hover:text-[#C45500]">
        <ArrowLeft className="h-4 w-4" /> Back to shopping
      </Link>

      <div className="grid grid-cols-1 gap-8 rounded-lg border border-[#DDDDDD] bg-white p-6 shadow-soft md:grid-cols-2">
        <div className={cn("flex h-80 items-center justify-center rounded-lg bg-gradient-to-br text-8xl sm:h-96 sm:text-9xl", product.gradient)}>
          {product.emoji}
        </div>
        <div className="flex flex-col">
          {product.brand && (
            <p className="text-sm font-medium text-[#007185]">Visit the {product.brand} Store</p>
          )}
          <h1 className="mt-1 text-2xl font-bold text-[#111111] sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <span className="flex items-center gap-1 text-sm text-[#FF9900]">
              <Star className="h-4 w-4 fill-[#FF9900] text-[#FF9900]" />
              {reviewSummary?.average_rating || product.rating}
            </span>
            {(reviewSummary?.total_reviews || product.reviews) && (
              <span className="text-sm text-[#007185]">
                {(reviewSummary?.total_reviews || product.reviews).toLocaleString()} ratings
              </span>
            )}
          </div>

          {product.expiryLabel && (
            <p className="mt-2 text-sm font-medium text-[#C45500]">{product.expiryLabel}</p>
          )}

          <p className="mt-4 text-sm leading-relaxed text-[#565959]">{product.description}</p>

          <div className="mt-6 flex items-baseline gap-3 border-t border-[#DDDDDD] pt-4">
            {discount > 0 && (
              <span className="rounded-md bg-[#CC0C39] px-2 py-0.5 text-xs font-bold text-white">-{discount}%</span>
            )}
            <span className="text-3xl font-bold text-[#111111]">{formatINR(product.price)}</span>
            {discount > 0 && product.originalPrice && (
              <span className="text-sm text-[#565959] line-through">{formatINR(product.originalPrice)}</span>
            )}
            {discount > 0 && !product.originalPrice && product.mrp && (
              <span className="text-sm text-[#565959] line-through">{formatINR(product.mrp)}</span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {inCart ? (
              <div className="flex items-center gap-0.5 rounded-md border border-[#DDDDDD] bg-[#F7F7F7]">
                <button onClick={() => setQty(product.id, inCart.qty - 1)} className="grid h-10 w-10 place-items-center text-[#111111] hover:bg-[#EAEDED]">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center font-bold text-[#111111]">{inCart.qty}</span>
                <button onClick={() => setQty(product.id, inCart.qty + 1)} className="grid h-10 w-10 place-items-center text-[#111111] hover:bg-[#EAEDED]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Button size="lg" onClick={() => addToCart(product)} className="gap-2">
                <Plus className="h-4 w-4" /> Add to Cart
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={() => toggleWishlist(product.id)}
              className={cn(wished && "border-[#CC0C39] text-[#CC0C39]")}
            >
              <Heart className={cn("h-4 w-4", wished && "fill-current")} />
              {wished ? "In Wishlist" : "Add to Wishlist"}
            </Button>
            <AddToPlanMenu product={product} size="lg" />
          </div>

          <ReviewSummary summary={reviewSummary} loading={reviewsLoading} />

          <div className="mt-6 rounded-lg bg-[#F7F7F7] p-4 text-sm text-[#565959]">
            <p><span className="font-semibold text-[#067D62]">In Stock</span> — Usually ships within 2 days</p>
            <p className="mt-1">Free delivery on orders over ₹499</p>
          </div>
        </div>
      </div>
    </div>
  )
}
