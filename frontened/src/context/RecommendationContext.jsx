import { createContext, useContext, useState, useCallback } from 'react'
import { fetchRecommendations } from '@/services/recommendationService'
import { useAuth } from '@/context/AuthContext'

const RecommendationContext = createContext(null)

export function RecommendationProvider({ children }) {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const getRecommendations = useCallback(
    async (goal) => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchRecommendations({
          user_id: user?.id,
          goal,
        })
        setRecommendations(data)
        return data
      } catch (err) {
        setError(err.message)
        setRecommendations([])
        return []
      } finally {
        setLoading(false)
      }
    },
    [user?.id],
  )

  return (
    <RecommendationContext.Provider
      value={{
        recommendations,
        loading,
        error,
        getRecommendations,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  )
}

export function useRecommendations() {
  const ctx = useContext(RecommendationContext)
  if (!ctx) throw new Error('useRecommendations must be used within RecommendationProvider')
  return ctx
}
