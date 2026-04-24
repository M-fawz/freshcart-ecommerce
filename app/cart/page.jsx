'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import ProtectedRoute from '../components/ProtectedRoute'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

function CartContent() {
  const { cartItems, cartTotal, cartCount, cartId, updateQuantity, removeFromCart, clearCart } = useCart()

  if (cartItems.length === 0) return (
    <div className="container pb-5">
      <div className="fc-empty">
        <i className="fas fa-shopping-cart" />
        <h4>Your cart is empty</h4>
        <p>Add some products to get started!</p>
        <Link href="/products" className="btn-green btn text-white px-4 py-2" style={{borderRadius:10}}>
          <i className="fas fa-shopping-bag me-2" />Continue Shopping
        </Link>
      </div>
    </div>
  )

  const shipping = cartTotal >= 500 ? 0 : 50

  return (
    <div className="container pb-5">
      <div className="row g-4">
        {/* Items */}
        <div className="col-lg-8">
          {cartItems.map(item => (
            <div className="fc-cart-item" key={item._id}>
              <div className="row align-items-center g-2">
                <div className="col-3 col-md-2">
                  <Link href={`/products/${item.product._id}`}>
                    <img src={item.product.imageCover} alt={item.product.title} className="fc-cart-img"
                      onError={e => { e.target.src='https://via.placeholder.com/86' }} />
                  </Link>
                </div>
                <div className="col-9 col-md-5">
                  <Link href={`/products/${item.product._id}`}>
                    <p style={{ fontWeight:600, color:'#253d4e', margin:'0 0 3px', fontSize:'0.92rem' }}>{item.product.title}</p>
                  </Link>
                  <p style={{ color:'#7d879c', margin:0, fontSize:'0.8rem' }}>{item.product.category?.name}</p>
                  <p style={{ color:'#0aad0a', fontWeight:800, margin:'4px 0 0', fontSize:'1rem' }}>{item.price} EGP</p>
                </div>
                <div className="col-7 col-md-3 d-flex justify-content-center">
                  <div className="qty-ctrl">
                    <button className="qty-btn" style={{color:item.count===1?'#e74c3c':'#0aad0a'}}
                      onClick={() => item.count===1 ? removeFromCart(item.product._id) : updateQuantity(item.product._id, item.count-1)}>
                      {item.count===1 ? <i className="fas fa-trash-alt" style={{fontSize:'0.76rem'}} /> : '−'}
                    </button>
                    <span className="qty-num">{item.count}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.product._id, item.count+1)}>+</button>
                  </div>
                </div>
                <div className="col-5 col-md-2 text-end">
                  <p style={{ fontWeight:700, color:'#253d4e', margin:'0 0 6px', fontSize:'0.97rem' }}>{(item.price * item.count).toFixed(2)} EGP</p>
                  <button onClick={() => removeFromCart(item.product._id)} style={{ background:'none', border:'none', color:'#e74c3c', cursor:'pointer', fontSize:'0.82rem' }}>
                    <i className="fas fa-times" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="d-flex align-items-center justify-content-between mt-2">
            <Link href="/products" style={{color:'#0aad0a', fontWeight:600, fontSize:'0.88rem', display:'inline-flex', alignItems:'center', gap:6}}>
              <i className="fas fa-arrow-left" />Continue Shopping
            </Link>
            <button className="btn btn-sm" style={{color:'#e74c3c', border:'1px solid #e74c3c', borderRadius:8, fontSize:'0.84rem'}}
              onClick={() => { if(confirm('Clear entire cart?')) clearCart() }}>
              <i className="fas fa-trash-alt me-1" />Clear Cart
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="col-lg-4">
          <div className="fc-summary">
            <h5 style={{ fontWeight:700, color:'#253d4e', marginBottom:18, paddingBottom:14, borderBottom:'1px solid #e9ecef' }}>Order Summary</h5>
            <div className="d-flex justify-content-between mb-2" style={{fontSize:'0.88rem'}}>
              <span style={{color:'#7d879c'}}>Subtotal ({cartCount} items)</span>
              <span style={{fontWeight:600}}>{cartTotal} EGP</span>
            </div>
            <div className="d-flex justify-content-between mb-2" style={{fontSize:'0.88rem'}}>
              <span style={{color:'#7d879c'}}>Shipping</span>
              <span style={{color:'#0aad0a', fontWeight:700}}>{shipping===0?'FREE':`${shipping} EGP`}</span>
            </div>
            {cartTotal < 500 && (
              <div className="mb-3 p-2 text-center rounded-3" style={{background:'rgba(10,173,10,0.07)', fontSize:'0.8rem', color:'#0aad0a'}}>
                <i className="fas fa-info-circle me-1" />Add <strong>{(500-cartTotal).toFixed(0)} EGP</strong> for free shipping!
              </div>
            )}
            <div className="d-flex justify-content-between py-3 mb-3" style={{borderTop:'1px solid #e9ecef', borderBottom:'1px solid #e9ecef'}}>
              <span style={{fontWeight:700}}>Total</span>
              <span style={{fontWeight:800, fontSize:'1.2rem', color:'#0aad0a'}}>{(cartTotal+shipping).toFixed(2)} EGP</span>
            </div>
            <div className="mb-3">
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Promo code" style={{borderRadius:'8px 0 0 8px', fontSize:'0.88rem'}} />
                <button className="btn text-white" style={{background:'#0aad0a', borderRadius:'0 8px 8px 0', fontWeight:700, fontSize:'0.88rem'}}>Apply</button>
              </div>
            </div>
            <Link href={`/checkout/${cartId}`} className="btn-green btn w-100 text-white fw-bold py-3" style={{borderRadius:10, fontSize:'0.97rem'}}>
              <i className="fas fa-lock me-2" />Proceed to Checkout
            </Link>
            <div className="text-center mt-3">
              <p style={{color:'#7d879c', fontSize:'0.76rem', marginBottom:6}}>We accept</p>
              <div className="d-flex justify-content-center gap-2">
                {['Visa','MC','PayPal','Cash'].map(p => <span key={p} style={{border:'1px solid #e9ecef', padding:'2px 8px', borderRadius:4, fontSize:'0.72rem', color:'#7d879c'}}>{p}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <div className="fc-page-header">
        <div className="container">
          <h1><i className="fas fa-shopping-cart me-3" style={{color:'#0aad0a'}} />My Cart</h1>
        </div>
      </div>
      <CartContent />
    </ProtectedRoute>
  )
}
