'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { userToken, mounted } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (mounted && !userToken) {
      router.replace('/login')
    }
  }, [mounted, userToken, router])

  if (!mounted) {
    return (
      <div className="fc-loader">
        <div className="fc-spinner" />
      </div>
    )
  }

  if (!userToken) return null
  return children
}
