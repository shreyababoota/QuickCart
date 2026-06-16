import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:5000'

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong'

    if (status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('amazecart-user')
      localStorage.removeItem('amazecart-auth')
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject({ status, message, raw: error })
  },
)

export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (!error) return fallback
  if (typeof error === 'string') return error
  return error.message || fallback
}

export { fetchProducts as getProducts, fetchProduct as getProduct } from './productService'
export { fetchStats as getStats } from './analyticsService'
export { fetchUserOrders as getOrders, checkoutOrder as placeOrder } from './orderService'
export { fetchAdminCustomers as getCustomers } from './adminService'

export default axiosInstance
