import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'
import AssistantApp from '@/components/ai-assistant/AssistantApp'
import { useEffect } from 'react'

export default function Assistant() {
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to use the AI Shopping Assistant')
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-[#565959]">Please login to use the AI Shopping Assistant.</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-[#EAEDED]">
      <AssistantApp />
    </div>
  )
}
