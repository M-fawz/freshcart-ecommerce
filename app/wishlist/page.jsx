'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import ProtectedRoute from '../components/ProtectedRoute'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

function WishlistContent() {
  const { wishItems, removeFromWishlist, wishCount } = useWishlist()
  const { addToCart } = useCart()

  async function moveToCart(product) {
    await addToCart(product._id)
    await removeFromWishlist(product._id)
  }

  if (wishItems.length === 0) return (
    <div className="container pb-5">
      <div className="fc-empty">
        <i className="fas fa-heart" style={{color:'#e74c3c'}} />
        <h4>Your wishlist is empty</h4>
        <p>Save products you love to buy them later</p>
        <Link href="/products" className="btn-green btn text-white px-4 py-2" style={{borderRadius:10}}>
          <i className="fas fa-shopping-bag me-2" />Discover Products
        </Link>
      </div>
    </div>
  )

  return (
    <div className="container pb-5">
      <div className="row g-3">
        {wishItems.map(product => (
          <div className="col-12 col-md-6 col-lg-4" key={product._id}>
            <div className="fc-wish-card">
              <div className="d-flex gap-3">
                <Link href={`/products/${product._id}`}>
                  <img src={product.imageCover} alt={product.title}
                    style={{ width:88, height:88, objectFit:'contain', background:'#f8f9fa', borderRadius:10, padding:6 }}
                    onError={e => { e.target.src='https://via.placeholder.com/88' }} />
                </Link>
                <div className="flex-grow-1">
                  <span style={{fontSize:'0.72rem', color:'#0aad0a', fontWeight:700}}>{product.category?.name}</span>
                  <Link href={`/products/${product._id}`}>
                    <p style={{ fontWeight:600, color:'#253d4e', margin:'3px 0', fontSize:'0.9rem', lineHeight:1.3 }}>
                      {product.title?.slice(0,55)}{product.title?.length>55?'…':''}
                    </p>
                  </Link>
                  <div style={{color:'#f5a623', fontSize:'0.74rem', marginBottom:5}}>
                    {[...Array(5)].map((_,i)=><i key={i} className={i<Math.round(product.ratingsAverage||0)?'fas fa-star':'far fa-star'} />)}
                  </div>
                  <p style={{color:'#0aad0a', fontWeight:800, fontSize:'1rem', margin:0}}>{product.price} EGP</p>
                </div>
              </div>
              <div className="d-flex gap-2 mt-3">
                <button onClick={() => moveToCart(product)} className="btn-green btn flex-grow-1 text-white fw-bold py-2" style={{borderRadius:8, fontSize:'0.84rem'}}>
                  <i className="fas fa-cart-plus me-1" />Move to Cart
                </button>
                <button onClick={() => removeFromWishlist(product._id)} className="btn py-2 px-3" style={{border:'1.5px solid #e74c3c', color:'#e74c3c', borderRadius:8}}>
                  <i className="fas fa-trash-alt" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-5">
        <Link href="/products" style={{color:'#0aad0a', fontWeight:600, fontSize:'0.9rem', display:'inline-flex', alignItems:'center', gap:6}}>
          <i className="fas fa-arrow-left" />Continue Shopping
        </Link>
      </div>
    </div>
  )
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <div className="fc-page-header">
        <div className="container">
          <h1><i className="fas fa-heart me-3" style={{color:'#e74c3c'}} />My Wishlist</h1>
        </div>
      </div>
      <WishlistContent />
    </ProtectedRoute>
  )
}
