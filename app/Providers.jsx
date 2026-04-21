'use client'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: '10px', background: '#fff', color: '#253d4e', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }
            }}
          />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}
