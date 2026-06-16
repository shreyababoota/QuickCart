// import axiosInstance, { getErrorMessage } from './api'
// import { normalizeProduct } from '@/lib/productMapper'

// export async function addToCart({ goal_id, product_id }) {
//   try {
//     const { data } = await axiosInstance.post('/api/cart/add', { goal_id, product_id })
//     return data
//   } catch (error) {
//     throw new Error(getErrorMessage(error, 'Unable to add to cart'))
//   }
// }

// export async function fetchGroupedCart() {
//   try {
//     const { data } = await axiosInstance.get('/api/cart/grouped')
//     if (!Array.isArray(data)) return []
//     return data.map((group) => ({
//       ...group,
//       products: (group.products || []).map((p) => normalizeProduct(p)),
//     }))
//   } catch (error) {
//     throw new Error(getErrorMessage(error, 'Unable to load cart'))
//   }
// }

import axiosInstance, { getErrorMessage } from './api'
import { normalizeProduct } from '@/lib/productMapper'

export async function addToCart({ goal_id, product_id }) {
  const payload = {
    goal_id:
      goal_id == null || goal_id === 'general' || goal_id === 'null'
        ? null
        : Number(goal_id),
    product_id: product_id,
  }

  // Convert to number if it's numeric, otherwise send as string (Flask handles product_code)
  const numericId = Number(product_id)
  if (!Number.isNaN(numericId) && Number.isInteger(numericId) && numericId > 0) {
    payload.product_id = numericId
  }

  console.log('ADD TO CART PAYLOAD', payload)

  if (!payload.product_id) {
    const err = new Error('Invalid product_id: no product identifier provided')
    err.status = 400
    throw err
  }

  try {
    const { data } = await axiosInstance.post('/api/cart/add', payload)
    return data
  } catch (error) {
    const err = new Error(getErrorMessage(error, 'Unable to add to cart'))
    err.status = error?.status
    throw err
  }
}

export async function removeFromCartApi({
  goal_id,
  product_id,
}) {
  try {
    console.log("REMOVE REQUEST", {
      goal_id,
      product_id,
    })

    const { data } = await axiosInstance.post(
      '/api/cart/remove',
      {
        goal_id,
        product_id,
      }
    )

    return data
  } catch (error) {
    throw new Error(
      getErrorMessage(
        error,
        'Unable to remove item'
      )
    )
  }
}

export async function fetchGroupedCart() {
  try {
    const { data } = await axiosInstance.get(
      '/api/cart/grouped'
    )

    if (!Array.isArray(data)) return []

    return data.map((group) => ({
      ...group,
      products: (group.products || []).map((p) =>
        normalizeProduct(p)
      ),
    }))
  } catch (error) {
    throw new Error(
      getErrorMessage(error, 'Unable to load cart')
    )
  }
}