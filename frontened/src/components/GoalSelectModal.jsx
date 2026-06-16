import { useState, useEffect } from 'react'
import { usePlans } from '@/context/PlansContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function GoalSelectModal({ product, onClose, onSelect }) {
  const { plans, refreshPlans, createPlan } = usePlans()
  const [selectedGoalId, setSelectedGoalId] = useState('general')
  const [planName, setPlanName] = useState('')
  const [planBudget, setPlanBudget] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    refreshPlans()
  }, [])

  const handleSelect = async (flowType) => {
    if (selectedGoalId === 'new') {
      if (!planName.trim()) {
        toast.error('Please enter a plan name')
        return
      }
      setCreating(true)
      try {
        const newPlan = await createPlan({ name: planName.trim(), budget: Number(planBudget) || null })
        if (newPlan && newPlan.id) {
          onSelect(newPlan.id, flowType)
        } else {
          toast.error('Failed to create plan')
        }
      } catch (err) {
        toast.error(err.message || 'Failed to create plan')
      } finally {
        setCreating(false)
      }
    } else {
      onSelect(selectedGoalId, flowType)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-[#DDDDDD] bg-white p-6 shadow-soft animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-[#DDDDDD] pb-3">
          <h2 className="text-lg font-bold text-[#111111]">Add Product To:</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-[#F7F7F7] text-[#565959] hover:text-[#111111]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-[#565959] mb-4">
            Select a plan to associate <strong className="text-[#111111]">{product?.name || 'these items'}</strong> with, or choose General Cart:
          </p>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {plans.map((plan) => (
              <label
                key={plan.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-[#F7F7F7] transition-all ${
                  selectedGoalId === plan.id ? 'border-[#FF9900] bg-[#FFF8F0]' : 'border-[#DDDDDD]'
                }`}
              >
                <input
                  type="radio"
                  name="goal-option"
                  value={plan.id}
                  checked={selectedGoalId === plan.id}
                  onChange={() => setSelectedGoalId(plan.id)}
                  className="h-4 w-4 border-[#DDDDDD] text-[#FF9900] focus:ring-[#FF9900]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#111111]">
                    <span>{plan.emoji}</span>
                    <span>{plan.name}</span>
                  </div>
                  {plan.budget > 0 && (
                    <div className="text-xs text-[#565959]">Budget: ₹{plan.budget.toLocaleString()}</div>
                  )}
                </div>
              </label>
            ))}

            <label
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-[#F7F7F7] transition-all ${
                selectedGoalId === 'general' ? 'border-[#FF9900] bg-[#FFF8F0]' : 'border-[#DDDDDD]'
              }`}
            >
              <input
                type="radio"
                name="goal-option"
                value="general"
                checked={selectedGoalId === 'general'}
                onChange={() => setSelectedGoalId('general')}
                className="h-4 w-4 border-[#DDDDDD] text-[#FF9900] focus:ring-[#FF9900]"
              />
              <div className="flex-1">
                <div className="font-semibold text-[#111111]">Not associated with any plan</div>
              </div>
            </label>

            <label
              className={`flex flex-col gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                selectedGoalId === 'new' ? 'border-[#FF9900] bg-[#FFF8F0]' : 'border-[#DDDDDD] hover:bg-[#F7F7F7]'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="goal-option"
                  value="new"
                  checked={selectedGoalId === 'new'}
                  onChange={() => setSelectedGoalId('new')}
                  className="h-4 w-4 border-[#DDDDDD] text-[#FF9900] focus:ring-[#FF9900]"
                />
                <div className="font-semibold text-[#111111]">Create New Plan</div>
              </div>

              {selectedGoalId === 'new' && (
                <div className="ml-7 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                  <Input 
                    placeholder="Plan Name (e.g. Goa Trip)" 
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    className="h-9 text-sm"
                  />
                  <Input 
                    type="number"
                    placeholder="Budget (₹)" 
                    value={planBudget}
                    onChange={(e) => setPlanBudget(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-[#DDDDDD] pt-4">
          <Button variant="outline" onClick={onClose} disabled={creating}>
            Cancel
          </Button>
          {selectedGoalId === 'general' ? (
            <Button
              className="bg-[#FF9900] hover:bg-[#e88a00] text-white"
              disabled={creating}
              onClick={() => handleSelect('plan-and-cart')}
            >
              {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Add To Cart
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-[#FF9900] text-[#FF9900] hover:bg-[#FFF8F0]"
                disabled={creating}
                onClick={() => handleSelect('plan-only')}
              >
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add Only To Plan
              </Button>
              <Button
                className="bg-[#FF9900] hover:bg-[#e88a00] text-white"
                disabled={creating}
                onClick={() => handleSelect('plan-and-cart')}
              >
                {creating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Add To Plan & Cart
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
