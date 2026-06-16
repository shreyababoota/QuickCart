import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { loginUser, registerUser, logoutUser, getStoredUser, getStoredToken } from '@/services/authService'

const defaultUser = {
  id: null,
  name: 'Guest',
  email: '',
  avatar: '🧑',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultUser)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = getStoredUser()
    const token = getStoredToken()
    if (storedUser && token) {
      setUser({
        ...defaultUser,
        ...storedUser,
        avatar: storedUser.avatar || '🧑',
      })
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const updateUser = (patch) => {
    setUser((u) => {
      const next = { ...u, ...patch }
      localStorage.setItem('amazecart-user', JSON.stringify(next))
      return next
    })
  }

  const login = async (email, password) => {
    const result = await loginUser({ email, password })
    if (!result.success) {
      return { success: false, error: result.error }
    }
    const nextUser = {
      ...defaultUser,
      ...result.user,
      email: result.user?.email || email,
      name: result.user?.name || email.split('@')[0],
      avatar: '🧑',
    }
    setUser(nextUser)
    setIsAuthenticated(true)
    return { success: true }
  }

  const register = async (name, email, password) => {
    const result = await registerUser({ name, email, password })
    if (!result.success) {
      return { success: false, error: result.error }
    }
    return login(email, password)
  }

  const logout = useCallback(() => {
    logoutUser()
    setIsAuthenticated(false)
    setUser(defaultUser)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        theme: 'light',
        toggleTheme: () => {},
        updateUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
