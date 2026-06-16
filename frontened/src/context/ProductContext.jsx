import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { fetchProducts } from '@/services/productService'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      setError(err.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      reloadProducts: loadProducts,
      getProductById: (id) => products.find((p) => p.id === id || String(p.backendId) === String(id)),
    }),
    [products, loading, error, loadProducts],
  )

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductContext)
  if (!ctx) throw new Error('useProducts must be used within ProductProvider')
  return ctx
}
