'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../lib/axiosInstance'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [apiErr, setApiErr] = useState('')

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiErr('')
      try {
        const { data } = await axiosInstance.post('/api/v1/auth/signin', values)
        if (data.message === 'success') {
          login(data.token)
          toast.success(`Welcome back, ${data.user.name}! 🎉`)
          router.push('/')
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Login failed. Try again.'
        setApiErr(msg); toast.error(msg)
      } finally { setSubmitting(false) }
    }
  })

  return (
    <div className="fc-auth-wrap">
      <div className="fc-auth-card">
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#0aad0a,#088a08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className="fas fa-shopping-basket text-white" style={{fontSize:18}} />
            </div>
            <h2 style={{ fontWeight:800, color:'#0aad0a', margin:0 }}>Fresh<span style={{color:'#253d4e'}}>Cart</span></h2>
          </div>
          <h4 style={{ fontWeight:700, color:'#253d4e' }}>Welcome Back! 👋</h4>
          <p style={{ color:'#7d879c', fontSize:'0.88rem' }}>Sign in to your account</p>
        </div>

        {apiErr && (
          <div className="alert alert-danger py-2 rounded-3 mb-3" style={{fontSize:'0.88rem'}}>
            <i className="fas fa-exclamation-circle me-2" />{apiErr}
          </div>
        )}

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-600" style={{fontWeight:600, fontSize:'0.88rem'}}>Email Address</label>
            <div className="position-relative">
              <i className="fas fa-envelope fc-input-icon" />
              <input type="email"
                className={`form-control ps-5 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                placeholder="you@example.com" style={{borderRadius:10}}
                {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email && <div className="invalid-feedback">{formik.errors.email}</div>}
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <label className="form-label" style={{fontWeight:600, fontSize:'0.88rem'}}>Password</label>
              <Link href="/forget-password" style={{color:'#0aad0a', fontSize:'0.82rem', fontWeight:600}}>Forgot password?</Link>
            </div>
            <div className="position-relative">
              <i className="fas fa-lock fc-input-icon" />
              <input type={showPass ? 'text' : 'password'}
                className={`form-control ps-5 pe-5 ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                placeholder="••••••••" style={{borderRadius:10}}
                {...formik.getFieldProps('password')} />
              <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} fc-eye`} onClick={() => setShowPass(!showPass)} />
              {formik.touched.password && formik.errors.password && <div className="invalid-feedback">{formik.errors.password}</div>}
            </div>
          </div>

          <button type="submit" disabled={formik.isSubmitting} className="fc-submit-btn">
            {formik.isSubmitting
              ? <><i className="fas fa-spinner fa-spin me-2" />Signing in...</>
              : <><i className="fas fa-sign-in-alt me-2" />Sign In</>}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{color:'#7d879c', fontSize:'0.88rem'}}>
          Don&apos;t have an account? <Link href="/register" style={{color:'#0aad0a', fontWeight:700}}>Create Account</Link>
        </p>
      </div>
    </div>
  )
}
