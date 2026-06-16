import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2, Plus, Heart, ShoppingCart } from 'lucide-react'
import { usePlans } from '@/context/PlansContext'
import { useCart } from '@/context/CartContext'
import { STATUS_LABELS } from '@/lib/goalAdapter'
import { formatINR } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import BudgetStatus, { SavingsSuggestions } from '@/components/BudgetStatus'
import ForgetListCard from '@/components/ForgetListCard'
import { normalizeProduct } from '@/lib/productMapper'

function SuggestionSection({ title, products, planId, onAdd }) {
  if (!products.length) return null
  return (
    <div className="rounded-lg border border-[#DDDDDD] bg-white p-4 shadow-soft">
      <h3 className="mb-3 text-sm font-bold text-[#111111]">{title}</h3>
      <div className="space-y-2">
        {products.map((p) => {
          const product = p.is_label_only ? p : normalizeProduct(p)
          return (
            <div key={p.id || p.name} className="flex items-center justify-between gap-2 rounded-md bg-[#F7F7F7] px-3 py-2">
              <div className="flex min-w-0 items-center gap-2">
                <span className="text-lg">{product.emoji || '📦'}</span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-[#111111]">{product.name}</p>
                  {product.price > 0 && <p className="text-xs text-[#565959]">{formatINR(product.price)}</p>}
                </div>
              </div>
              {!p.is_label_only && !p.isMissingLabel && (
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

export default function PlanDetail() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { plans, groupedCart, getPlanStats, updatePlan, deletePlan, removeProductFromPlan, addToPlan, getPlanProducts, getPlanSuggestions, loading, movePlanToCart } = usePlans()
  const { addToCart, toggleWishlist, wishlist } = useCart()
  const [suggestions, setSuggestions] = useState({ peopleAlsoBuy: [], frequentlyForgotten: [], recommendedAdditions: [], missingItems: [] })

  const plan = plans.find((p) => String(p.id) === String(planId))
  const grouped = groupedCart.find((g) => String(g.goal_id) === String(planId))

  useEffect(() => {
    if (!plan) return
    getPlanSuggestions(plan).then(setSuggestions)
  }, [plan?.id, grouped?.spent])

  if (loading && !plan) {
    return <div className="mx-auto max-w-6xl px-4 py-8"><Skeleton className="h-96 w-full rounded-lg" /></div>
  }

  if (!plan) return <Navigate to="/plans" replace />

  const stats = getPlanStats(plan)
  const products = getPlanProducts(plan)
  const statusInfo = STATUS_LABELS[stats.status] ?? STATUS_LABELS.planning
  const budgetStatus = grouped?.budget_status || 'green'
  const budgetLabel = grouped?.budget_status_label || 'Within Budget'

  return (
    <div className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <Link to="/plans" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-[#007185] hover:text-[#C45500]">
        <ArrowLeft className="h-4 w-4" /> All Plans
      </Link>

      <div className="mb-8 rounded-lg border border-[#DDDDDD] bg-white p-6 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{plan.emoji}</span>
            <div>
              <h1 className="text-2xl font-bold text-[#111111]">{plan.name}</h1>
              <p className="text-sm text-[#565959]">
                Created {plan.createdAt} · {plan.source === 'ai' ? 'AI Generated' : 'Manual'} · {statusInfo.dot} {statusInfo.label}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-[#FF9900] hover:bg-[#e88a00] text-white"
              onClick={async () => {
                await movePlanToCart(plan.id)
                navigate('/cart')
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Add Entire Plan To Cart
            </Button>
            <select
              value={plan.status}
              onChange={(e) => updatePlan(plan.id, { status: e.target.value })}
              className="rounded-md border border-[#DDDDDD] bg-white px-3 py-2 text-sm text-[#111111]"
            >
              <option value="planning">Planning</option>
              <option value="shopping">Shopping</option>
              <option value="completed">Completed</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={async () => {
                const ok = await deletePlan(plan.id)
                if (ok) navigate('/plans')
              }}
              className="text-[#CC0C39]"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-[#F7F7F7] p-4">
            <p className="text-xs text-[#565959]">Budget</p>
            <p className="text-lg font-bold text-[#111111]">{formatINR(plan.budget)}</p>
          </div>
          <div className="rounded-lg bg-[#F7F7F7] p-4">
            <p className="text-xs text-[#565959]">Spent</p>
            <p className="text-lg font-bold text-[#111111]">{formatINR(stats.spent)}</p>
          </div>
          <div className="rounded-lg bg-[#F7F7F7] p-4">
            <p className="text-xs text-[#565959]">Remaining</p>
            <p className={cn('text-lg font-bold', stats.remaining >= 0 ? 'text-[#067D62]' : 'text-[#CC0C39]')}>
              {formatINR(stats.remaining)}
            </p>
          </div>
          <div className="rounded-lg bg-[#F7F7F7] p-4">
            <p className="text-xs text-[#565959]">Budget Status</p>
            <div className="mt-1">
              <BudgetStatus status={budgetStatus} label={budgetLabel} compact />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <BudgetStatus status={budgetStatus} label={budgetLabel} percent={stats.budgetUsedPercent} />
        </div>

        <SavingsSuggestions suggestions={grouped?.savings_suggestions} />

        <div className="mt-4">
          <label className="mb-1 block text-xs text-[#565959]">Adjust Budget</label>
          <Input
            type="number"
            defaultValue={plan.budget}
            onBlur={(e) => updatePlan(plan.id, { budget: Number(e.target.value) || plan.budget })}
            className="max-w-xs"
          />
        </div>
      </div>

      {suggestions.frequentlyForgotten.length > 0 && (
        <div className="mb-6">
          <ForgetListCard
            items={suggestions.frequentlyForgotten}
            planId={plan.id}
            onAdd={addToPlan}
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-[#111111]">Plan Products ({products.length})</h2>
          {products.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#DDDDDD] bg-white p-8 text-center">
              <p className="text-[#565959]">No products yet. Add items from the catalog or AI suggestions below.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-[#DDDDDD] bg-white p-4 shadow-soft">
                  <span className={`grid h-14 w-14 place-items-center rounded-lg bg-gradient-to-br text-2xl ${p.gradient}`}>
                    {p.emoji || '📦'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${p.id}`} className="font-semibold text-[#111111] hover:text-[#C45500]">{p.name}</Link>
                    <p className="text-sm font-bold text-[#111111]">{formatINR(p.price)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => addToCart(p, plan.id)}>
                      <ShoppingCart className="h-3.5 w-3.5" /> Cart
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleWishlist(p.id)}
                      className={cn(wishlist.includes(p.id) && 'border-[#CC0C39] text-[#CC0C39]')}
                    >
                      <Heart className={cn('h-3.5 w-3.5', wishlist.includes(p.id) && 'fill-current')} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => removeProductFromPlan(plan.id, p.id)} className="text-[#565959]">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#111111]">AI Smart Suggestions</h2>
          <SuggestionSection title="People also buy" products={suggestions.peopleAlsoBuy} planId={plan.id} onAdd={addToPlan} />
          <SuggestionSection title="Recommended additions" products={suggestions.recommendedAdditions} planId={plan.id} onAdd={addToPlan} />
        </div>
      </div>
    </div>
  )
}
