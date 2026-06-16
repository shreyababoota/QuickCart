import { products } from '@/lib/data'

export const PLAN_TYPES = {
  trip: {
    keywords: ['trip', 'travel', 'goa', 'vacation', 'holiday', 'beach', 'getaway', 'tour'],
    emoji: '✈️',
    defaultBudget: 15000,
    targetCount: 10,
    searchTerms: ['bag', 'sunglasses', 'charger', 'headphones', 'watch', 'speaker', 'camera', 'travel'],
    peopleAlsoBuy: ['Voyager Travel Bag', 'SunGlow Sunglasses', 'ChargeMate Wireless Charger'],
    frequentlyForgotten: ['Power Bank', 'Sunscreen', 'First Aid Kit'],
    recommendedAdditions: ['Beach Towel', 'Snacks', 'Water Bottle'],
  },
  college: {
    keywords: ['college', 'university', 'campus', 'dorm', 'semester', 'hostel'],
    emoji: '🎓',
    defaultBudget: 80000,
    targetCount: 11,
    searchTerms: ['laptop', 'bag', 'headphones', 'tablet', 'watch', 'ssd', 'hub', 'speaker'],
    peopleAlsoBuy: ['SwiftBook Pro Laptop', 'Voyager Travel Bag', 'AirFit Pro Headphones'],
    frequentlyForgotten: ['Notebook', 'Extension Cord', 'Desk Lamp'],
    recommendedAdditions: ['Backpack', 'USB Hub', 'External SSD'],
  },
  home: {
    keywords: ['home setup', 'new home', 'apartment', 'moving', 'furnish', 'home essentials'],
    emoji: '🏠',
    defaultBudget: 50000,
    targetCount: 10,
    searchTerms: ['speaker', 'tv', 'tablet', 'hub', 'charger', 'watch', 'camera'],
    peopleAlsoBuy: ['Ultra HD 55-inch Smart TV', 'EchoBeam Smart Speaker', 'PowerDock USB Hub'],
    frequentlyForgotten: ['Extension Cord', 'Cleaning Supplies', 'Tool Kit'],
    recommendedAdditions: ['Smart Speaker', 'USB Hub', 'Wireless Charger'],
  },
  gym: {
    keywords: ['gym', 'workout', 'fitness', 'dumbbell', 'exercise', 'home gym'],
    emoji: '💪',
    defaultBudget: 25000,
    targetCount: 8,
    searchTerms: ['dumbbell', 'resistance', 'yoga', 'mat', 'protein', 'band', 'shaker'],
    peopleAlsoBuy: ['Dumbbells', 'Resistance Bands', 'Yoga Mat'],
    frequentlyForgotten: ['Water Bottle', 'Towel', 'Protein Bar'],
    recommendedAdditions: ['Protein Shaker', 'Gym Gloves'],
  },
  weight_loss: {
    keywords: ['lose', 'weight', 'diet', '10kg', 'healthy', 'fitness goal'],
    emoji: '⚖️',
    defaultBudget: 12000,
    targetCount: 8,
    searchTerms: ['protein', 'healthy', 'snack', 'water bottle', 'fruit', 'salad'],
    peopleAlsoBuy: ['Protein Foods', 'Healthy Snacks', 'Water Bottle'],
    frequentlyForgotten: ['Shaker Bottle', 'Measuring Cup', 'Snacks'],
    recommendedAdditions: ['Yoga Mat', 'Fitness Tracker'],
  },
  custom: {
    keywords: ['plan', 'shopping list', 'organize', 'bundle'],
    emoji: '📋',
    defaultBudget: 10000,
    targetCount: 8,
    searchTerms: [],
    peopleAlsoBuy: [],
    frequentlyForgotten: [],
    recommendedAdditions: [],
  },
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export function detectPlanIntent(message) {
  const lower = message.toLowerCase()

  if (lower.includes('goa')) {
    return buildIntent('trip', 'Goa Trip Plan', 'Goa')
  }

  for (const [type, config] of Object.entries(PLAN_TYPES)) {
    if (type === 'custom') continue
    if (config.keywords.some((k) => lower.includes(k))) {
      if (type === 'trip') {
        const destMatch = lower.match(/(?:trip to|visit|going to|planning)\s+([a-z]+)/i)
        const dest = destMatch ? capitalize(destMatch[1]) : 'Travel'
        return buildIntent(type, `${dest} Trip Plan`)
      }
      if (type === 'college') return buildIntent(type, 'College Essentials')
      if (type === 'home') return buildIntent(type, 'Home Setup')
      if (type === 'gym') return buildIntent(type, 'Home Gym Setup')
      if (type === 'weight_loss') return buildIntent(type, 'Lose 10kg')
    }
  }

  if (/\bplan(n)?ing\b/.test(lower) || lower.includes('shopping list')) {
    const nameMatch = message.match(/(?:called|named|for)\s+["']?([^"'.!?]+)["']?/i)
    const name = nameMatch ? capitalize(nameMatch[1].trim()) : 'My Shopping Plan'
    return buildIntent('custom', name)
  }

  return null
}

function buildIntent(type, name, destination) {
  const config = PLAN_TYPES[type]
  return {
    type,
    name,
    emoji: config.emoji,
    budget: config.defaultBudget,
    targetCount: config.targetCount,
    destination,
  }
}

export function findProductsForIntent(intent, limit = 6) {
  const config = PLAN_TYPES[intent.type] ?? PLAN_TYPES.custom
  const terms = [...config.searchTerms]
  if (intent.destination) terms.push(intent.destination.toLowerCase())

  const scored = products.map((p) => {
    const hay = `${p.name} ${p.description ?? ''} ${p.category} ${p.brand ?? ''}`.toLowerCase()
    let score = 0
    for (const term of terms) {
      if (hay.includes(term.toLowerCase())) score += 2
    }
    if (intent.type === 'college' && hay.includes('laptop')) score += 5
    if (intent.type === 'trip' && (hay.includes('travel') || hay.includes('bag') || hay.includes('sunglasses'))) score += 3
    return { product: p, score }
  })

  return scored
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.product)
}

