'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

export const CartContext = createContext()

const API = process.env.NEXT_PUBLIC_API_BASE_URL

export function CartProvider({ children }) {
  const { userToken } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)
  const [cartId, setCartId] = useState(null)

  const headers = { token: userToken }

  async function getCart() {
    if (!userToken) return
    try {
      const { data } = await axios.get(`${API}/api/v1/cart`, { headers })
      if (data.status === 'success') {
        setCartItems(data.data?.products || [])
        setCartCount(data.numOfCartItems || 0)
        setCartTotal(data.data?.totalCartPrice || 0)
        setCartId(data.data?._id || null)
      }
    } catch (err) { console.error(err) }
  }

  async function addToCart(productId) {
    if (!userToken) { toast.error('Please login first!'); return false }
    try {
      const { data } = await axios.post(`${API}/api/v1/cart`, { productId }, { headers })
      if (data.status === 'success') {
        setCartCount(data.numOfCartItems)
        await getCart()
        toast.success('Added to cart! 🛒')
        return true
      }
    } catch { toast.error('Failed to add to cart'); return false }
  }

  async function updateQuantity(productId, count) {
    try {
      const { data } = await axios.put(`${API}/api/v1/cart/${productId}`, { count }, { headers })
      if (data.status === 'success') {
        setCartItems(data.data.products)
        setCartTotal(data.data.totalCartPrice)
        setCartCount(data.numOfCartItems)
      }
    } catch { toast.error('Failed to update') }
  }

  async function removeFromCart(productId) {
    try {
      const { data } = await axios.delete(`${API}/api/v1/cart/${productId}`, { headers })
      if (data.status === 'success') {
        setCartItems(data.data.products)
        setCartTotal(data.data.totalCartPrice)
        setCartCount(data.numOfCartItems)
        toast.success('Removed from cart')
      }
    } catch { toast.error('Failed to remove') }
  }

  async function clearCart() {
    try {
      await axios.delete(`${API}/api/v1/cart`, { headers })
      setCartItems([]); setCartCount(0); setCartTotal(0); setCartId(null)
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    if (userToken) getCart()
    else { setCartItems([]); setCartCount(0); setCartTotal(0); setCartId(null) }
  }, [userToken])

  return (
    <CartContext.Provider value={{ cartItems, cartCount, cartTotal, cartId, getCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }
