import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EAEDED] px-4">
      <div className="max-w-md rounded-lg border border-[#DDDDDD] bg-white p-10 text-center shadow-card">
        <h1 className="text-7xl font-bold text-[#111111]">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-[#111111]">Page not found</h2>
        <p className="mt-2 text-sm text-[#565959]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
