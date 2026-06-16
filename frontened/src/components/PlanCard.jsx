import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usePlans } from '@/context/PlansContext'
import { STATUS_LABELS } from '@/lib/plans'
import { formatINR } from '@/lib/data'

export default function PlanCard({ plan, compact = false }) {
  const { getPlanStats, movePlanToCart } = usePlans()
  const navigate = useNavigate()
  const stats = getPlanStats(plan)
  const statusInfo = STATUS_LABELS[stats.status] ?? STATUS_LABELS.planning

  if (compact) {
    return (
      <Link
        to={`/plans/${plan.id}`}
        className="flex items-center gap-3 rounded-lg border border-[#DDDDDD] bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
      >
        <span className="text-2xl">{plan.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-[#111111]">{plan.name}</p>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#EAEDED]">
            <div
              className="h-full rounded-full bg-[#FF9900] transition-all"
              style={{ width: `${stats.completion}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-[#565959]">{stats.completion}% Complete</p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/plans/${plan.id}`}
      className="flex flex-col rounded-lg border border-[#DDDDDD] bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{plan.emoji}</span>
          <div>
            <h3 className="font-bold text-[#111111]">{plan.name}</h3>
            <p className="text-xs text-[#565959]">Created {plan.createdAt}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[#F7F7F7] px-2.5 py-1 text-xs font-semibold text-[#111111]">
          {statusInfo.dot} {statusInfo.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[#565959]">Budget</p>
          <p className="font-bold text-[#111111]">{formatINR(plan.budget)}</p>
        </div>
        <div>
          <p className="text-[#565959]">Products</p>
          <p className="font-bold text-[#111111]">{stats.productCount}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-[#565959]">Completion</span>
          <span className="font-semibold text-[#111111]">{stats.completion}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#EAEDED]">
          <div
            className="h-full rounded-full bg-[#FF9900] transition-all"
            style={{ width: `${stats.completion}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex justify-between text-xs text-[#565959]">
        <span>Spent: {formatINR(stats.spent)}</span>
        <span>Remaining: {formatINR(stats.remaining)}</span>
      </div>

      <div className="mt-4 pt-3 border-t border-[#DDDDDD]">
        <Button 
          className="w-full text-xs h-8 bg-[#FF9900] hover:bg-[#e88a00] text-white"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await movePlanToCart(plan.id);
            navigate('/cart');
          }}
        >
          Add Entire Plan To Cart
        </Button>
      </div>
    </Link>
  )
}
