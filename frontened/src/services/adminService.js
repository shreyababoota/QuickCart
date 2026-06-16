import axiosInstance, { getErrorMessage } from './api'

export async function fetchAdminCustomers() {
  try {
    const { data } = await axiosInstance.get('/api/admin/customers')
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load customers'))
  }
}

export async function fetchAdminInventory() {
  try {
    const { data } = await axiosInstance.get('/api/admin/inventory')
    return Array.isArray(data) ? data : []
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load inventory'))
  }
}

export async function fetchAdminSustainability() {
  try {
    const { data } = await axiosInstance.get('/api/admin/sustainability')
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load sustainability data'))
  }
}

export async function fetchAdminAnalytics() {
  try {
    const { data } = await axiosInstance.get('/api/admin/analytics')
    return data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load analytics'))
  }
}
