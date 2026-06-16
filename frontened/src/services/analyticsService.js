import axiosInstance, { getErrorMessage } from './api'

export async function fetchStats() {
  try {
    const { data } = await axiosInstance.get('/api/stats/')
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load analytics'))
  }
}
