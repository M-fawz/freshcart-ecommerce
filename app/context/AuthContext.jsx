'use client'
import { createContext, useContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [userToken, setUserToken] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('fc_token')
    if (token) setUserToken(token)
    setMounted(true)
  }, [])

  function login(token) {
    setUserToken(token)
    localStorage.setItem('fc_token', token)
  }

  function logout() {
    setUserToken(null)
    localStorage.removeItem('fc_token')
  }

  return (
    <AuthContext.Provider value={{ userToken, login, logout, mounted }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
