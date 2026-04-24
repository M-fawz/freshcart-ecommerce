'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../lib/axiosInstance'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPass, setShowPass] = useState(false)

  const formik = useFormik({
    initialValues: { email: '', newPassword: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email required'),
      newPassword: Yup.string().min(6,'Min 6 chars').required('Password required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axiosInstance.put('/api/v1/auth/resetPassword', values)
        if (data.token) { login(data.token); toast.success('Password reset! 🎉'); router.push('/') }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Reset failed')
      } finally { setSubmitting(false) }
    }
  })

  return (
    <div className="fc-auth-wrap">
      <div className="fc-auth-card">
        <div className="text-center mb-4">
          <div style={{ width:68, height:68, borderRadius:'50%', background:'rgba(10,173,10,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
            <i className="fas fa-lock" style={{ fontSize:'1.9rem', color:'#0aad0a' }} />
          </div>
          <h4 style={{ fontWeight:700, color:'#253d4e' }}>Set New Password</h4>
          <p style={{ color:'#7d879c', fontSize:'0.88rem' }}>Create a strong password for your account.</p>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{fontWeight:600, fontSize:'0.88rem'}}>Email Address</label>
            <div className="position-relative">
              <i className="fas fa-envelope fc-input-icon" />
              <input type="email" className={`form-control ps-5 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                placeholder="your@email.com" style={{borderRadius:10}} {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email && <div className="invalid-feedback">{formik.errors.email}</div>}
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{fontWeight:600, fontSize:'0.88rem'}}>New Password</label>
            <div className="position-relative">
              <i className="fas fa-lock fc-input-icon" />
              <input type={showPass ? 'text' : 'password'}
                className={`form-control ps-5 pe-5 ${formik.touched.newPassword && formik.errors.newPassword ? 'is-invalid' : ''}`}
                placeholder="Min 6 characters" style={{borderRadius:10}} {...formik.getFieldProps('newPassword')} />
              <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} fc-eye`} onClick={() => setShowPass(!showPass)} />
              {formik.touched.newPassword && formik.errors.newPassword && <div className="invalid-feedback">{formik.errors.newPassword}</div>}
            </div>
          </div>
          <button type="submit" disabled={formik.isSubmitting} className="fc-submit-btn">
            {formik.isSubmitting ? <><i className="fas fa-spinner fa-spin me-2" />Resetting...</> : <><i className="fas fa-save me-2" />Reset Password</>}
          </button>
        </form>
      </div>
    </div>
  )
}
