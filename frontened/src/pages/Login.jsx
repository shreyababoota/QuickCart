import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Leaf } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(form.email, form.password)
    setLoading(false)
    if (result.success) {
      navigate('/')
    } else {
      setError(result.error || 'Login failed. Please check your credentials.')
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-[#DDDDDD] bg-white p-8 shadow-card">
      <div className="mb-8 flex items-center justify-center">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#FF9900] text-[#111111]">
          <Leaf className="h-6 w-6" />
        </div>
        <h1 className="ml-3 text-2xl font-bold text-[#111111]">
          Ama<span className="text-[#FF9900]">Cart</span>
        </h1>
      </div>

      <h2 className="mb-6 text-center text-xl font-bold text-[#111111]">Login to Your Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="rounded border border-[#F5C6CB] bg-[#FDECEC] p-3 text-sm text-[#CC0C39]">{error}</div>}

        <div>
          <label className="mb-1 block text-sm font-medium text-[#111111]">Gmail Address</label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="your@gmail.com"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#111111]">Password</label>
          <Input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            required
            disabled={loading}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-[#565959]">
        <p>Don't have an account? <Link to="/signup" className="font-semibold text-[#007185] hover:text-[#C45500]">Sign up</Link></p>
      </div>
    </div>
  )
}
