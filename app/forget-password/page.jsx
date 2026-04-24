'use client'
export const dynamic = 'force-dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axiosInstance from '../lib/axiosInstance'
import toast from 'react-hot-toast'

export default function ForgetPasswordPage() {
  const router = useRouter()

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({ email: Yup.string().email('Invalid email').required('Email required') }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axiosInstance.post('/api/v1/auth/forgotPasswords', values)
        if (data.statusMsg === 'success') {
          toast.success('Reset code sent to your email! 📧')
          router.push('/verify-code')
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Email not found')
      } finally { setSubmitting(false) }
    }
  })

  return (
    <div className="fc-auth-wrap">
      <div className="fc-auth-card text-center">
        <div style={{ width:68, height:68, borderRadius:'50%', background:'rgba(10,173,10,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <i className="fas fa-key" style={{ fontSize:'1.9rem', color:'#0aad0a' }} />
        </div>
        <h4 style={{ fontWeight:700, color:'#253d4e' }}>Forgot Password?</h4>
        <p style={{ color:'#7d879c', fontSize:'0.88rem', marginBottom:26 }}>Enter your email and we&apos;ll send you a reset code.</p>

        <form onSubmit={formik.handleSubmit} className="text-start">
          <div className="mb-3">
            <label className="form-label" style={{fontWeight:600, fontSize:'0.88rem'}}>Email Address</label>
            <div className="position-relative">
              <i className="fas fa-envelope fc-input-icon" />
              <input type="email"
                className={`form-control ps-5 ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                placeholder="you@example.com" style={{borderRadius:10}}
                {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email && <div className="invalid-feedback">{formik.errors.email}</div>}
            </div>
          </div>
          <button type="submit" disabled={formik.isSubmitting} className="fc-submit-btn">
            {formik.isSubmitting ? <><i className="fas fa-spinner fa-spin me-2" />Sending...</> : <><i className="fas fa-paper-plane me-2" />Send Reset Code</>}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{color:'#7d879c', fontSize:'0.88rem'}}>
          <Link href="/login" style={{color:'#0aad0a', fontWeight:700}}><i className="fas fa-arrow-left me-1" />Back to Login</Link>
        </p>
      </div>
    </div>
  )
}
