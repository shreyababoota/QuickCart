import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/context/AuthContext'
import { fetchGoals, createGoal as createGoalApi, updateGoal as updateGoalApi, deleteGoal as deleteGoalApi } from '@/services/goalService'
import { addToCart as addToCartApi, fetchGroupedCart } from '@/services/cartService'
import { fetchRecommendations, fetchMissingItems } from '@/services/recommendationService'
import { detectPlanIntent } from '@/lib/plans'
import { goalToPlan, deriveStatus, calcCompletion, STATUS_LABELS } from '@/lib/goalAdapter'
import { resolveBackendProductIdAsync } from '@/lib/productMapper'

const PlansContext = createContext(null)

export function PlansProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [plans, setPlans] = useState([])
  const [groupedCart, setGroupedCart] = useState([])
  const [activeAiPlanId, setActiveAiPlanId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [planOnlyProducts, setPlanOnlyProducts] = useState({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('amacart-plan-only-items')
        if (stored) {
          setPlanOnlyProducts(JSON.parse(stored))
        }
      } catch {
        /* ignore */
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('amacart-plan-only-items', JSON.stringify(planOnlyProducts))
    }
  }, [planOnlyProducts])

  const refreshPlans = useCallback(async () => {
    if (!isAuthenticated) {
      setPlans([])
      setGroupedCart([])
      setHydrated(true)
      return
    }
    setLoading(true)
    try {
      const [goals, grouped] = await Promise.all([fetchGoals(), fetchGroupedCart()])
      setGroupedCart(grouped)
      setPlans(goals.map((goal) => goalToPlan(goal, grouped.find((g) => g.goal_id === goal.id))))
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
      setHydrated(true)
    }
  }, [isAuthenticated])

  useEffect(() => {
    refreshPlans()
  }, [refreshPlans])

  useEffect(() => {
    const handler = () => refreshPlans()
    window.addEventListener('cart:refresh', handler)
    return () => window.removeEventListener('cart:refresh', handler)
  }, [refreshPlans])

  const createPlan = async ({ name, emoji, type, budget, source = 'manual' }) => {
    try {
      const goal = await createGoalApi({ goal_text: name, budget })
      await refreshPlans()
      toast.success(`Plan "${name}" created`)
      return goalToPlan(goal, null, { emoji, type, source })
    } catch (err) {
      toast.error(err.message)
      return null
    }
  }

  const updatePlan = async (id, patch) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (String(p.id) !== String(id)) return p
        const next = { ...p, ...patch }
        next.status = patch.status ?? deriveStatus(next)
        return next
      }),
    )
    if (patch.budget !== undefined || patch.goal_text !== undefined) {
      try {
        await updateGoalApi(id, {
          budget: patch.budget,
          goal_text: patch.name || patch.goal_text,
        })
        await refreshPlans()
      } catch (err) {
        toast.error(err.message)
      }
    }
  }

  const deletePlan = async (id) => {
    try {
      await deleteGoalApi(id)
      await refreshPlans()
      if (String(activeAiPlanId) === String(id)) setActiveAiPlanId(null)
      window.dispatchEvent(new Event('cart:refresh'))
      toast.success('Plan deleted successfully')
      return true
    } catch (err) {
      toast.error('Failed to delete plan')
      return false
    }
  }

  const addProductToPlan = async (planId, product) => {
    const backendProductId = await resolveBackendProductIdAsync(product)
    if (!backendProductId) {
      toast.error('Could not resolve product ID for this plan')
      return false
    }
    try {
      console.log('PLAN PAYLOAD', { goal_id: Number(planId), product_id: backendProductId })
      await addToCartApi({ goal_id: Number(planId), product_id: backendProductId })
      await refreshPlans()
      window.dispatchEvent(new Event('cart:refresh'))
      return true
    } catch (err) {
      toast.error(err.message)
      return false
    }
  }

  const removeProductFromPlan = (planId, productId) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (String(p.id) !== String(planId)) return p
        return {
          ...p,
          productIds: p.productIds.filter((id) => id !== productId),
          products: (p.products || []).filter((prod) => prod.id !== productId),
        }
      }),
    )
    toast('Removed locally. Refresh to sync with server.')
  }

  const addToPlan = async (planId, productId, productName, productObj) => {
    const plan = plans.find((p) => String(p.id) === String(planId))
    if (!plan) return
    const product =
      productObj ||
      plan.products?.find((p) => p.id === productId) ||
      groupedCart.flatMap((g) => g.products).find((p) => p.id === productId)
    if (!product) {
      toast.error('Product not found')
      return
    }
    if (plan.productIds?.includes(productId)) {
      toast.info('Already in this plan')
      return
    }
    await addProductToPlan(planId, product)
    window.dispatchEvent(new Event('cart:refresh'))
    toast.success(`Added to ${plan.name}`)
  }

  const createPlanFromAI = async (intent, productIds = []) => {
    try {
      const goal = await createGoalApi({ goal_text: intent.name, budget: intent.budget })
      const plan = goalToPlan(goal, null, { emoji: intent.emoji, type: intent.type, source: 'ai' })
      setActiveAiPlanId(String(goal.id))

      if (productIds.length) {
        for (const pid of productIds) {
          const backendProductId = await resolveBackendProductIdAsync({ id: pid, backendId: pid })
          if (!backendProductId) continue
          try {
            await addToCartApi({ goal_id: goal.id, product_id: backendProductId })
          } catch {
            /* skip duplicates */
          }
        }
      }

      await refreshPlans()
      window.dispatchEvent(new Event('cart:refresh'))
      return { ...plan, id: String(goal.id) }
    } catch (err) {
      toast.error(err.message)
      return null
    }
  }

  const createPlanFromRecommendation = async (goalText, budget, recommendedProducts) => {
    const intent = detectPlanIntent(goalText) || {
      name: goalText,
      emoji: '📋',
      type: 'custom',
      budget: budget || 10000,
    }
    const ids = recommendedProducts.map((p) => p.backendId)
    return createPlanFromAI(intent, ids)
  }

  const addProductsToActivePlan = async (planId, productIds) => {
    for (const pid of productIds) {
      const backendProductId = await resolveBackendProductIdAsync({ id: pid, backendId: pid })
      if (!backendProductId) continue
      try {
        await addToCartApi({
          goal_id: Number(planId),
          product_id: backendProductId,
        })
      } catch {
        /* ignore duplicate */
      }
    }
    await refreshPlans()
    window.dispatchEvent(new Event('cart:refresh'))
  }

  const addProductsToPlanOnly = async (planId, products) => {
    const normalized = []
    for (const p of products) {
      const backendId = await resolveBackendProductIdAsync(p)
      normalized.push({
        ...p,
        backendId: backendId ?? p.backendId,
        id: p.id || p.productCode || p.product_id,
      })
    }

    setPlanOnlyProducts((prev) => {
      const existing = prev[planId] || []
      const seen = new Set(existing.map((x) => String(x.backendId || x.id)))
      const toAdd = normalized.filter((p) => !seen.has(String(p.backendId || p.id)))
      return {
        ...prev,
        [planId]: [...existing, ...toAdd],
      }
    })
    toast.success('Items saved directly to plan')
  }

  const movePlanToCart = async (planId) => {
    const itemsToMove = planOnlyProducts[planId] || []
    if (itemsToMove.length === 0) return true

    setLoading(true)
    try {
      for (const item of itemsToMove) {
        const backendProductId = await resolveBackendProductIdAsync(item)
        if (!backendProductId) continue
        try {
          console.log('ADD TO CART PAYLOAD', { goal_id: Number(planId), product_id: backendProductId })
          await addToCartApi({
            goal_id: Number(planId),
            product_id: backendProductId,
          })
        } catch {
          /* ignore duplicate */
        }
      }
      setPlanOnlyProducts((prev) => {
        const next = { ...prev }
        delete next[planId]
        return next
      })

      await refreshPlans()
      window.dispatchEvent(new Event('cart:refresh'))
      toast.success('Plan items added to cart!')
      return true
    } catch (err) {
      toast.error('Failed to move plan to cart')
      return false
    } finally {
      setLoading(false)
    }
  }

  const isInPlan = (productId) => plans.some((p) => p.productIds?.includes(productId))

  const getPlansForProduct = (productId) => plans.filter((p) => p.productIds?.includes(productId))

  const getPlanStats = (plan) => {
    const grouped = groupedCart.find((g) => String(g.goal_id) === String(plan.id))
    let spent = grouped?.spent ?? 0
    const budget = plan.budget || grouped?.budget || 0
    
    const staged = planOnlyProducts[plan.id] || []
    const seen = new Set(grouped?.products?.map(p => p.backendId || p.id) || plan.products?.map(p => p.backendId || p.id) || [])
    const uniqueStaged = staged.filter(p => !seen.has(p.backendId || p.id))
    
    uniqueStaged.forEach(p => {
        spent += (p.price * (p.qty || 1))
    })

    const remaining = Math.max(0, (budget - spent))
    const completion = calcCompletion(plan)
    const productCount = (plan.productIds?.length ?? plan.products?.length ?? 0) + uniqueStaged.length

    return {
      spent,
      remaining,
      completion,
      status: plan.status || deriveStatus(plan),
      productCount,
      budgetUsedPercent: budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0,
    }
  }

  const getPlanProducts = (plan) => {
    const grouped = groupedCart.find((g) => String(g.goal_id) === String(plan.id))
    const inCart = grouped?.products?.length ? grouped.products : (plan.products || [])
    
    const staged = planOnlyProducts[plan.id] || []
    const seen = new Set(inCart.map(p => p.backendId || p.id))
    const uniqueStaged = staged.filter(p => !seen.has(p.backendId || p.id))
    
    return [...inCart, ...uniqueStaged]
  }

  const getPlanSuggestions = async (plan) => {
    try {
      const [recs, missing] = await Promise.all([
        fetchRecommendations({ user_id: user?.id, goal: plan.name }),
        fetchMissingItems(plan.id).catch(() => ({ missing_items: [] })),
      ])

      const inPlan = new Set(getPlanProducts(plan).map((p) => p.id))
      const filteredRecs = recs.filter((p) => !inPlan.has(p.id))

      return {
        peopleAlsoBuy: filteredRecs.slice(0, 4),
        frequentlyForgotten: (missing.missing_products || missing.missing_items || [])
          .slice(0, 4)
          .map((item, idx) => {
            if (typeof item === 'string') {
              return {
                id: `missing-${plan.id}-${idx}`,
                name: item,
                price: 0,
                is_label_only: true,
              }
            }
            return { ...item, is_label_only: item.is_label_only || !item.id }
          }),
        recommendedAdditions: filteredRecs.slice(4, 8),
        missingItems: missing.missing_items || [],
      }
    } catch {
      return { peopleAlsoBuy: [], frequentlyForgotten: [], recommendedAdditions: [] }
    }
  }

  const activePlans = useMemo(
    () => plans.filter((p) => deriveStatus(p) !== 'completed').slice(0, 5),
    [plans],
  )

  const value = useMemo(
    () => ({
      plans,
      groupedCart,
      activePlans,
      activeAiPlanId,
      setActiveAiPlanId,
      loading,
      createPlan,
      updatePlan,
      deletePlan,
      addToPlan,
      addProductToPlan,
      removeProductFromPlan,
      createPlanFromAI,
      createPlanFromRecommendation,
      addProductsToActivePlan,
      addProductsToPlanOnly,
      movePlanToCart,
      isInPlan,
      getPlansForProduct,
      getPlanStats,
      getPlanProducts,
      getPlanSuggestions,
      refreshPlans,
      hydrated,
      STATUS_LABELS,
    }),
    [plans, groupedCart, activePlans, activeAiPlanId, loading, hydrated, user?.id, planOnlyProducts],
  )

  return <PlansContext.Provider value={value}>{children}</PlansContext.Provider>
}

export function usePlans() {
  const ctx = useContext(PlansContext)
  if (!ctx) throw new Error('usePlans must be used within PlansProvider')
  return ctx
}

// GoalContext alias
export const GoalProvider = PlansProvider
export const useGoals = usePlans
