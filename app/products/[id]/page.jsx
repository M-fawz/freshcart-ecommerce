'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '../../lib/axiosInstance'
import ProductCard from '../../components/ProductCard'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export default function ProductDetailsPage() {
  const { id }                          = useParams()
  const { addToCart }                   = useCart()
  const { wishIds, toggleWishlist }     = useWishlist()
  const [product,   setProduct]         = useState(null)
  const [related,   setRelated]         = useState([])
  const [loading,   setLoading]         = useState(true)
  const [activeImg, setActiveImg]       = useState(0)
  const [adding,    setAdding]          = useState(false)
  const [qty,       setQty]             = useState(1)

  useEffect(() => {
    if (!id) return
    setLoading(true); setActiveImg(0); window.scrollTo(0, 0)

    axiosInstance.get(`/api/v1/products/${id}`)
      .then(async ({ data }) => {
        const p = data.data
        setProduct(p)

        const catId = p?.category?._id
        if (catId) {
          const rel = await axiosInstance.get(`/api/v1/products?category[in][]=${catId}&limit=5`)
          setRelated((rel.data.data || []).filter(x => x._id !== id))
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  async function handleAdd() {
    if (!product) return
    setAdding(true)
    for (let i = 0; i < qty; i++) await addToCart(product._id)
    setAdding(false)
  }

  if (loading) return (
    <div className="fc-loader">
      <div className="fc-spinner" />
      <p style={{ color: '#7d879c', marginTop: 8 }}>Loading product…</p>
    </div>
  )

  if (!product) return (
    <div className="container py-5">
      <div className="fc-empty">
        <i className="fas fa-box-open" />
        <h4>Product not found</h4>
        <p>This product may have been removed.</p>
        <Link href="/products" className="btn-green btn text-white px-4 py-2">
          <i className="fas fa-arrow-left me-2" />Back to Products
        </Link>
      </div>
    </div>
  )

  const images  = product.images?.length ? product.images : [product.imageCover]
  const stars   = Math.round(product.ratingsAverage || 0)
  const isWished = wishIds.includes(product._id)
  const inStock  = (product.quantity ?? 1) > 0

  return (
    <>
      {/* ── Breadcrumb header ── */}
      <div className="fc-page-header">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/" style={{ color: '#7d879c' }}>Home</Link></li>
              <li className="breadcrumb-item"><Link href="/products" style={{ color: '#7d879c' }}>Products</Link></li>
              <li className="breadcrumb-item active" style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {product.title?.slice(0, 40)}{product.title?.length > 40 ? '…' : ''}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">

          {/* ── Left: Images ── */}
          <div className="col-lg-5">
            {/* Main image */}
            <div style={{
              background: '#f8f9fa', borderRadius: 16, padding: 24,
              textAlign: 'center', border: '1px solid #e9ecef', marginBottom: 12,
            }}>
              <img
                src={images[activeImg]}
                alt={product.title}
                style={{ maxHeight: 320, maxWidth: '100%', objectFit: 'contain' }}
                onError={e => { e.target.src = 'https://placehold.co/320/f8f9fa/7d879c?text=No+Image' }}
              />
            </div>

            {/* Thumbnail row */}
            {images.length > 1 && (
              <div className="d-flex gap-2 justify-content-center flex-wrap">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 58, height: 58, objectFit: 'contain',
                      borderRadius: 8, background: '#fff', padding: 4,
                      cursor: 'pointer',
                      border: `2px solid ${activeImg === i ? '#0aad0a' : '#e9ecef'}`,
                      transition: 'border-color 0.2s',
                    }}
                    onError={e => { e.target.src = 'https://placehold.co/58/f8f9fa/7d879c?text=…' }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Right: Info ── */}
          <div className="col-lg-7">
            {/* Category badge */}
            <span style={{
              background: 'rgba(10,173,10,0.1)', color: '#0aad0a',
              padding: '4px 14px', borderRadius: 20, fontSize: '0.77rem', fontWeight: 700,
            }}>
              {product.category?.name}
            </span>

            {/* Title */}
            <h1 style={{ fontWeight: 800, color: '#253d4e', margin: '12px 0 8px', fontSize: '1.55rem', lineHeight: 1.3 }}>
              {product.title}
            </h1>

            {/* Brand */}
            {product.brand && (
              <p style={{ color: '#7d879c', fontSize: '0.88rem', marginBottom: 10 }}>
                Brand: <strong style={{ color: '#253d4e' }}>{product.brand.name}</strong>
              </p>
            )}

            {/* Rating */}
            <div className="d-flex align-items-center gap-2 mb-4">
              <div style={{ color: '#f5a623', display: 'flex', gap: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={i < stars ? 'fas fa-star' : 'far fa-star'} style={{ fontSize: '0.9rem' }} />
                ))}
              </div>
              <span style={{ color: '#7d879c', fontSize: '0.86rem' }}>
                {product.ratingsAverage?.toFixed(1)} · {product.ratingsQuantity} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mb-4" style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0aad0a', lineHeight: 1 }}>
                {product.price}
              </span>
              <span style={{ fontWeight: 600, color: '#0aad0a', fontSize: '1rem' }}>EGP</span>
            </div>

            {/* Description */}
            <p style={{ color: '#7d879c', lineHeight: 1.8, fontSize: '0.91rem', marginBottom: 26 }}>
              {product.description}
            </p>

            {/* Stock + shipping badges */}
            <div className="d-flex gap-2 flex-wrap mb-4">
              <span style={{
                background: inStock ? 'rgba(10,173,10,0.1)' : 'rgba(231,76,60,0.1)',
                color: inStock ? '#0aad0a' : '#e74c3c',
                padding: '5px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700,
              }}>
                <i className={`fas ${inStock ? 'fa-check-circle' : 'fa-times-circle'} me-1`} />
                {inStock ? `In Stock (${product.quantity})` : 'Out of Stock'}
              </span>
              <span style={{ background: 'rgba(10,173,10,0.1)', color: '#0aad0a', padding: '5px 14px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700 }}>
                <i className="fas fa-truck me-1" />Free Shipping
              </span>
            </div>

            {/* Qty + Add to Cart */}
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>

              <button
                className="btn-green btn text-white fw-bold py-2"
                style={{ minWidth: 180, borderRadius: 10, fontSize: '0.95rem' }}
                onClick={handleAdd}
                disabled={adding || !inStock}
              >
                {adding
                  ? <><i className="fas fa-spinner fa-spin me-2" />Adding…</>
                  : <><i className="fas fa-shopping-cart me-2" />Add to Cart</>}
              </button>

              <button
                className="btn py-2 px-3"
                style={{
                  border: `2px solid ${isWished ? '#e74c3c' : '#e9ecef'}`,
                  borderRadius: 10,
                  color: isWished ? '#e74c3c' : '#7d879c',
                  background: isWished ? 'rgba(231,76,60,0.08)' : '#fff',
                  transition: 'all 0.2s',
                }}
                onClick={() => toggleWishlist(product)}
                title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <i className={`${isWished ? 'fas' : 'far'} fa-heart`} style={{ fontSize: '1.1rem' }} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="d-flex gap-3 flex-wrap mt-4 pt-3" style={{ borderTop: '1px solid #e9ecef' }}>
              {[
                { icon: 'fa-shield-alt', text: 'Secure checkout' },
                { icon: 'fa-undo',       text: '14-day return' },
                { icon: 'fa-headset',    text: '24/7 support' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: '#7d879c' }}>
                  <i className={`fas ${b.icon}`} style={{ color: '#0aad0a', fontSize: '0.9rem' }} />
                  {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-5 pt-4" style={{ borderTop: '1px solid #e9ecef' }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 className="fc-section-title">Related Products</h2>
              <Link href="/products" className="btn-green-outline btn px-3 py-2" style={{ fontSize: '0.85rem' }}>View All</Link>
            </div>
            <div className="row g-3">
              {related.slice(0, 4).map(p => (
                <div key={p._id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
