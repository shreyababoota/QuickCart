import { deriveStatus, calcCompletion, STATUS_LABELS } from '@/lib/plans'

export { deriveStatus, calcCompletion, STATUS_LABELS }

export function goalToPlan(goal, groupedEntry, extras = {}) {
  const products = groupedEntry?.products || []
  return {
    id: String(goal.id),
    name: goal.goal_text,
    emoji: extras.emoji || inferPlanEmoji(goal.goal_text),
    type: extras.type || inferPlanType(goal.goal_text),
    budget: goal.budget || groupedEntry?.budget || 0,
    status: deriveStatus({
      productIds: products.map((p) => p.id),
      targetCount: 10,
      status: extras.status,
    }),
    createdAt: formatGoalDate(goal.created_at),
    source: extras.source || 'manual',
    productIds: products.map((p) => p.id),
    products,
    targetCount: 10,
  }
}

function formatGoalDate(value) {
  if (!value) return new Date().toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  try {
    return new Date(value).toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

export function inferPlanEmoji(text = '') {
  const lower = text.toLowerCase()
  if (lower.includes('goa') || lower.includes('trip') || lower.includes('travel')) return '✈️'
  if (lower.includes('college') || lower.includes('semester')) return '🎓'
  if (lower.includes('home') || lower.includes('apartment')) return '🏠'
  if (lower.includes('workout') || lower.includes('fitness')) return '💪'
  if (lower.includes('weight')) return '⚖️'
  return '📋'
}

export function inferPlanType(text = '') {
  const lower = text.toLowerCase()
  if (lower.includes('trip') || lower.includes('travel') || lower.includes('goa')) return 'trip'
  if (lower.includes('college') || lower.includes('semester')) return 'college'
  if (lower.includes('gym') || lower.includes('workout') || lower.includes('fitness')) return 'gym'
  if (lower.includes('home')) return 'home'
  if (lower.includes('lose') || lower.includes('weight')) return 'weight_loss'
  return 'custom'
}
