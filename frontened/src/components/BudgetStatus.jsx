import { cn } from '@/lib/utils'

const STATUS_STYLES = {
  green: { bg: 'bg-[#067D62]', text: 'text-[#067D62]', label: 'Within Budget' },
  yellow: { bg: 'bg-[#FF9900]', text: 'text-[#C45500]', label: 'Approaching Budget Limit' },
  red: { bg: 'bg-[#CC0C39]', text: 'text-[#CC0C39]', label: 'Budget Exceeded' },
}

export default function BudgetStatus({ status = 'green', label, percent = 0, compact = false }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.green
  const displayLabel = label || style.label

  if (compact) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold', style.text)}>
        <span className={cn('h-2 w-2 rounded-full', style.bg)} />
        {displayLabel}
      </span>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className={cn('font-semibold', style.text)}>{displayLabel}</span>
        {percent > 0 && <span className="text-[#565959]">{percent}% used</span>}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#EAEDED]">
        <div
          className={cn('h-full rounded-full transition-all', style.bg)}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  )
}

export function SavingsSuggestions({ suggestions = [] }) {
  if (!suggestions.length) return null

  return (
    <div className="mt-3 rounded-lg border border-[#FF9900]/30 bg-[#FFF8F0] p-3">
      <p className="mb-2 text-xs font-bold text-[#C45500]">Savings Suggestions</p>
      <ul className="space-y-1">
        {suggestions.map((s, i) => (
          <li key={i} className="text-xs text-[#565959]">
            💡 {s.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
