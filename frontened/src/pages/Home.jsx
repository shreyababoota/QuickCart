import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Sparkles, Zap, Truck, Star, ClipboardList } from 'lucide-react'
import { getProducts } from '@/services/api'
import { categories } from '@/lib/data'
import { filterNearExpiry } from '@/lib/productMapper'
import { fetchPersonalizedRecommendations } from '@/services/recommendationService'
import { useAuth } from '@/context/AuthContext'
import ProductCard from '@/components/ProductCard'
import PlanCard from '@/components/PlanCard'
import { Skeleton } from '@/components/ui/skeleton'
import { usePlans } from '@/context/PlansContext'

function Section({ title, subtitle, icon, children }) {
  return (
    <section className="mx-auto mt-8 max-w-7xl px-4 sm:mt-10">
      <div className="mb-4 flex items-end justify-between gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111111]">{title}</h2>
            {subtitle && <p className="text-sm text-[#565959]">{subtitle}</p>}
          </div>
        </div>
      </div>
      {children}
    </section>
  )
}

function Grid({ items, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border border-[#DDDDDD] bg-white p-3 shadow-soft">
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export default function Home() {
  const { data = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: getProducts })
  const { activePlans } = usePlans()
  const { user, isAuthenticated } = useAuth()

  const { data: recommended = [], isLoading: recsLoading } = useQuery({
    queryKey: ['personalized-recs', user?.id],
    queryFn: () => fetchPersonalizedRecommendations(user?.id, 10),
    enabled: isAuthenticated && !!user?.id,
  })

  const featured = data.filter((p) => p.featured)
  const trending = data.filter((p) => p.trending)
  const expiring = filterNearExpiry(data, 7)
  const personalized = isAuthenticated && recommended.length ? recommended.slice(0, 5) : data.slice(6, 11)

  return (
    <div className="flex-1 pb-8">
      {/* Hero Banner */}
      <section className="mx-auto mt-4 max-w-7xl px-4">
        <div className="overflow-hidden rounded-xl bg-gradient-hero p-6 text-white shadow-card sm:p-10">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF9900] px-3 py-1 text-xs font-bold text-[#111111]">
              <Sparkles className="h-3.5 w-3.5" /> Today's Deals
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Discover everything you need — from electronics to fashion and home essentials.
            </h1>
            <p className="mt-3 text-sm text-[#D5D9D9] sm:text-base">
              Browse top deals, trending picks, and curated categories in one modern shopping experience built for fast decisions and easy checkout.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FF9900] px-5 py-2.5 text-sm font-bold text-[#111111] shadow-glow transition-transform hover:scale-[1.02] hover:bg-[#E68A00]"
              >
                <Sparkles className="h-4 w-4" /> Shop with AI
              </Link>
              <a
                href="#deals"
                className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                View today's deals <ArrowRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-5 text-xs text-[#D5D9D9]">
              <span className="flex items-center gap-1.5"><Truck className="h-4 w-4 text-[#FF9900]" /> Fast delivery</span>
              <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-[#FF9900]" /> Flash deals daily</span>
              <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-[#FF9900]" /> Top-rated products</span>
            </div>
          </div>
        </div>
      </section>

      {/* My Active Plans */}
      {activePlans.length > 0 && (
        <Section
          title="My Active Plans"
          subtitle="Organize your shopping — plans work independently from cart & wishlist"
          icon={<span className="grid h-10 w-10 place-items-center rounded-lg bg-[#FFF3E0] text-[#FF9900]"><ClipboardList className="h-5 w-5" /></span>}
        >
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {activePlans.slice(0, 3).map((plan) => (
              <PlanCard key={plan.id} plan={plan} compact />
            ))}
          </div>
          {activePlans.length > 3 && (
            <Link to="/plans" className="mt-3 inline-flex text-sm font-semibold text-[#007185] hover:text-[#C45500]">
              View all plans →
            </Link>
          )}
        </Section>
      )}

      {/* Categories */}
      <Section title="Shop by Category">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-[#DDDDDD] bg-white p-3 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card sm:p-4"
            >
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-[#EAEDED] text-2xl sm:h-14 sm:w-14 sm:text-3xl">{c.emoji}</span>
              <span className="text-[11px] font-semibold leading-tight text-[#111111] sm:text-xs">{c.name}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Promo banners */}
      <section className="mx-auto mt-8 grid max-w-7xl gap-4 px-4 sm:grid-cols-2">
        <div className="rounded-lg border border-[#DDDDDD] bg-white p-6 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wide text-[#C45500]">Limited time</p>
          <h3 className="mt-1 text-lg font-bold text-[#111111]">Up to 40% off Electronics</h3>
          <p className="mt-1 text-sm text-[#565959]">Smart TVs, laptops, headphones & more</p>
          <Link to="/" className="mt-3 inline-flex text-sm font-semibold text-[#007185] hover:text-[#C45500]">
            Shop now →
          </Link>
        </div>
        <div className="rounded-lg border border-[#DDDDDD] bg-white p-6 shadow-soft">
          <p className="text-xs font-bold uppercase tracking-wide text-[#C45500]">New arrivals</p>
          <h3 className="mt-1 text-lg font-bold text-[#111111]">Fashion & Beauty picks</h3>
          <p className="mt-1 text-sm text-[#565959]">Trending styles and personal care essentials</p>
          <Link to="/" className="mt-3 inline-flex text-sm font-semibold text-[#007185] hover:text-[#C45500]">
            Explore →
          </Link>
        </div>
      </section>

      <div id="deals" />
      <Section
        title="Near-Expiry Deals"
        subtitle="Grab them before they're gone — extra savings, less waste"
        icon={<span className="grid h-10 w-10 place-items-center rounded-lg bg-[#FFF3E0] text-[#C45500]"><Zap className="h-5 w-5" /></span>}
      >
        <Grid items={expiring} loading={isLoading} />
      </Section>

      <Section
        title="Featured Products"
        icon={<span className="grid h-10 w-10 place-items-center rounded-lg bg-[#EAEDED] text-[#131921]"><Sparkles className="h-5 w-5" /></span>}
      >
        <Grid items={featured} loading={isLoading} />
      </Section>

      <Section title="Trending Now" subtitle="What everyone's adding to cart">
        <Grid items={trending} loading={isLoading} />
      </Section>

      <Section
        title="Recommended For You"
        subtitle="Personalised by AmaCart AI"
        icon={<span className="grid h-10 w-10 place-items-center rounded-lg bg-[#FFF3E0] text-[#FF9900]"><Star className="h-5 w-5" /></span>}
      >
        <Grid items={personalized} loading={isLoading || recsLoading} />
      </Section>
    </div>
  )
}
