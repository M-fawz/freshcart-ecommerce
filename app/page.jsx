'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import axiosInstance from './lib/axiosInstance'
import Slider from 'react-slick'
import ProductCard from './components/ProductCard'

/* ── Hero slides ── */
const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&q=80',
    tag: '🌿 Fresh & Organic',
    title: 'Fresh Products\nDelivered to your Door',
    sub: 'Get 20% off your first order',
  },
  {
    img: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1400&q=80',
    tag: '🚚 Fast Delivery',
    title: 'Same-Day Delivery\non All Fresh Items',
    sub: 'Order before 2 PM for same-day dispatch',
  },
  {
    img: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=1400&q=80',
    tag: '⭐ Premium Quality',
    title: 'Farm to Table\nHandpicked for You',
    sub: 'The freshest produce from local farms',
  },
]

const FEATURES = [
  { icon: 'fa-truck',   color: '#3b82f6', bg: '#eff6ff', title: 'Free Shipping',  sub: 'On orders over 500 EGP' },
  { icon: 'fa-undo',    color: '#0aad0a', bg: '#f0fdf4', title: 'Easy Returns',   sub: '14-day return policy' },
  { icon: 'fa-shield-alt', color: '#8b5cf6', bg: '#faf5ff', title: 'Secure Payment', sub: '100% secure checkout' },
  { icon: 'fa-headset', color: '#f59e0b', bg: '#fffbeb', title: '24/7 Support',   sub: 'Contact us anytime' },
]

const NL_CHIPS = [
  { icon: 'fa-leaf',       label: 'Fresh Picks Weekly' },
  { icon: 'fa-truck',      label: 'Free Delivery Codes' },
  { icon: 'fa-tag',        label: 'Members-Only Deals' },
]

