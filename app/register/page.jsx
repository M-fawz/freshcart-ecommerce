'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import toast from 'react-hot-toast'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

export default function RegisterPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [apiErr, setApiErr] = useState('')

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '', rePassword: '', phone: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(3,'Min 3 chars').max(30,'Max 30 chars').required('Name required'),
      email: Yup.string().email('Invalid email').required('Email required'),
      password: Yup.string().min(6,'Min 6 chars').required('Password required'),
      rePassword: Yup.string().oneOf([Yup.ref('password')],'Passwords must match').required('Required'),
      phone: Yup.string().matches(/^((\+20)|0)?1[0125]\d{8}$/,'Invalid Egyptian phone').required('Phone required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setApiErr('')
      try {
        const { data } = await axios.post(`${API}/api/v1/auth/signup`, values)
        if (data.message === 'success') {
          toast.success('Account created! Please login 🎉')
          router.push('/login')
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Registration failed.'
        setApiErr(msg); toast.error(msg)
      } finally { setSubmitting(false) }
    }
  })

  const fields = [
    { name:'name', label:'Full Name', icon:'fa-user', type:'text', placeholder:'John Doe' },
    { name:'email', label:'Email Address', icon:'fa-envelope', type:'email', placeholder:'you@example.com' },
    { name:'phone', label:'Phone Number', icon:'fa-phone', type:'tel', placeholder:'010xxxxxxxx' },
  ]

  return (
    <div className="fc-auth-wrap">
      <div className="fc-auth-card" style={{maxWidth:510}}>
        <div className="text-center mb-4">
          <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
            <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#0aad0a,#088a08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <i className="fas fa-shopping-basket text-white" style={{fontSize:18}} />
            </div>
            <h2 style={{ fontWeight:800, color:'#0aad0a', margin:0 }}>Fresh<span style={{color:'#253d4e'}}>Cart</span></h2>
          </div>
          <h4 style={{ fontWeight:700, color:'#253d4e' }}>Create Account 🚀</h4>
          <p style={{ color:'#7d879c', fontSize:'0.88rem' }}>Join thousands of happy shoppers</p>
        </div>

        {apiErr && <div className="alert alert-danger py-2 rounded-3 mb-3" style={{fontSize:'0.88rem'}}><i className="fas fa-exclamation-circle me-2" />{apiErr}</div>}

        <form onSubmit={formik.handleSubmit}>
          {fields.map(f => (
            <div className="mb-3" key={f.name}>
              <label className="form-label" style={{fontWeight:600, fontSize:'0.88rem'}}>{f.label}</label>
              <div className="position-relative">
                <i className={`fas ${f.icon} fc-input-icon`} />
                <input type={f.type}
                  className={`form-control ps-5 ${formik.touched[f.name] && formik.errors[f.name] ? 'is-invalid' : formik.touched[f.name] ? 'is-valid' : ''}`}
                  placeholder={f.placeholder} style={{borderRadius:10}}
                  {...formik.getFieldProps(f.name)} />
                {formik.touched[f.name] && formik.errors[f.name] && <div className="invalid-feedback">{formik.errors[f.name]}</div>}
              </div>
            </div>
          ))}

          {['password','rePassword'].map(field => (
            <div className="mb-3" key={field}>
              <label className="form-label" style={{fontWeight:600, fontSize:'0.88rem'}}>{field === 'password' ? 'Password' : 'Confirm Password'}</label>
              <div className="position-relative">
                <i className="fas fa-lock fc-input-icon" />
                <input type={showPass ? 'text' : 'password'}
                  className={`form-control ps-5 ${field==='password' ? 'pe-5' : ''} ${formik.touched[field] && formik.errors[field] ? 'is-invalid' : formik.touched[field] ? 'is-valid' : ''}`}
                  placeholder={field === 'password' ? 'Min 6 characters' : 'Re-enter password'}
                  style={{borderRadius:10}}
                  {...formik.getFieldProps(field)} />
                {field === 'password' && <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} fc-eye`} onClick={() => setShowPass(!showPass)} />}
                {formik.touched[field] && formik.errors[field] && <div className="invalid-feedback">{formik.errors[field]}</div>}
              </div>
            </div>
          ))}

          <button type="submit" disabled={formik.isSubmitting} className="fc-submit-btn">
            {formik.isSubmitting
              ? <><i className="fas fa-spinner fa-spin me-2" />Creating Account...</>
              : <><i className="fas fa-user-plus me-2" />Create Account</>}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{color:'#7d879c', fontSize:'0.88rem'}}>
          Already have an account? <Link href="/login" style={{color:'#0aad0a', fontWeight:700}}>Sign In</Link>
        </p>
      </div>
    </div>
  )
}
