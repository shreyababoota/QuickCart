import axiosInstance, { getErrorMessage } from './api'
import { normalizeProducts } from '@/lib/productMapper'

export async function fetchUserOrders() {
  try {
    const { data } = await axiosInstance.get('/api/orders/')
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load orders'))
  }
}

export async function checkoutOrder() {
  try {
    const { data } = await axiosInstance.post('/api/orders/checkout')
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Checkout failed'))
  }
}

export async function fetchAdminOrders() {
  try {
    const { data } = await axiosInstance.get('/api/admin/orders')
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load admin orders'))
  }
}
