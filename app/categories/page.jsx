'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import axiosInstance from '../lib/axiosInstance'

export default function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [subs, setSubs] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [loadingSub, setLoadingSub] = useState(false)

  useEffect(() => {
    axiosInstance.get('/api/v1/categories')
      .then(r => setCategories(r.data.data || []))
      .catch(err => {
        console.error(err)
        setError('Failed to load categories. Please check your connection and try again.')
      })
      .finally(() => setLoading(false))
  }, [])

  async function toggleCat(cat) {
    if (expanded === cat._id) { setExpanded(null); return }
    setExpanded(cat._id)
    if (!subs[cat._id]) {
      setLoadingSub(true)
      try {
        const { data } = await axiosInstance.get(`/api/v1/categories/${cat._id}/subcategories`)
        setSubs(prev => ({ ...prev, [cat._id]: data.data || [] }))
      } catch (err) { console.error(err) }
      finally { setLoadingSub(false) }
    }
  }

  return (
    <>
      <div className="fc-page-header">
        <div className="container">
          <h1><i className="fas fa-th-large me-3" style={{color:'#0aad0a'}} />All Categories</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mt-2 mb-0">
              <li className="breadcrumb-item"><Link href="/" style={{color:'#7d879c'}}>Home</Link></li>
              <li className="breadcrumb-item active">Categories</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container pb-5">
        {loading ? (
          <div className="fc-loader"><div className="fc-spinner" /></div>
        ) : error ? (
          <div className="fc-empty">
            <i className="fas fa-wifi" style={{ color: '#ef4444' }} />
            <h4 style={{ color: '#ef4444' }}>Connection Error</h4>
            <p>{error}</p>
            <button
              className="btn-green btn text-white px-4 py-2"
              onClick={() => { setError(null); setLoading(true); axiosInstance.get('/api/v1/categories').then(r => setCategories(r.data.data || [])).catch(e => setError(e.message)).finally(() => setLoading(false)) }}
            >
              <i className="fas fa-redo me-2" />Retry
            </button>
          </div>
        ) : (
          <>
            <div className="row g-3">
              {categories.map(cat => (
                <div className="col-6 col-md-4 col-lg-3" key={cat._id}>
                  <div className="fc-cat-card" onClick={() => toggleCat(cat)}
                    style={{ border: expanded===cat._id ? '2px solid #0aad0a' : '1px solid #e9ecef', background: expanded===cat._id ? 'rgba(10,173,10,0.03)' : '#fff' }}>
                    <img src={cat.image} alt={cat.name} onError={e => { e.target.src = `https://via.placeholder.com/200x150?text=${cat.name}` }} />
                    <div className="d-flex align-items-center justify-content-between mt-1">
                      <span>{cat.name}</span>
                      <i className={`fas fa-chevron-${expanded===cat._id?'up':'down'}`} style={{color:'#0aad0a', fontSize:'0.78rem'}} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subcategories */}
            {expanded && (
              <div className="mt-4 p-4" style={{ background:'#f8fdf8', borderRadius:14, border:'1px solid rgba(10,173,10,0.2)' }}>
                <h5 style={{ fontWeight:700, color:'#253d4e', marginBottom:16 }}>
                  <i className="fas fa-list me-2" style={{color:'#0aad0a'}} />
                  Subcategories of <span style={{color:'#0aad0a'}}>{categories.find(c=>c._id===expanded)?.name}</span>
                </h5>
                {loadingSub ? (
                  <div className="text-center"><div className="fc-spinner mx-auto" style={{width:28,height:28}} /></div>
                ) : subs[expanded]?.length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {subs[expanded].map(sub => (
                      <Link key={sub._id} href={`/products?subcategory=${sub._id}&name=${encodeURIComponent(sub.name)}`} className="text-decoration-none">
                        <span style={{ background:'#fff', border:'1.5px solid #0aad0a', color:'#0aad0a', padding:'5px 16px', borderRadius:20, fontWeight:600, fontSize:'0.86rem', display:'block', transition:'all 0.2s', cursor:'pointer' }}
                          onMouseEnter={e => { e.target.style.background='#0aad0a'; e.target.style.color='#fff' }}
                          onMouseLeave={e => { e.target.style.background='#fff'; e.target.style.color='#0aad0a' }}>
                          {sub.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : <p style={{color:'#7d879c', margin:0}}>No subcategories found.</p>}
              </div>
            )}

            {/* Banner */}
            <div className="mt-5 text-center p-4 rounded-4" style={{ background:'linear-gradient(135deg,#0aad0a,#088a08)', color:'#fff' }}>
              <h3 style={{ fontWeight:800, marginBottom:8 }}>{categories.length}+ Categories Available</h3>
              <p style={{ opacity:.9, marginBottom:20 }}>Explore thousands of products across all our categories</p>
              <Link href="/products" className="btn text-white fw-bold px-5 py-2"
                style={{ background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.45)', borderRadius:10 }}>
                <i className="fas fa-shopping-bag me-2" />Shop All Products
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}
