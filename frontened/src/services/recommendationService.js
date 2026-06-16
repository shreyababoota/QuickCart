import axiosInstance, { getErrorMessage } from './api'
import { normalizeProducts } from '@/lib/productMapper'

export async function fetchRecommendations({ user_id, goal }) {
  try {
    const { data } = await axiosInstance.post('/api/recommend/', { user_id, goal })
    return normalizeProducts(data.recommended_products || [])
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to fetch recommendations'))
  }
}

export async function fetchPersonalizedRecommendations(userId, limit = 10) {
  try {
    const { data } = await axiosInstance.post('/api/recommend/personalized', {
      user_id: userId,
      limit,
    })
    return normalizeProducts(data.recommended_products || [])
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to fetch personalized recommendations'))
  }
}

export async function fetchMissingItems(goalId) {
  try {
    const { data } = await axiosInstance.get(`/api/missing/${goalId}`)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load missing items'))
  }
}
