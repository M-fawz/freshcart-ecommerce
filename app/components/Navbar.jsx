'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import toast from 'react-hot-toast'

const CAT_DROPDOWN = [
  { label: 'All Categories',  href: '/categories' },
  { label: 'Electronics',     href: '/categories' },
  { label: "Women's Fashion", href: '/categories' },
  { label: "Men's Fashion",   href: '/categories' },
  { label: 'Beauty & Health', href: '/categories' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const { userToken, logout } = useAuth()
  const { cartCount }         = useCart()
  const { wishCount }         = useWishlist()

  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handle(e) {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setCatOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function handleLogout() {
    logout()
    toast.success('Logged out successfully')
    router.push('/login')
  }

  return (
    <>
      {/* ══ TOP INFO BAR ══ */}
      <div className="fc-top-bar d-none d-md-block">
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <span className="fc-top-link"><i className="fas fa-truck" />Free Shipping on Orders 500 EGP</span>
            <span className="fc-top-link"><i className="fas fa-gift" />New Arrivals Daily</span>
          </div>
          <div className="d-flex align-items-center">
            <span className="fc-top-link"><i className="fas fa-phone" />+1 (800) 123-4567</span>
            <span className="fc-top-link"><i className="fas fa-envelope" />support@freshcart.com</span>
            {!userToken && (
              <>
                <Link href="/login"    className="fc-top-link" style={{ color:'#253d4e', fontWeight:600 }}>Sign In</Link>
                <Link href="/register" className="fc-top-link" style={{ color:'#253d4e', fontWeight:600 }}>Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══ MAIN NAVBAR ══ */}
      <nav className="navbar navbar-expand-lg fc-navbar">
        <div className="container gap-3">

          {/* Logo */}
          <Link href="/" className="fc-logo navbar-brand me-0">
            <i className="fas fa-shopping-cart fc-logo-icon" />
            <span className="fc-logo-text">Fresh<span>Cart</span></span>
          </Link>

          {/* Search */}
          <div className="fc-search-bar d-none d-lg-block">
            <input type="text" placeholder="Search for products, brands and more..." />
            <button className="fc-search-btn" aria-label="Search">
              <i className="fas fa-search" />
            </button>
          </div>

          {/* Mobile toggler */}
          <button
            className="navbar-toggler border-0 shadow-none ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#fcNav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Collapsible */}
          <div className="collapse navbar-collapse" id="fcNav">
            <ul className="navbar-nav mx-auto gap-1">

              {/* Home */}
              <li className="nav-item">
                <Link href="/" className={`nav-link fc-nav-link ${pathname === '/' ? 'active' : ''}`}>
                  Home
                </Link>
              </li>

              {/* Shop */}
              <li className="nav-item">
                <Link href="/products" className={`nav-link fc-nav-link ${pathname === '/products' ? 'active' : ''}`}>
                  Shop
                </Link>
              </li>

              {/* Categories — with dropdown */}
              <li className="nav-item" ref={catRef} style={{ position: 'relative' }}>
                <button
                  className={`nav-link fc-nav-link d-flex align-items-center gap-1 border-0 bg-transparent ${pathname === '/categories' ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setCatOpen(o => !o)}
                >
                  Categories
                  <i
                    className="fas fa-chevron-down"
                    style={{
                      fontSize: '0.62rem',
                      opacity: 0.7,
                      transition: 'transform 0.2s',
                      transform: catOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </button>

                {/* Dropdown menu */}
                {catOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0,
                    background: '#fff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.13)',
                    borderRadius: 10,
                    minWidth: 200,
                    zIndex: 2000,
                    border: '1px solid #e9ecef',
                    overflow: 'hidden',
                    animation: 'fadeInDown 0.15s ease',
                  }}>
                    {CAT_DROPDOWN.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setCatOpen(false)}
                        style={{
                          display: 'block',
                          padding: '11px 20px',
                          color: '#253d4e',
                          fontSize: '0.9rem',
                          fontWeight: 500,
                          borderBottom: i < CAT_DROPDOWN.length - 1 ? '1px solid #f4f4f4' : 'none',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#0aad0a'; e.currentTarget.style.paddingLeft = '26px' }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = '#253d4e'; e.currentTarget.style.paddingLeft = '20px' }}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>

              {/* Brands */}
              <li className="nav-item">
                <Link href="/brands" className={`nav-link fc-nav-link ${pathname === '/brands' ? 'active' : ''}`}>
                  Brands
                </Link>
              </li>
            </ul>

            {/* Right actions */}
            <div className="d-flex align-items-center gap-2">
              {/* Support */}
              <div className="fc-support d-none d-xl-flex">
                <i className="fas fa-headset" />
                <div className="fc-support-text">
                  <small>Support</small>
                  <span>24/7 Help</span>
                </div>
              </div>

              {/* Wishlist */}
              <Link href="/wishlist" className="fc-nav-icon" title="Wishlist">
                <i className="far fa-heart" />
                {wishCount > 0 && <span className="fc-badge red">{wishCount > 9 ? '9+' : wishCount}</span>}
              </Link>

              {/* Cart */}
              <Link href="/cart" className="fc-nav-icon" title="Cart">
                <i className="fas fa-shopping-cart" />
                {cartCount > 0 && <span className="fc-badge">{cartCount > 9 ? '9+' : cartCount}</span>}
              </Link>

              {/* Auth */}
              {userToken ? (
                <>
                  <Link href="/allorders" className="fc-nav-icon" title="My Orders">
                    <i className="fas fa-box" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="fc-signin-btn ms-1"
                    style={{ background: '#e74c3c' }}
                  >
                    <i className="fas fa-sign-out-alt" />Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="fc-signin-btn ms-1">
                  <i className="fas fa-user" />Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Dropdown animation */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}
