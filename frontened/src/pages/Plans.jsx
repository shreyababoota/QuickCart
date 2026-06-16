import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Sparkles } from 'lucide-react'
import { usePlans } from '@/context/PlansContext'
import PlanCard from '@/components/PlanCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PLAN_TYPES } from '@/lib/plans'

export default function Plans() {
  const { plans, createPlan } = usePlans()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', budget: '', type: 'custom' })

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    const config = PLAN_TYPES[form.type] ?? PLAN_TYPES.custom
    await createPlan({
      name: form.name.trim(),
      emoji: config.emoji,
      type: form.type,
      budget: Number(form.budget) || config.defaultBudget,
      source: 'manual',
    })
    setForm({ name: '', budget: '', type: 'custom' })
    setShowForm(false)
  }

  return (
    <div className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111111]">Smart Plans</h1>
          <p className="mt-1 text-sm text-[#565959]">
            Organize products into AI-generated or manual shopping plans — independent from cart & wishlist
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/assistant"><Sparkles className="mr-1.5 h-4 w-4" /> Create with AI</Link>
          </Button>
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus className="mr-1.5 h-4 w-4" /> New Plan
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-8 rounded-lg border border-[#DDDDDD] bg-white p-6 shadow-soft">
          <h2 className="mb-4 text-lg font-bold text-[#111111]">Create Manual Plan</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#111111]">Plan Name</label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="College Essentials"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#111111]">Budget (₹)</label>
              <Input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="10000"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[#111111]">Plan Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="flex h-10 w-full rounded-md border border-[#DDDDDD] bg-white px-3 text-sm text-[#111111]"
              >
                <option value="custom">Custom</option>
                <option value="trip">Trip / Travel</option>
                <option value="college">College</option>
                <option value="home">Home Setup</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button type="submit">Create Plan</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {plans.length === 0 ? (
        <div className="rounded-lg border border-[#DDDDDD] bg-white p-12 text-center shadow-soft">
          <p className="text-lg font-semibold text-[#111111]">No plans yet</p>
          <p className="mt-2 text-sm text-[#565959]">
            Create a manual plan or ask the AI Assistant — try "I'm planning a Goa trip"
          </p>
          <Button asChild className="mt-6">
            <Link to="/assistant">Open AI Assistant</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  )
}
