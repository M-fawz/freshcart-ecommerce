'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import axiosInstance from '../lib/axiosInstance'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

export const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const { userToken } = useAuth()
  const [wishItems, setWishItems] = useState([])
  const [wishIds,   setWishIds]   = useState([])
  const [wishCount, setWishCount] = useState(0)

  const headers = { token: userToken }

  async function getWishlist() {
    if (!userToken) return
    try {
      const { data } = await axiosInstance.get('/api/v1/wishlist', { headers })
      if (data.status === 'success') {
        setWishItems(data.data || [])
        setWishIds((data.data || []).map(p => p._id))
        setWishCount(data.count || 0)
      }
    } catch (err) { console.error(err) }
  }

  async function toggleWishlist(product) {
    if (!userToken) { toast.error('Please login first!'); return }
    if (wishIds.includes(product._id)) {
      await removeFromWishlist(product._id)
    } else {
      try {
        const { data } = await axiosInstance.post('/api/v1/wishlist', { productId: product._id }, { headers })
        if (data.status === 'success') {
          await getWishlist()
          toast.success('Added to wishlist ❤️')
        }
      } catch { toast.error('Failed') }
    }
  }

  async function removeFromWishlist(productId) {
    try {
      const { data } = await axiosInstance.delete(`/api/v1/wishlist/${productId}`, { headers })
      if (data.status === 'success') {
        setWishItems(p => p.filter(x => x._id !== productId))
        setWishIds(p   => p.filter(x => x !== productId))
        setWishCount(p => Math.max(0, p - 1))
        toast.success('Removed from wishlist')
      }
    } catch { toast.error('Failed') }
  }

  useEffect(() => {
    if (userToken) getWishlist()
    else { setWishItems([]); setWishIds([]); setWishCount(0) }
  }, [userToken])

  return (
    <WishlistContext.Provider value={{ wishItems, wishIds, wishCount, toggleWishlist, removeFromWishlist, getWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() { return useContext(WishlistContext) }
