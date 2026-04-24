'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../../lib/axiosInstance'
import toast from 'react-hot-toast'
import ProtectedRoute from '../../components/ProtectedRoute'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

function CheckoutContent() {
  const { cartId } = useParams()
  const { userToken } = useAuth()
  const { cartTotal, cartCount, clearCart } = useCart()
  const router = useRouter()
  const [payType, setPayType] = useState('cash')

  const formik = useFormik({
    initialValues: { details: '', phone: '', city: '' },
    validationSchema: Yup.object({
      details: Yup.string().required('Address details required'),
      phone: Yup.string().matches(/^((\+20)|0)?1[0125]\d{8}$/, 'Invalid Egyptian phone').required('Phone required'),
      city: Yup.string().required('City required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      const shippingAddress = { details: values.details, phone: values.phone, city: values.city }
      try {
        if (payType === 'cash') {
          const { data } = await axiosInstance.post(`/api/v1/orders/${cartId}`, { shippingAddress }, { headers: { token: userToken } })
          if (data.status === 'success') {
            await clearCart()
            toast.success('Order placed! 🎉')
            router.push('/allorders')
          }
        } else {
          const { data } = await axiosInstance.post(`/api/v1/orders/checkout-session/${cartId}?url=${window.location.origin}`, { shippingAddress }, { headers: { token: userToken } })
          if (data.status === 'success') window.location.href = data.session.url
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Order failed. Try again.')
      } finally { setSubmitting(false) }
    }
  })

  const shipping = cartTotal >= 500 ? 0 : 50
  const total = cartTotal + shipping

  return (
    <div className="container pb-5">
      {/* Steps */}
      <div className="d-flex align-items-center justify-content-center gap-0 mb-5 flex-wrap">
        {[{n:1,l:'Cart',done:true},{n:2,l:'Address',done:false},{n:3,l:'Payment',done:false},{n:4,l:'Confirm',done:false}].map((s,i) => (
          <div key={i} className="d-flex align-items-center">
            <div className="text-center">
              <div style={{ width:34, height:34, borderRadius:'50%', margin:'0 auto 5px', background:s.done||s.n<=2?'#0aad0a':'#e9ecef', color:s.done||s.n<=2?'#fff':'#7d879c', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'0.88rem' }}>
                {s.done ? <i className="fas fa-check" /> : s.n}
              </div>
              <small style={{color:s.n<=2?'#0aad0a':'#7d879c', fontWeight:700, fontSize:'0.76rem'}}>{s.l}</small>
            </div>
            {i<3 && <div style={{width:55, height:2, background:s.n<2?'#0aad0a':'#e9ecef', margin:'0 4px 18px'}} />}
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          {/* Payment Method */}
          <div className="fc-checkout-card mb-4">
            <h5 style={{fontWeight:700, marginBottom:16, color:'#253d4e'}}><i className="fas fa-wallet me-2" style={{color:'#0aad0a'}} />Payment Method</h5>
            <div className="row g-3">
              {[
                {key:'cash', icon:'fa-money-bill-wave', title:'Cash on Delivery', sub:'Pay when you receive'},
                {key:'online', icon:'fa-credit-card', title:'Online Payment', sub:'Visa / Mastercard / Stripe'},
              ].map(p => (
                <div key={p.key} className="col-6">
                  <button className={`fc-pay-btn ${payType===p.key?'active':''}`} onClick={() => setPayType(p.key)}>
                    <i className={`fas ${p.icon}`} /><p style={{fontWeight:700, margin:'5px 0 2px', color:'#253d4e', fontSize:'0.9rem'}}>{p.title}</p>
                    <small style={{color:'#7d879c', fontSize:'0.78rem'}}>{p.sub}</small>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Address Form */}
          <div className="fc-checkout-card">
            <h5 style={{fontWeight:700, marginBottom:20, color:'#253d4e'}}><i className="fas fa-map-marker-alt me-2" style={{color:'#0aad0a'}} />Shipping Address</h5>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label className="form-label" style={{fontWeight:600, fontSize:'0.88rem'}}>City</label>
                <input type="text" className={`form-control ${formik.touched.city&&formik.errors.city?'is-invalid':''}`}
                  placeholder="e.g. Cairo, Alexandria…" style={{borderRadius:10}} {...formik.getFieldProps('city')} />
                {formik.touched.city && formik.errors.city && <div className="invalid-feedback">{formik.errors.city}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label" style={{fontWeight:600, fontSize:'0.88rem'}}>Phone Number</label>
                <div className="position-relative">
                  <i className="fas fa-phone fc-input-icon" />
                  <input type="tel" className={`form-control ps-5 ${formik.touched.phone&&formik.errors.phone?'is-invalid':''}`}
                    placeholder="010xxxxxxxx" style={{borderRadius:10}} {...formik.getFieldProps('phone')} />
                  {formik.touched.phone && formik.errors.phone && <div className="invalid-feedback">{formik.errors.phone}</div>}
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label" style={{fontWeight:600, fontSize:'0.88rem'}}>Address Details</label>
                <textarea className={`form-control ${formik.touched.details&&formik.errors.details?'is-invalid':''}`}
                  placeholder="Street name, building number, apartment…" rows={3} style={{borderRadius:10, resize:'none'}}
                  {...formik.getFieldProps('details')} />
                {formik.touched.details && formik.errors.details && <div className="invalid-feedback">{formik.errors.details}</div>}
              </div>
              <button type="submit" disabled={formik.isSubmitting} className="btn-green btn w-100 text-white fw-bold py-3" style={{borderRadius:10, fontSize:'0.97rem'}}>
                {formik.isSubmitting ? <><i className="fas fa-spinner fa-spin me-2" />Processing…</> :
                  payType==='cash' ? <><i className="fas fa-check-circle me-2" />Place Order (Cash)</> :
                  <><i className="fas fa-lock me-2" />Proceed to Payment</>}
              </button>
            </form>
          </div>
        </div>

        {/* Summary */}
        <div className="col-lg-5">
          <div className="fc-summary">
            <h5 style={{fontWeight:700, color:'#253d4e', marginBottom:18, paddingBottom:14, borderBottom:'1px solid #e9ecef'}}>Order Summary</h5>
            {[
              {label:`Items (${cartCount})`, val:`${cartTotal} EGP`},
              {label:'Shipping', val:shipping===0?'FREE':`${shipping} EGP`, green:shipping===0},
              {label:'Payment', val:payType==='cash'?'Cash on Delivery':'Online', green:true},
            ].map((row,i) => (
              <div key={i} className="d-flex justify-content-between mb-2" style={{fontSize:'0.88rem'}}>
                <span style={{color:'#7d879c'}}>{row.label}</span>
                <span style={{fontWeight:600, color:row.green?'#0aad0a':'#253d4e'}}>{row.val}</span>
              </div>
            ))}
            <div className="d-flex justify-content-between py-3 mt-2" style={{borderTop:'2px solid #e9ecef', borderBottom:'2px solid #e9ecef'}}>
              <span style={{fontWeight:700}}>Total</span>
              <span style={{fontWeight:800, fontSize:'1.25rem', color:'#0aad0a'}}>{total.toFixed(2)} EGP</span>
            </div>
            <div className="mt-4">
              {[{icon:'fa-shield-alt',text:'Secure & encrypted checkout'},{icon:'fa-undo',text:'14-day return policy'},{icon:'fa-headset',text:'24/7 customer support'}].map((g,i) => (
                <div key={i} className="d-flex align-items-center gap-2 mb-2" style={{fontSize:'0.83rem'}}>
                  <i className={`fas ${g.icon}`} style={{color:'#0aad0a', width:18}} />
                  <span style={{color:'#7d879c'}}>{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <div className="fc-page-header">
        <div className="container">
          <h1><i className="fas fa-credit-card me-3" style={{color:'#0aad0a'}} />Checkout</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mt-2 mb-0">
              <li className="breadcrumb-item"><Link href="/" style={{color:'#7d879c'}}>Home</Link></li>
              <li className="breadcrumb-item"><Link href="/cart" style={{color:'#7d879c'}}>Cart</Link></li>
              <li className="breadcrumb-item active">Checkout</li>
            </ol>
          </nav>
        </div>
      </div>
      <CheckoutContent />
    </ProtectedRoute>
  )
}
