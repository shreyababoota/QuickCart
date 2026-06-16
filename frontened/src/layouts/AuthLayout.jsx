import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EAEDED] px-4 py-8">
      <Outlet />
    </div>
  )
}
