'use client'
import Link from 'next/link'

const FOOTER_FEATURES = [
  { icon: 'fa-truck',      color: '#3b82f6', bg: '#eff6ff', title: 'Free Shipping',  sub: 'On orders over 500 EGP' },
  { icon: 'fa-undo',       color: '#0aad0a', bg: '#f0fdf4', title: 'Easy Returns',   sub: '14-day return policy' },
  { icon: 'fa-shield-alt', color: '#8b5cf6', bg: '#faf5ff', title: 'Secure Payment', sub: '100% secure checkout' },
  { icon: 'fa-headset',    color: '#f59e0b', bg: '#fffbeb', title: '24/7 Support',   sub: 'Contact us anytime' },
]

const COL_SHOP = [
  { href: '/products',   label: 'All Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/brands',     label: 'Brands' },
  { href: '/products',   label: 'Electronics' },
  { href: '/products',   label: "Men's Fashion" },
  { href: '/products',   label: "Women's Fashion" },
]
const COL_ACCOUNT = [
  { href: '/login',     label: 'My Account' },
  { href: '/allorders', label: 'Order History' },
  { href: '/wishlist',  label: 'Wishlist' },
  { href: '/cart',      label: 'Shopping Cart' },
  { href: '/login',     label: 'Sign In' },
  { href: '/register',  label: 'Create Account' },
]
const COL_SUPPORT = [
  { href: '#', label: 'Contact Us' },
  { href: '#', label: 'Help Center' },
  { href: '#', label: 'Shipping Info' },
  { href: '#', label: 'Returns & Refunds' },
  { href: '#', label: 'Track Order' },
]
const COL_LEGAL = [
  { href: '#', label: 'Privacy Policy' },
  { href: '#', label: 'Terms of Service' },
  { href: '#', label: 'Cookie Policy' },
]

const PAYMENT_ICONS = [
  { icon: 'fa-cc-visa',       label: 'Visa' },
  { icon: 'fa-cc-mastercard', label: 'Mastercard' },
  { icon: 'fa-cc-paypal',     label: 'PayPal' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer>
      {/* ── Features strip ── */}
      <div style={{ background: '#fff', borderTop: '1px solid #e9ecef', borderBottom: '1px solid #e9ecef' }}>
        <div className="container">
          <div className="row g-0">
            {FOOTER_FEATURES.map((f, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="fc-footer-feature">
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: f.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <i className={`fas ${f.icon}`} style={{ color: f.color, fontSize: '1.1rem' }} />
                  </div>
                  <div>
                    <h6>{f.title}</h6>
                    <p>{f.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main footer ── */}
      <div className="fc-footer">
        <div className="container">
          <div className="row g-5">

            {/* Brand + contact */}
            <div className="col-lg-3 col-md-6">
              {/* Logo box */}
              <div className="fc-footer-logo">
                <i className="fas fa-shopping-cart" />
                <span>FreshCart</span>
              </div>

              <p className="mb-4">
                FreshCart is your one-stop destination for quality products.
                From fashion to electronics, we bring you the best brands
                at competitive prices with a seamless shopping experience.
              </p>

              <div className="fc-footer-contact">
                <i className="fas fa-phone" />+1 (800) 123-4567
              </div>
              <div className="fc-footer-contact">
                <i className="fas fa-envelope" />support@freshcart.com
              </div>
              <div className="fc-footer-contact">
                <i className="fas fa-map-marker-alt" />123 Commerce Street, New York, NY 10001
              </div>

              <div className="fc-social-links">
                <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
                <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
                <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
                <a href="#" aria-label="YouTube"><i className="fab fa-youtube" /></a>
              </div>
            </div>

            {/* Shop */}
            <div className="col-lg-2 col-6">
              <h5>Shop</h5>
              <ul className="fc-footer-links">
                {COL_SHOP.map((l, i) => (
                  <li key={i}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Account */}
            <div className="col-lg-2 col-6">
              <h5>Account</h5>
              <ul className="fc-footer-links">
                {COL_ACCOUNT.map((l, i) => (
                  <li key={i}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="col-lg-2 col-6">
              <h5>Support</h5>
              <ul className="fc-footer-links">
                {COL_SUPPORT.map((l, i) => (
                  <li key={i}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="col-lg-2 col-6">
              <h5>Legal</h5>
              <ul className="fc-footer-links">
                {COL_LEGAL.map((l, i) => (
                  <li key={i}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="container">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 py-4">
              {/* Copyright */}
              <p style={{ margin: 0, color: '#8a9eb5', fontSize: '0.82rem' }}>
                © {year} <strong style={{ color: '#fff' }}>FreshCart</strong>. All rights reserved.
              </p>

              {/* Payment icons */}
              <div className="d-flex align-items-center gap-3">
                {PAYMENT_ICONS.map(p => (
                  <div key={p.label} title={p.label} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    color: '#8a9eb5', fontSize: '0.78rem',
                  }}>
                    <i className={`fab ${p.icon}`} style={{ fontSize: '1.6rem', color: '#8a9eb5' }} />
                    <span>{p.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
