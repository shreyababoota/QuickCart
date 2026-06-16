import { useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { usePlans } from '@/context/PlansContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export default function AddToPlanMenu({ product, size = 'sm', className }) {
  const { plans, addToPlan, createPlan, getPlansForProduct } = usePlans()
  const [creating, setCreating] = useState(false)
  const [newPlanName, setNewPlanName] = useState('')
  const inPlans = getPlansForProduct(product.id)

  const handleCreate = () => {
    if (!newPlanName.trim()) return
    createPlan({ name: newPlanName.trim(), emoji: '📋', type: 'custom' }).then((plan) => {
      if (plan) addToPlan(plan.id, product.id, product.name, product)
    })
    setNewPlanName('')
    setCreating(false)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={cn(
            'gap-1 border-[#DDDDDD] text-[#111111] hover:border-[#FF9900] hover:bg-[#FFF3E0]',
            inPlans.length > 0 && 'border-[#FF9900] bg-[#FFF3E0]',
            className,
          )}
        >
          <ClipboardList className="h-3.5 w-3.5" />
          {inPlans.length > 0 ? `In ${inPlans.length} Plan${inPlans.length > 1 ? 's' : ''}` : 'Add to Plan'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-[#DDDDDD] bg-white">
        <DropdownMenuLabel className="text-[#111111]">Add to Plan</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {plans.length === 0 && !creating && (
          <DropdownMenuItem disabled className="text-[#565959]">No plans yet</DropdownMenuItem>
        )}
        {plans.map((plan) => (
          <DropdownMenuItem
            key={plan.id}
            onClick={() => addToPlan(plan.id, product.id, product.name, product)}
            className="text-[#111111]"
          >
            <span className="mr-2">{plan.emoji}</span>
            {plan.name}
            {plan.productIds.includes(product.id) && (
              <span className="ml-auto text-xs text-[#067D62]">✓</span>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {creating ? (
          <div className="space-y-2 p-2">
            <Input
              value={newPlanName}
              onChange={(e) => setNewPlanName(e.target.value)}
              placeholder="Plan name..."
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <div className="flex gap-1">
              <Button size="sm" className="flex-1" onClick={handleCreate}>Create</Button>
              <Button size="sm" variant="outline" onClick={() => setCreating(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <DropdownMenuItem onClick={() => setCreating(true)} className="text-[#007185]">
            + Create new plan
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
