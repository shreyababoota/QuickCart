import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Profile() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-2xl flex-1 px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-[#111111]">My Profile</h1>
      <div className="rounded-lg border border-[#DDDDDD] bg-white p-6 shadow-soft">
        <div className="mb-6">
          <div className="mb-4 text-6xl">{user.avatar}</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[#111111]">Name</label>
              <Input value={user.name} onChange={(e) => updateUser({ name: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111111]">Gmail Address</label>
              <Input type="email" value={user.email} onChange={(e) => updateUser({ email: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111111]">Phone</label>
              <Input value={user.phone || ''} onChange={(e) => updateUser({ phone: e.target.value })} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium text-[#111111]">Address</label>
              <Input value={user.address || ''} onChange={(e) => updateUser({ address: e.target.value })} className="mt-1" />
            </div>
          </div>
        </div>
        <Button onClick={() => { logout(); navigate('/'); }} variant="destructive">Logout</Button>
      </div>
    </div>
  )
}