export function findProductsByNames(names) {
  return names
    .map((label) => {
      let product = products.find((p) => p.name.toLowerCase().includes(label.toLowerCase()))
      if (!product) {
        const keywords = label.toLowerCase().split(/\s+/)
        product = products.find((p) => {
          const hay = `${p.name} ${p.description ?? ''}`.toLowerCase()
          return keywords.some((k) => k.length > 2 && hay.includes(k))
        })
      }
      return product
    })
    .filter(Boolean)
}

export function getPlanSuggestions(plan) {
  const config = PLAN_TYPES[plan.type] ?? PLAN_TYPES.custom
  const inPlan = new Set(plan.productIds)

  const pick = (labels) =>
    findProductsByNames(labels).filter((p) => !inPlan.has(p.id))

  return {
    peopleAlsoBuy: pick(config.peopleAlsoBuy).slice(0, 4),
    frequentlyForgotten: pick(config.frequentlyForgotten).slice(0, 4),
    recommendedAdditions: pick(config.recommendedAdditions).slice(0, 4),
  }
}

export function getPlanProducts(plan) {
  return plan.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
}

export function calcPlanSpent(plan) {
  return getPlanProducts(plan).reduce((sum, p) => sum + p.price, 0)
}

export function calcCompletion(plan) {
  const target = plan.targetCount || 10
  const count = plan.productIds.length
  return Math.min(100, Math.round((count / target) * 100))
}

export function deriveStatus(plan) {
  const completion = calcCompletion(plan)
  if (plan.status === 'completed' || completion >= 100) return 'completed'
  if (completion >= 20 || plan.productIds.length >= 2) return 'shopping'
  return 'planning'
}

export const STATUS_LABELS = {
  planning: { label: 'Planning', dot: '🟡' },
  shopping: { label: 'Shopping', dot: '🟠' },
  completed: { label: 'Completed', dot: '🟢' },
}

export function createPlanObject({ name, emoji = '📋', type = 'custom', budget = 10000, source = 'manual', productIds = [], targetCount }) {
  const config = PLAN_TYPES[type] ?? PLAN_TYPES.custom
  return {
    id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    emoji,
    type,
    budget,
    status: 'planning',
    createdAt: new Date().toISOString().slice(0, 10),
    source,
    productIds,
    targetCount: targetCount ?? config.targetCount,
  }
}

export function buildSeedPlans() {
  const goaProducts = findProductsForIntent({ type: 'trip', name: 'Goa Trip Plan', destination: 'Goa' }, 7).map((p) => p.id)
  const collegeProducts = findProductsForIntent({ type: 'college', name: 'College Essentials' }, 5).map((p) => p.id)
  const homeProducts = findProductsForIntent({ type: 'home', name: 'Home Setup' }, 2).map((p) => p.id)

  return [
    { ...createPlanObject({ name: 'Goa Trip Plan', emoji: '✈️', type: 'trip', budget: 15000, source: 'ai', productIds: goaProducts }), id: 'plan-seed-goa', createdAt: addDays(-5) },
    { ...createPlanObject({ name: 'College Essentials', emoji: '🎓', type: 'college', budget: 80000, source: 'manual', productIds: collegeProducts }), id: 'plan-seed-college', createdAt: addDays(-12) },
    { ...createPlanObject({ name: 'Home Setup', emoji: '🏠', type: 'home', budget: 50000, source: 'manual', productIds: homeProducts }), id: 'plan-seed-home', createdAt: addDays(-3) },
  ].map((p) => ({ ...p, status: deriveStatus(p) }))
}

function addDays(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export function processAssistantMessage(message, { activePlanId, plans }) {
  const intent = detectPlanIntent(message)

  if (intent) {
    const matched = findProductsForIntent(intent, 5)
    return {
      action: 'create_plan',
      intent,
      productIds: matched.map((p) => p.id),
      reply: buildPlanReply(intent, matched),
    }
  }

  if (activePlanId) {
    const plan = plans.find((p) => p.id === activePlanId)
    if (plan) {
      const extra = findProductsForIntent({ type: plan.type, name: plan.name }, 3)
        .filter((p) => !plan.productIds.includes(p.id))
      if (extra.length) {
        return {
          action: 'add_to_active',
          planId: activePlanId,
          productIds: extra.map((p) => p.id),
          reply: `I've added ${extra.map((p) => p.name).join(', ')} to your **${plan.name}**. You can still add them to cart or wishlist anytime!`,
        }
      }
    }
  }

  const generic = findProductsForIntent({ type: 'custom', name: 'Suggestions' }, 3)
  return {
    action: 'suggest',
    productIds: generic.map((p) => p.id),
    reply: generic.length
      ? `Here are some picks for you: ${generic.map((p) => p.name).join(', ')}. Try saying "I'm planning a Goa trip" to create a smart shopping plan!`
      : `I can help you compare products, find deals, or create a Smart Plan. Try "I'm planning a Goa trip" or "College essentials"!`,
  }
}

function buildPlanReply(intent, products) {
  const names = products.map((p) => p.name).join(', ')
  return `I've created **${intent.name}** and added recommended items: ${names || 'browse products to add more'}. These are saved to your plan — you can still add anything to cart or wishlist separately. View your plan anytime from Plans!`
}
