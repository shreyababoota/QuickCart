import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'

import { useNavigate } from 'react-router-dom'

import { toast } from 'sonner'

import { useAuth } from '@/context/AuthContext'

import { usePlans } from '@/context/PlansContext'

import { useProducts } from '@/context/ProductContext'

import { resolveBackendProductIdAsync } from '@/lib/productMapper'

import GoalSelectModal from '@/components/GoalSelectModal'

import {

  addToCart as addToCartApi,

  fetchGroupedCart,

  removeFromCartApi

} from '@/services/cartService'



const CartContext = createContext(null)

const COUPONS = { FRESH10: 10, GREEN20: 20, SAVE15: 15 }



export function CartProvider({ children }) {

  const { isAuthenticated } = useAuth()

  const { addProductsToPlanOnly, refreshPlans } = usePlans()

  const { products: productCatalog } = useProducts()

  const navigate = useNavigate()

  const [grouped, setGrouped] = useState([])

  const [wishlist, setWishlist] = useState([])

  const [coupon, setCoupon] = useState(null)

  const [loading, setLoading] = useState(false)

  const [qtyMap, setQtyMap] = useState({})

  const [goalSelectProduct, setGoalSelectProduct] = useState(null)



  useEffect(() => {

    if (typeof window === 'undefined') return

    try {

      const raw = localStorage.getItem('amacart-wishlist')

      if (raw) setWishlist(JSON.parse(raw))

    } catch {

      /* ignore */

    }

  }, [])



  useEffect(() => {

    if (typeof window === 'undefined') return

    localStorage.setItem('amacart-wishlist', JSON.stringify(wishlist))

  }, [wishlist])



  const refreshCart = useCallback(async () => {

    if (!isAuthenticated) {

      setGrouped([])

      return

    }

    setLoading(true)

    try {

      const data = await fetchGroupedCart()

      setGrouped(data)

    } catch (err) {

      toast.error(err.message)

    } finally {

      setLoading(false)

    }

  }, [isAuthenticated])



  useEffect(() => {

    refreshCart()

  }, [refreshCart])



  useEffect(() => {

    const handler = () => refreshCart()

    window.addEventListener('cart:refresh', handler)

    return () => window.removeEventListener('cart:refresh', handler)

  }, [refreshCart])



  const items = useMemo(() => {

    const flat = []

    grouped.forEach((group) => {

      group.products.forEach((product) => {

        flat.push({

          product,

          qty: qtyMap[product.id] || 1,

          goalId: group.goal_id,

          goalName: group.goal,

        })

      })

    })

    return flat

  }, [grouped, qtyMap])



  const addToCart = async (product, goalId) => {

    if (!isAuthenticated) {

      toast.error('Please login to add items to cart')

      return false

    }

    try {

      let resolvedGoalId = goalId

      if (resolvedGoalId === undefined) {

        setGoalSelectProduct(product)

        return true

      }



      const isGeneral = resolvedGoalId === 'general' || resolvedGoalId === null

      const targetGoalId = isGeneral ? null : Number(resolvedGoalId)



      // Determine the product ID to send to Flask backend
      // Only accept verified numeric backend IDs — no fallback/guessing
      let backendProductId = null

      // Try direct numeric backendId first
      if (product?.backendId && Number.isInteger(Number(product.backendId)) && Number(product.backendId) > 0) {
        backendProductId = Number(product.backendId)
      }
      // Try numeric id
      else if (product?.id && Number.isInteger(Number(product.id)) && Number(product.id) > 0 && !/^[Pp]\d+/.test(String(product.id))) {
        backendProductId = Number(product.id)
      }
      // Try resolving through catalog
      else {
        backendProductId = await resolveBackendProductIdAsync(product, productCatalog)
      }

      // If no valid backend ID could be resolved, reject the add — do NOT send raw identifiers
      if (!backendProductId) {
        toast.error('Could not identify this product. Please try again.')
        return false
      }

      console.log('[CartContext] addToCart:', { backendProductId, productName: product?.name })



      const groupMatch = grouped.find((g) => {

        if (targetGoalId === null) return g.goal_id === null

        return String(g.goal_id) === String(targetGoalId)

      })



      if (groupMatch && groupMatch.products.some((p) => String(p.backendId) === String(backendProductId))) {

        toast.info('Already in cart')

        return false

      }



      console.log('ADD TO CART PAYLOAD', { goal_id: targetGoalId, product_id: backendProductId })

      await addToCartApi({

        goal_id: targetGoalId,

        product_id: backendProductId,

      })

      await refreshCart()

      await refreshPlans()

      window.dispatchEvent(new Event('cart:refresh'))

      toast.success(`${product.name} added to cart`)

      return true

    } catch (err) {

      if (err.status === 409 || err.message?.includes('Already')) {

        toast.info('Already in cart')

      } else {

        toast.error(err.message)

      }

      return false

    }

  }



  const removeFromCart = async (goalId, productId) => {

    let targetGoalId = goalId

    let targetProductId = productId



    if (productId === undefined) {

      const productIdOrCode = goalId

      const cartItem = items.find(

        (i) => i.product.id === productIdOrCode || i.product.backendId === productIdOrCode

      )

      if (cartItem) {

        targetGoalId = cartItem.goalId

        targetProductId = cartItem.product.backendId || cartItem.product.id

      }

    }



    const normalizedGoalId = targetGoalId === 'general' || targetGoalId === undefined ? null : targetGoalId

    const prevGrouped = grouped



    setGrouped((current) =>

      current

        .map((group) => {

          const isMatch =

            normalizedGoalId === null

              ? group.goal_id === null

              : String(group.goal_id) === String(normalizedGoalId)

          if (!isMatch) return group

          return {

            ...group,

            products: group.products.filter(

              (p) => String(p.backendId || p.id) !== String(targetProductId)

            ),

          }

        })

        .filter((g) => g.products.length > 0)

    )



    try {

      await removeFromCartApi({

        goal_id: normalizedGoalId,

        product_id: Number(targetProductId),

      })

      await refreshPlans()

      window.dispatchEvent(new Event('cart:refresh'))

      toast.success('Item removed from cart')

    } catch (err) {

      setGrouped(prevGrouped)

      toast.error(err.message || 'Failed to remove item')

    }

  }



  const setQty = (id, qty) => {

    if (qty <= 0) {

      removeFromCart(id)

      return

    }

    setQtyMap((prev) => ({ ...prev, [id]: qty }))

  }



  const updateQuantity = (id, qty) => setQty(id, qty)



  const clearCart = () => {

    setQtyMap({})

    setCoupon(null)

    setGrouped([])

  }



  const addToWishlist = (product) => {

    const id = typeof product === 'string' ? product : product.id

    setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]))

    toast.success(`${typeof product === 'string' ? 'Item' : product.name} added to wishlist ❤️`)

  }



  const removeFromWishlist = (id) => {

    setWishlist((prev) => prev.filter((itemId) => itemId !== id))

    toast('Removed from wishlist')

  }



  const toggleWishlist = (productOrId) => {

    const id = typeof productOrId === 'string' ? productOrId : productOrId.id

    setWishlist((prev) => {

      const exists = prev.includes(id)

      if (exists) {

        toast('Removed from wishlist')

        return prev.filter((itemId) => itemId !== id)

      }

      toast.success(`${typeof productOrId === 'string' ? 'Item' : productOrId.name} added to wishlist ❤️`)

      return [...prev, id]

    })

  }



  const isInWishlist = (id) => wishlist.includes(id)



  const applyCoupon = (code) => {

    const percent = COUPONS[code.trim().toUpperCase()]

    if (percent) {

      setCoupon({ code: code.trim().toUpperCase(), percent })

      toast.success(`Coupon applied — ${percent}% off`)

      return true

    }

    toast.error('Invalid coupon code')

    return false

  }



  const removeCoupon = () => setCoupon(null)



  const value = useMemo(() => {

    const count = items.reduce((s, i) => s + i.qty, 0)

    const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0)

    return {

      items,

      grouped,

      wishlist,

      wishlistCount: wishlist.length,

      loading,

      addToCart,

      addToWishlist,

      removeFromCart,

      removeFromWishlist,

      setQty,

      updateQuantity,

      clearCart,

      toggleWishlist,

      isInWishlist,

      refreshCart,

      count,

      subtotal,

      coupon,

      applyCoupon,

      removeCoupon,

    }

  }, [items, grouped, wishlist, loading, coupon, qtyMap])



  return (

    <CartContext.Provider value={value}>

      {children}

      {goalSelectProduct && (

        <GoalSelectModal

          product={goalSelectProduct}

          onClose={() => setGoalSelectProduct(null)}

          onSelect={async (selectedGoalId, flowType) => {

            const product = goalSelectProduct

            setGoalSelectProduct(null)

            if (!product) return



            const planId = selectedGoalId === 'general' ? null : selectedGoalId



            if (flowType === 'plan-only') {

              if (planId == null) {

                toast.error('Select a plan to save items without adding to cart')

                return

              }

              await addProductsToPlanOnly(planId, [product])

              await refreshPlans()

              return

            }



            const success = await addToCart(product, planId)

            if (success && flowType === 'plan-and-cart') {

              navigate('/cart')

            }

          }}

        />

      )}

    </CartContext.Provider>

  )

}



export function useCart() {

  const ctx = useContext(CartContext)

  if (!ctx) throw new Error('useCart must be used within CartProvider')

  return ctx

}


