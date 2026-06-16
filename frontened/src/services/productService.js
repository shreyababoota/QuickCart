import axiosInstance, { getErrorMessage } from './api'
import { normalizeProduct, normalizeProducts } from '@/lib/productMapper'

export async function fetchProducts() {
  try {
    const { data } = await axiosInstance.get('/api/products/')
    return normalizeProducts(Array.isArray(data) ? data : [])
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load products'))
  }
}

export async function fetchProduct(productCode) {
  try {
    const { data } = await axiosInstance.get(`/api/products/${productCode}`)
    return normalizeProduct(data)
  } catch (error) {
    if (error.status === 404) return null
    throw new Error(getErrorMessage(error, 'Unable to load product'))
  }
}
