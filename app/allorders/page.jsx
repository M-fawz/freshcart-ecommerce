'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import axiosInstance from '../lib/axiosInstance'
import ProtectedRoute from '../components/ProtectedRoute'
import { useAuth } from '../context/AuthContext'

function getUserId(token) {
  try { return JSON.parse(atob(token.split('.')[1])).id } catch { return null }
}

function OrdersContent() {
  const { userToken } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userToken) return
    const uid = getUserId(userToken)
    if (!uid) { setLoading(false); return }
    axiosInstance.get(`/api/v1/orders/user/${uid}`)
      .then(r => setOrders(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userToken])

  const fmt = d => d ? new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—'

  if (loading) return <div className="fc-loader"><div className="fc-spinner" /></div>

  return (
    <div className="container pb-5">
      {orders.length === 0 ? (
        <div className="fc-empty">
          <i className="fas fa-box-open" />
          <h4>No orders yet</h4>
          <p>Start shopping and your orders will appear here</p>
          <Link href="/products" className="btn-green btn text-white px-4 py-2" style={{borderRadius:10}}>
            <i className="fas fa-shopping-bag me-2" />Start Shopping
          </Link>
        </div>
      ) : (
        orders.map(order => (
          <div className="fc-order-card" key={order._id}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3 pb-3" style={{borderBottom:'1px solid #e9ecef'}}>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <div>
                  <p style={{fontWeight:700, color:'#253d4e', margin:0}}>
                    Order <span style={{color:'#0aad0a'}}>#{order._id?.slice(-8).toUpperCase()}</span>
                  </p>
                  <p style={{color:'#7d879c', margin:'2px 0 0', fontSize:'0.8rem'}}><i className="fas fa-calendar me-1" />{fmt(order.createdAt)}</p>
                </div>
                <span className={`status-badge ${order.isDelivered?'status-delivered':'status-pending'}`}>
                  <i className={`fas ${order.isDelivered?'fa-check-circle':'fa-clock'}`} />
                  {order.isDelivered ? 'Delivered' : 'Processing'}
                </span>
                {order.isPaid && <span className="status-badge status-delivered"><i className="fas fa-money-check-alt" />Paid</span>}
              </div>
              <div className="text-end">
                <p style={{fontWeight:800, color:'#0aad0a', fontSize:'1.05rem', margin:0}}>{order.totalOrderPrice} EGP</p>
                <p style={{color:'#7d879c', fontSize:'0.78rem', margin:0}}>{order.paymentMethodType==='cash'?'💵 Cash':'💳 Online'}</p>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {order.cartItems?.slice(0,5).map((item,i) => (
                <div key={i} className="d-flex align-items-center gap-2" style={{background:'#f8f9fa', borderRadius:8, padding:'5px 10px'}}>
                  <img src={item.product?.imageCover} alt="" style={{width:34, height:34, objectFit:'contain', borderRadius:6}}
                    onError={e => { e.target.src='https://via.placeholder.com/34' }} />
                  <div>
                    <p style={{fontSize:'0.76rem', fontWeight:600, color:'#253d4e', margin:0, maxWidth:110}} className="text-truncate">{item.product?.title}</p>
                    <p style={{fontSize:'0.72rem', color:'#7d879c', margin:0}}>x{item.count} · {item.price} EGP</p>
                  </div>
                </div>
              ))}
              {order.cartItems?.length > 5 && (
                <div style={{background:'#f8f9fa', borderRadius:8, padding:'5px 12px', display:'flex', alignItems:'center', color:'#7d879c', fontSize:'0.82rem', fontWeight:600}}>
                  +{order.cartItems.length-5} more
                </div>
              )}
            </div>

            {order.shippingAddress && (
              <p style={{color:'#7d879c', fontSize:'0.8rem', marginTop:10, marginBottom:0}}>
                <i className="fas fa-map-marker-alt me-1" style={{color:'#0aad0a'}} />
                {order.shippingAddress.details}, {order.shippingAddress.city} · 📞 {order.shippingAddress.phone}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default function AllOrdersPage() {
  return (
    <ProtectedRoute>
      <div className="fc-page-header">
        <div className="container">
          <h1><i className="fas fa-box me-3" style={{color:'#0aad0a'}} />My Orders</h1>
        </div>
      </div>
      <OrdersContent />
    </ProtectedRoute>
  )
}
