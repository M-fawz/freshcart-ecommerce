'use client'
import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

export default function VerifyCodePage() {
  const router = useRouter()
  const inputs = useRef([])

  const formik = useFormik({
    initialValues: { resetCode: '' },
    validationSchema: Yup.object({ resetCode: Yup.string().length(6,'Code must be 6 digits').required() }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const { data } = await axios.put(`${API}/api/v1/auth/verifyResetCode`, values)
        if (data.status === 'Success') {
          toast.success('Code verified! Set your new password.')
          router.push('/reset-password')
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Invalid code')
      } finally { setSubmitting(false) }
    }
  })

  function handleInput(e, i) {
    const val = e.target.value.replace(/\D/g,'')
    e.target.value = val
    if (val && i < 5) inputs.current[i+1]?.focus()
    formik.setFieldValue('resetCode', inputs.current.map(el => el?.value||'').join(''))
  }

  function handleKeyDown(e, i) {
    if (e.key === 'Backspace' && !e.target.value && i > 0) inputs.current[i-1]?.focus()
  }

  return (
    <div className="fc-auth-wrap">
      <div className="fc-auth-card text-center">
        <div style={{ width:68, height:68, borderRadius:'50%', background:'rgba(10,173,10,0.1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <i className="fas fa-shield-alt" style={{ fontSize:'1.9rem', color:'#0aad0a' }} />
        </div>
        <h4 style={{ fontWeight:700, color:'#253d4e' }}>Enter Verification Code</h4>
        <p style={{ color:'#7d879c', fontSize:'0.88rem', marginBottom:28 }}>We sent a 6-digit code to your email.</p>

        <form onSubmit={formik.handleSubmit}>
          <div className="d-flex justify-content-center gap-2 mb-3">
            {[...Array(6)].map((_,i) => (
              <input key={i} ref={el => (inputs.current[i] = el)}
                type="text" maxLength={1}
                className="form-control text-center fw-bold"
                style={{ width:46, height:50, fontSize:'1.25rem', borderRadius:10, border:'2px solid #e9ecef', padding:0 }}
                onChange={e => handleInput(e,i)}
                onKeyDown={e => handleKeyDown(e,i)} />
            ))}
          </div>
          {formik.touched.resetCode && formik.errors.resetCode && (
            <p style={{color:'#e74c3c', fontSize:'0.82rem', marginBottom:12}}>{formik.errors.resetCode}</p>
          )}
          <button type="submit" disabled={formik.isSubmitting} className="fc-submit-btn">
            {formik.isSubmitting ? <><i className="fas fa-spinner fa-spin me-2" />Verifying...</> : <><i className="fas fa-check-circle me-2" />Verify Code</>}
          </button>
        </form>
      </div>
    </div>
  )
}
