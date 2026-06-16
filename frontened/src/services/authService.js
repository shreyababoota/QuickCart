import axiosInstance, { getErrorMessage } from './api'

export async function registerUser({ name, email, password }) {
  try {
    const { data } = await axiosInstance.post('/api/auth/register', { name, email, password })
    return { success: true, data }
  } catch (error) {
    return { success: false, error: getErrorMessage(error, 'Registration failed') }
  }
}

export async function loginUser({ email, password }) {
  try {
    const { data } = await axiosInstance.post('/api/auth/login', { email, password })
    const token = data.access_token || data.token
    if (!token) {
      return { success: false, error: 'Invalid login response from server' }
    }
    localStorage.setItem('token', token)
    if (data.user) {
      localStorage.setItem('amazecart-user', JSON.stringify(data.user))
    }
    localStorage.setItem('amazecart-auth', 'true')
    return { success: true, token, user: data.user }
  } catch (error) {
    return { success: false, error: getErrorMessage(error, 'Invalid credentials') }
  }
}

export function logoutUser() {
  localStorage.removeItem('token')
  localStorage.removeItem('amazecart-user')
  localStorage.removeItem('amazecart-auth')
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('amazecart-user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getStoredToken() {
  return localStorage.getItem('token')
}
