import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../api/auth'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const STORAGE_KEY = 'fixr_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const persist = (userData) => {
    if (userData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
    setUser(userData)
  }

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email, password })
      persist(data)
      toast.success(`Welcome back, ${data.name}!`)
      return { success: true, role: data.role }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (formData) => {
    setLoading(true)
    try {
      const { data } = await authAPI.register(formData)
      persist(data)
      toast.success(`Account created! Welcome, ${data.name}!`)
      return { success: true, role: data.role }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    persist(null)
    toast.success('Logged out successfully')
  }, [])

  const updateProfile = useCallback(async (formData) => {
    setLoading(true)
    try {
      const { data } = await authAPI.updateProfile(formData)
      persist(data)
      toast.success('Profile updated!')
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed'
      toast.error(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
