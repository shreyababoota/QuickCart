import { useNavigate } from 'react-router-dom'

import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'

import { useCart } from '@/context/CartContext'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import { Skeleton } from '@/components/ui/skeleton'

import { formatINR } from '@/lib/data'

import BudgetStatus, { SavingsSuggestions } from '@/components/BudgetStatus'

import { checkoutOrder } from '@/services/orderService'

import { toast } from 'sonner'



export default function Cart() {

  const navigate = useNavigate()

  const { grouped, items, removeFromCart, setQty, subtotal, coupon, applyCoupon, removeCoupon, loading, clearCart, refreshCart } = useCart()



  const handleCheckout = async () => {

    try {

      await checkoutOrder()

      clearCart()

      await refreshCart()

      toast.success('Order placed successfully!')

      navigate('/orders')

    } catch (err) {

      toast.error(err.message || 'Checkout failed')

    }

  }



  if (loading && grouped.length === 0) {

    return (

      <div className="mx-auto max-w-7xl flex-1 px-4 py-8">

        <Skeleton className="mb-8 h-10 w-48" />

        <Skeleton className="h-64 w-full rounded-lg" />

      </div>

    )

  }



  if (grouped.length === 0 || items.length === 0) {

    return (

      <div className="mx-auto max-w-7xl flex-1 px-4 py-16 text-center">

        <div className="mx-auto max-w-md rounded-lg border border-[#DDDDDD] bg-white p-10 shadow-soft">

          <ShoppingBag className="mx-auto h-12 w-12 text-[#565959]" />

          <h2 className="mt-4 text-2xl font-bold text-[#111111]">Your cart is empty</h2>

          <p className="mt-2 text-[#565959]">Start shopping to add items to your cart</p>

          <Button onClick={() => navigate('/')} className="mt-6">Continue Shopping</Button>

        </div>

      </div>

    )

  }



  const discount = coupon ? (subtotal * coupon.percent) / 100 : 0

  const total = subtotal - discount



  return (

    <div className="mx-auto max-w-7xl flex-1 px-4 py-8">

      <h1 className="mb-8 text-3xl font-bold text-[#111111]">Shopping Cart</h1>



      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

        <div className="lg:col-span-2 space-y-6">

          {grouped.map((group) => (

            group.products.length > 0 && (

              <div key={group.goal_id ?? 'general'} className="rounded-lg border border-[#DDDDDD] bg-white shadow-soft">

                <div className="border-b border-[#DDDDDD] px-4 py-3">

                  <div className="flex flex-wrap items-center justify-between gap-2">

                    <h3 className="font-bold text-[#111111]">{group.goal}</h3>

                    {group.budget > 0 && (

                      <BudgetStatus

                        status={group.budget_status || 'green'}

                        label={group.budget_status_label}

                        compact

                      />

                    )}

                  </div>

                  <p className="text-sm text-[#565959]">

                    Budget {formatINR(group.budget)} · Spent {formatINR(group.spent)} · Remaining {formatINR(group.remaining)}

                  </p>

                  <SavingsSuggestions suggestions={group.savings_suggestions} />

                </div>

                {group.products.map((product, idx) => {

                  const item = items.find((i) => i.product.id === product.id && i.goalId === group.goal_id)

                  return (

                    <div key={`${group.goal_id}-${product.id}`} className={`flex gap-4 p-4 ${idx > 0 ? 'border-t border-[#DDDDDD]' : ''}`}>

                      <div className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-4xl ${product.gradient}`}>

                        {product.emoji}

                      </div>

                      <div className="min-w-0 flex-1">

                        <h3 className="font-semibold text-[#111111]">{product.name}</h3>

                        {product.brand && <p className="text-xs text-[#007185]">{product.brand}</p>}

                        <p className="text-sm text-[#565959]">{product.category}</p>

                        <p className="mt-2 font-bold text-[#111111]">{formatINR(product.price)}</p>

                      </div>

                      <div className="flex flex-col items-end gap-2">

                        <div className="flex items-center gap-0.5 rounded-md border border-[#DDDDDD] bg-[#F7F7F7]">

                          <button onClick={() => setQty(product.id, (item?.qty || 1) - 1)} className="grid h-8 w-8 place-items-center text-[#111111] hover:bg-[#EAEDED]">

                            <Minus className="h-4 w-4" />

                          </button>

                          <span className="min-w-8 text-center text-sm font-bold text-[#111111]">{item?.qty || 1}</span>

                          <button onClick={() => setQty(product.id, (item?.qty || 1) + 1)} className="grid h-8 w-8 place-items-center text-[#111111] hover:bg-[#EAEDED]">

                            <Plus className="h-4 w-4" />

                          </button>

                        </div>

                        <Button

                          variant="ghost"

                          size="sm"

                          onClick={() => removeFromCart(group.goal_id, product.backendId || product.id)}

                          className="text-[#CC0C39] hover:bg-[#FDECEC] hover:text-[#CC0C39]"

                        >

                          <Trash2 className="mr-1 h-4 w-4" /> Remove

                        </Button>

                      </div>

                    </div>

                  )

                })}

              </div>

            )

          ))}

        </div>



        <div className="h-fit rounded-lg border border-[#DDDDDD] bg-white p-6 shadow-soft">

          <h3 className="mb-4 text-lg font-bold text-[#111111]">Order Summary</h3>

          <div className="mb-4 space-y-2 border-b border-[#DDDDDD] pb-4">

            <div className="flex justify-between text-[#111111]"><span>Subtotal:</span> <span>{formatINR(subtotal)}</span></div>

            {coupon && (

              <div className="flex justify-between text-[#067D62]">

                <span>Discount ({coupon.percent}%):</span> <span>-{formatINR(discount)}</span>

              </div>

            )}

          </div>

          <div className="mb-6 flex justify-between text-lg font-bold text-[#111111]">

            <span>Total:</span> <span>{formatINR(total)}</span>

          </div>



          {!coupon && (

            <div className="mb-4">

              <Input

                type="text"

                placeholder="Coupon code"

                className="mb-2"

                onKeyDown={(e) => {

                  if (e.key === 'Enter') {

                    applyCoupon(e.target.value)

                    e.target.value = ''

                  }

                }}

              />

              <small className="text-[#565959]">Try: FRESH10, GREEN20, SAVE15</small>

            </div>

          )}

          {coupon && (

            <Button variant="outline" onClick={removeCoupon} className="mb-4 w-full">

              Remove Coupon

            </Button>

          )}



          <Button onClick={handleCheckout} className="mb-2 w-full">Proceed to Checkout</Button>

          <Button variant="outline" onClick={() => navigate('/')} className="w-full">Continue Shopping</Button>

        </div>

      </div>

    </div>

  )

}