export default function HomePage() {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loadingP,   setLoadingP]   = useState(true)
  const [loadingC,   setLoadingC]   = useState(true)
  const [nlEmail,    setNlEmail]    = useState('')

  useEffect(() => {
    axiosInstance.get('/api/v1/products?limit=16')
      .then(r => setProducts(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoadingP(false))

    axiosInstance.get('/api/v1/categories')
      .then(r => setCategories(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoadingC(false))
  }, [])

  const heroSettings = {
    dots: true, infinite: true, speed: 700,
    slidesToShow: 1, slidesToScroll: 1,
    autoplay: true, autoplaySpeed: 5000,
    arrows: true, pauseOnHover: false,
  }

  const catSettings = {
    dots: false, infinite: true, speed: 500, arrows: true,
    slidesToShow: 7, slidesToScroll: 2, autoplay: true, autoplaySpeed: 3500,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 6 } },
      { breakpoint: 992,  settings: { slidesToShow: 4 } },
      { breakpoint: 768,  settings: { slidesToShow: 3 } },
      { breakpoint: 480,  settings: { slidesToShow: 2, arrows: false } },
    ],
  }

  return (
    <>
      {/* ═══════════════ HERO SLIDER ═══════════════ */}
      <div className="fc-hero">
        <Slider {...heroSettings}>
          {SLIDES.map((s, i) => (
            <div key={i}>
              <div className="fc-hero-slide">
                <img src={s.img} alt={s.tag}
                  onError={e => { e.target.style.opacity = '0.3' }} />
                <div className="fc-hero-overlay">
                  <div className="fc-hero-content">
                    <div className="badge-tag">{s.tag}</div>
                    <h1 style={{ whiteSpace: 'pre-line' }}>{s.title}</h1>
                    <p>{s.sub}</p>
                    <div className="fc-hero-btns">
                      <Link href="/products" className="fc-hero-btn-solid">
                        Shop Now <i className="fas fa-arrow-right" />
                      </Link>
                      <Link href="/products" className="fc-hero-btn-outline">
                        View Deals
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* ═══════════════ FEATURES STRIP ═══════════════ */}
      <div className="fc-features-strip">
        <div className="container">
          <div className="row g-0">
            {FEATURES.map((f, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="fc-feature-card">
                  <div className="fc-feature-icon" style={{ background: f.bg }}>
                    <i className={`fas ${f.icon}`} style={{ color: f.color }} />
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

      {/* ═══════════════ CATEGORIES SLIDER ═══════════════ */}
      <section className="container py-5">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h2 className="fc-section-title">
            Popular <span>Categories</span>
          </h2>
          <Link href="/categories" className="btn-green-outline btn px-4 py-2" style={{ fontSize: '0.86rem', borderRadius: 50 }}>
            View All
          </Link>
        </div>

        {loadingC ? (
          <div className="text-center py-4"><div className="fc-spinner mx-auto" /></div>
        ) : (
          <Slider {...catSettings}>
            {categories.map(cat => (
              <div key={cat._id} className="px-2">
                <Link href="/categories">
                  <div className="fc-cat-card">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      onError={e => { e.target.src = `https://placehold.co/160x140/f0fdf4/0aad0a?text=${encodeURIComponent(cat.name)}` }}
                    />
                    <span>{cat.name}</span>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        )}
      </section>

      {/* ═══════════════ PROMO BANNERS ═══════════════ */}
      <section className="container pb-5">
        <div className="row g-4">
          {/* Green — Deal of the Day */}
          <div className="col-md-6">
            <div className="fc-promo-card" style={{ background: 'linear-gradient(135deg,#0aad0a 0%,#066b06 100%)' }}>
              {/* Decorative circle */}
              <div style={{ position:'absolute', right:-30, top:-30, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
              <div style={{ position:'absolute', right:30, bottom:-40, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
              <div>
                <div className="badge-tag">🔥 Deal of the Day</div>
                <h2>Fresh Organic<br />Fruits</h2>
                <p style={{ color:'rgba(255,255,255,0.85)', marginBottom:16, fontSize:'0.92rem' }}>
                  Get up to 40% off on selected organic fruits
                </p>
                <div className="discount">
                  <strong>40% OFF</strong>
                  <span>Use code: <b>ORGANIC40</b></span>
                </div>
              </div>
              <Link href="/products" className="fc-promo-btn">
                Shop Now <i className="fas fa-arrow-right" />
              </Link>
            </div>
          </div>

          {/* Orange/red — New Arrivals */}
          <div className="col-md-6">
            <div className="fc-promo-card" style={{ background: 'linear-gradient(135deg,#ff9800 0%,#e53935 100%)' }}>
              <div style={{ position:'absolute', right:-30, top:-30, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }} />
              <div style={{ position:'absolute', right:30, bottom:-40, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
              <div>
                <div className="badge-tag">✨ New Arrivals</div>
                <h2>Exotic<br />Vegetables</h2>
                <p style={{ color:'rgba(255,255,255,0.85)', marginBottom:16, fontSize:'0.92rem' }}>
                  Discover our latest collection of premium vegetables
                </p>
                <div className="discount">
                  <strong>25% OFF</strong>
                  <span>Use code: <b>FRESH25</b></span>
                </div>
              </div>
              <Link href="/products" className="fc-promo-btn orange">
                Explore Now <i className="fas fa-arrow-right" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
      <section className="container pb-5">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <h2 className="fc-section-title">
            Featured <span>Products</span>
          </h2>
          <Link href="/products" className="btn-green-outline btn px-4 py-2" style={{ fontSize: '0.86rem', borderRadius: 50 }}>
            View All <i className="fas fa-arrow-right ms-1" />
          </Link>
        </div>

        {loadingP ? (
          <div className="fc-loader"><div className="fc-spinner" /></div>
        ) : (
          <div className="row g-3">
            {products.map(p => (
              <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={p._id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-5">
          <Link href="/products" className="btn-green btn text-white px-5 py-2" style={{ fontSize: '0.95rem', borderRadius: 50 }}>
            <i className="fas fa-th me-2" />View All Products
          </Link>
        </div>
      </section>

      {/* ═══════════════ NEWSLETTER + APP ═══════════════ */}
      <section className="fc-newsletter-section">
        <div className="container">
          <div className="row g-4 align-items-stretch">

            {/* Newsletter */}
            <div className="col-lg-6">
              <div className="fc-newsletter-badge">
                <div className="icon"><i className="fas fa-envelope" /></div>
                <div>
                  <strong>NEWSLETTER</strong>
                  <p>50,000+ subscribers</p>
                </div>
              </div>
              <h2 style={{ fontSize:'1.9rem', fontWeight:800, color:'#253d4e', marginBottom:6 }}>
                Get the Freshest Updates
              </h2>
              <h2 style={{ fontSize:'1.9rem', fontWeight:800, color:'#0aad0a', marginBottom:14 }}>
                Delivered Free
              </h2>
              <p style={{ color:'#7d879c', marginBottom:0 }}>
                Weekly recipes, seasonal offers &amp; exclusive member perks.
              </p>
              <div className="fc-nl-chips">
                {NL_CHIPS.map((c, i) => (
                  <span key={i} className="fc-nl-chip">
                    <i className={`fas ${c.icon}`} />{c.label}
                  </span>
                ))}
              </div>
              <div className="fc-nl-form">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={nlEmail}
                  onChange={e => setNlEmail(e.target.value)}
                />
                <button type="button">
                  Subscribe <i className="fas fa-arrow-right" />
                </button>
              </div>
              <p className="fc-nl-note">🌿 Unsubscribe anytime. No spam, ever.</p>
            </div>

            {/* App card */}
            <div className="col-lg-6">
              <div className="fc-app-card">
                <div>
                  <div className="fc-app-tag">
                    <i className="fas fa-mobile-alt" /> MOBILE APP
                  </div>
                  <h3 style={{ marginTop: 14 }}>Shop Faster on Our App</h3>
                  <p style={{ marginTop: 8 }}>
                    Get app-exclusive deals &amp; 15% off your first order.
                  </p>
                </div>
                <div className="d-flex flex-column gap-3">
                  <button className="fc-store-btn">
                    <i className="fab fa-apple" />
                    <div>
                      <small>DOWNLOAD ON</small>
                      <strong>App Store</strong>
                    </div>
                  </button>
                  <button className="fc-store-btn">
                    <i className="fab fa-google-play" />
                    <div>
                      <small>GET IT ON</small>
                      <strong>Google Play</strong>
                    </div>
                  </button>
                </div>
                <div className="fc-app-rating">
                  <div className="stars">
                    {[...Array(5)].map((_,i) => <i key={i} className="fas fa-star" />)}
                  </div>
                  <span>4.9 · 100K+ downloads</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
