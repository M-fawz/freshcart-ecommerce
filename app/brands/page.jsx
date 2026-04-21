'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

const API = process.env.NEXT_PUBLIC_API_BASE_URL

export default function BrandsPage() {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios.get(`${API}/api/v1/brands`)
      .then(r => setBrands(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <div className="fc-page-header">
        <div className="container">
          <h1><i className="fas fa-tags me-3" style={{color:'#0aad0a'}} />All Brands</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mt-2 mb-0">
              <li className="breadcrumb-item"><Link href="/" style={{color:'#7d879c'}}>Home</Link></li>
              <li className="breadcrumb-item active">Brands</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center mb-5">
          <div className="col-md-5">
            <div className="fc-search">
              <i className="fas fa-search" />
              <input type="text" placeholder="Search brands..." value={search} onChange={e => setSearch(e.target.value)} className="form-control" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="fc-loader"><div className="fc-spinner" /></div>
        ) : filtered.length === 0 ? (
          <div className="fc-empty"><i className="fas fa-search" /><h4>No brands found</h4></div>
        ) : (
          <>
            <div className="row g-3">
              {filtered.map(brand => (
                <div className="col-6 col-md-4 col-lg-3 col-xl-2" key={brand._id}>
                  <div className="fc-brand-card" onClick={() => setSelected(brand)}
                    style={{ border: selected?._id===brand._id ? '2px solid #0aad0a' : '1px solid #e9ecef' }}>
                    <img src={brand.image} alt={brand.name} onError={e => { e.target.src=`https://via.placeholder.com/120?text=${brand.name}` }} />
                    <p>{brand.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Brand Modal */}
            {selected && (
              <div className="modal fade show d-block" style={{ background:'rgba(0,0,0,0.5)', zIndex:1050 }} onClick={() => setSelected(null)}>
                <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
                  <div className="modal-content border-0 rounded-4 p-2">
                    <div className="modal-header border-0">
                      <h5 className="modal-title fw-bold">{selected.name}</h5>
                      <button className="btn-close" onClick={() => setSelected(null)} />
                    </div>
                    <div className="modal-body text-center py-4">
                      <img src={selected.image} alt={selected.name} style={{ maxHeight:140, maxWidth:'70%', objectFit:'contain', marginBottom:18 }} />
                      <h4 style={{ fontWeight:800, color:'#253d4e' }}>{selected.name}</h4>
                      <p style={{ color:'#7d879c', fontSize:'0.9rem' }}>Discover all products from <strong>{selected.name}</strong></p>
                    </div>
                    <div className="modal-footer border-0 pt-0">
                      <Link href="/products" className="btn-green btn w-100 text-white fw-bold py-2" style={{borderRadius:10}} onClick={() => setSelected(null)}>
                        <i className="fas fa-shopping-bag me-2" />Shop {selected.name} Products
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-5" style={{color:'#7d879c', fontSize:'0.88rem'}}>
              Showing <strong style={{color:'#0aad0a'}}>{filtered.length}</strong> of {brands.length} brands
            </div>
          </>
        )}
      </div>
    </>
  )
}
