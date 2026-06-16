import axiosInstance, { getErrorMessage } from './api'

export async function fetchProductReviewSummary(productCode, backendId) {
  try {
    if (backendId) {
      const { data } = await axiosInstance.get(`/api/reviews/product/${backendId}`)
      return data
    }
    const { data } = await axiosInstance.get(`/api/reviews/product/code/${productCode}`)
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load reviews'))
  }
}
