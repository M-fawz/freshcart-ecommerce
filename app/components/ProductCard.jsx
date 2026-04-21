'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function ProductCard({ product }) {
  const { addToCart }              = useCart()
  const { wishIds, toggleWishlist } = useWishlist()
  const [adding, setAdding]        = useState(false)

  const isWished = wishIds.includes(product._id)
  const stars    = Math.round(product.ratingsAverage || 0)

  async function handleAdd(e) {
    e.preventDefault(); e.stopPropagation()
    setAdding(true)
    await addToCart(product._id)
    setAdding(false)
  }
  function handleWish(e) {
    e.preventDefault(); e.stopPropagation()
    toggleWishlist(product)
  }

  return (
    <div className="fc-card">
      <Link href={`/products/${product._id}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'inherit' }}>

        {/* ── Image + right-side action icons ── */}
        <div className="fc-card-img">
          <img
            src={product.imageCover}
            alt={product.title}
            onError={e => { e.target.src = 'https://placehold.co/200x200/f8f9fa/aaa?text=No+Image' }}
          />

          {/* Right-side icons column (appear on hover) */}
          <div className="fc-card-actions">
            {/* Wishlist */}
            <button
              className={`fc-action-btn ${isWished ? 'wished' : ''}`}
              onClick={handleWish}
              title={isWished ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <i className={isWished ? 'fas fa-heart' : 'far fa-heart'} />
            </button>

            {/* Add to cart */}
            <button
              className="fc-action-btn"
              onClick={handleAdd}
              disabled={adding}
              title="Add to cart"
            >
              {adding
                ? <i className="fas fa-spinner fa-spin" style={{ fontSize: '0.75rem' }} />
                : <i className="fas fa-sync-alt" />}
            </button>

            {/* Quick view */}
            <Link
              href={`/products/${product._id}`}
              className="fc-action-btn"
              title="Quick view"
              onClick={e => e.stopPropagation()}
            >
              <i className="far fa-eye" />
            </Link>
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="fc-card-body">
          <div className="fc-cat-label">{product.category?.name || 'General'}</div>
          <p className="fc-card-title" title={product.title}>{product.title}</p>

          <div className="fc-stars">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={i < stars ? 'fas fa-star' : 'far fa-star'} />
            ))}
            <span>({product.ratingsQuantity || 0})</span>
          </div>

          <div className="fc-price-row">
            <span className="fc-price">
              {product.price} <small>EGP</small>
            </span>
            <button
              className="fc-add-btn"
              onClick={handleAdd}
              disabled={adding}
              title="Add to cart"
            >
              {adding
                ? <i className="fas fa-spinner fa-spin" />
                : <><i className="fas fa-plus" />Add</>}
            </button>
          </div>
        </div>
      </Link>
    </div>
  )
}
