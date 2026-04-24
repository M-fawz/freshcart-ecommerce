'use client'
export const dynamic = 'force-dynamic'
import { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import axiosInstance from '../lib/axiosInstance'
import ProductCard from '../components/ProductCard'

const LIMIT = 12

// Wrap the page in Suspense because useSearchParams() requires it in Next.js 14
export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="fc-loader"><div className="fc-spinner" /><p style={{ color: '#7d879c' }}>Loading products…</p></div>}>
      <ProductsContent />
    </Suspense>
  )
}

function ProductsContent() {
  const searchParams   = useSearchParams()
  const urlSubcategory = searchParams.get('subcategory') || ''
  const urlName        = searchParams.get('name') || ''
  // ?cat=ID&catname=NAME — set by Navbar category dropdown
  const urlCat         = searchParams.get('cat') || ''
  const urlCatName     = searchParams.get('catname') || ''

  const [products,    setProducts]   = useState([])
  const [categories,  setCategories] = useState([])
  const [loading,     setLoading]    = useState(true)
  const [error,       setError]      = useState(null)
  const [search,      setSearch]     = useState('')
  const [selectedCat, setSelectedCat] = useState(urlCat)   // pre-fill from URL
  const [sort,        setSort]       = useState('-ratingsAverage')
  const [page,        setPage]       = useState(1)
  const [totalPages,  setTotalPages] = useState(1)
  const [total,       setTotal]      = useState(0)
  const [activeSub,   setActiveSub]  = useState({ id: urlSubcategory, name: urlName })

  /* Fetch categories once */
  useEffect(() => {
    axiosInstance.get('/api/v1/categories')
      .then(r => setCategories(r.data.data || []))
      .catch(console.error)
  }, [])

  /* Sync ?cat URL param (from Navbar dropdown) */
  useEffect(() => {
    if (urlCat) { setSelectedCat(urlCat); setPage(1) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCat])

  /* Sync URL subcategory param on mount */
  useEffect(() => {
    if (urlSubcategory) setActiveSub({ id: urlSubcategory, name: urlName })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSubcategory])

  /* Fetch products when page / cat / sort / activeSub change */
  useEffect(() => {
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCat, sort, activeSub.id])

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      let url = `/api/v1/products?limit=${LIMIT}&page=${page}&sort=${sort}`
      if (selectedCat)    url += `&category[in][]=${selectedCat}`
      if (activeSub.id)   url += `&subcategory[in][]=${activeSub.id}`
      const { data } = await axiosInstance.get(url)
      setProducts(data.data || [])
      setTotalPages(data.metadata?.numberOfPages || 1)
      setTotal(data.results || data.data?.length || 0)
    } catch (err) {
      console.error(err)
      setError('Could not load products. Check your connection or try again.')
    }
    finally { setLoading(false) }
  }

  const filtered = products.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  function changeCat(val) { setSelectedCat(val); setActiveSub({ id: '', name: '' }); setPage(1) }
  function changeSort(val) { setSort(val); setPage(1) }
  function clearAllFilters() { setSearch(''); setSelectedCat(''); setActiveSub({ id: '', name: '' }); setPage(1) }

  /* Page number buttons — show at most 7 pages */
  function pageNumbers() {
    const range = []
    const max   = Math.min(totalPages, 7)
    let start   = Math.max(1, page - 3)
    let end     = start + max - 1
    if (end > totalPages) { end = totalPages; start = Math.max(1, end - max + 1) }
    for (let i = start; i <= end; i++) range.push(i)
    return range
  }

  return (
    <>
      {/* ── Page header ── */}
      <div className="fc-page-header">
        <div className="container">
          <h1><i className="fas fa-th me-3" style={{ color: '#0aad0a' }} />All Products</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mt-2 mb-0">
              <li className="breadcrumb-item"><Link href="/" style={{ color: '#7d879c' }}>Home</Link></li>
              <li className="breadcrumb-item active">Products</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container pb-5">

        {/* ── Filter bar ── */}
        <div className="row g-3 mb-4 align-items-center">

          {/* Search */}
          <div className="col-12 col-md-4">
            <div className="fc-search">
              <i className="fas fa-search" />
              <input
                type="text"
                className="form-control"
                placeholder="Search products…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Category */}
          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={selectedCat}
              onChange={e => changeCat(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={sort}
              onChange={e => changeSort(e.target.value)}
            >
              <option value="-ratingsAverage">⭐ Top Rated</option>
              <option value="price">Price: Low → High</option>
              <option value="-price">Price: High → Low</option>
              <option value="-createdAt">Newest First</option>
            </select>
          </div>

          {/* Count */}
          <div className="col-12 col-md-2 text-muted" style={{ fontSize: '0.83rem' }}>
            <i className="fas fa-box me-1" style={{ color: '#0aad0a' }} />
            {filtered.length} products
          </div>
        </div>

        {/* ── Active filter chips ── */}
        {(selectedCat || activeSub.id) && (
          <div className="mb-3 d-flex flex-wrap gap-2 align-items-center">
            {activeSub.id && (
              <span
                style={{ background: 'rgba(10,173,10,0.1)', color: '#0aad0a', borderRadius: 20, fontWeight: 600, fontSize: '0.82rem', padding: '4px 14px', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <i className="fas fa-list" /> Sub: {activeSub.name}
                <button
                  onClick={() => setActiveSub({ id: '', name: '' })}
                  style={{ background: 'none', border: 'none', color: '#0aad0a', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                >×</button>
              </span>
            )}
            {selectedCat && (
              <button
                onClick={() => changeCat('')}
                className="btn btn-sm d-inline-flex align-items-center gap-2"
                style={{ background: 'rgba(10,173,10,0.1)', color: '#0aad0a', borderRadius: 20, fontWeight: 600, fontSize: '0.82rem' }}
              >
                <i className="fas fa-times-circle" />
                {categories.find(c => c._id === selectedCat)?.name || urlCatName}&nbsp;×
              </button>
            )}
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="fc-loader">
            <div className="fc-spinner" />
            <p style={{ color: '#7d879c' }}>Loading products…</p>
          </div>
        ) : error ? (
          <div className="fc-empty">
            <i className="fas fa-wifi" style={{ color: '#ef4444' }} />
            <h4 style={{ color: '#ef4444' }}>Connection Error</h4>
            <p>{error}</p>
            <button
              className="btn-green btn text-white px-4 py-2"
              onClick={fetchProducts}
            >
              <i className="fas fa-redo me-2" />Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="fc-empty">
            <i className="fas fa-search" />
            <h4>No products found</h4>
            <p>Try adjusting your search or filters</p>
            <button
              className="btn-green btn text-white px-4 py-2"
              onClick={clearAllFilters}
            >
              <i className="fas fa-undo me-2" />Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="row g-3">
              {filtered.map(p => (
                <div className="col-6 col-md-4 col-lg-3" key={p._id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <nav className="d-flex justify-content-center mt-5 gap-2 flex-wrap" aria-label="Products pagination">
                {/* Prev */}
                <button
                  className="btn"
                  style={{ border: '1.5px solid #e9ecef', borderRadius: 8, minWidth: 40, opacity: page === 1 ? 0.45 : 1 }}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <i className="fas fa-chevron-left" style={{ fontSize: '0.8rem' }} />
                </button>

                {pageNumbers().map(n => (
                  <button
                    key={n}
                    className="btn fw-bold"
                    style={{
                      minWidth: 40, borderRadius: 8,
                      background: page === n ? '#0aad0a' : '#fff',
                      color: page === n ? '#fff' : '#253d4e',
                      border: page === n ? 'none' : '1.5px solid #e9ecef',
                    }}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}

                {/* Next */}
                <button
                  className="btn"
                  style={{ border: '1.5px solid #e9ecef', borderRadius: 8, minWidth: 40, opacity: page === totalPages ? 0.45 : 1 }}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem' }} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </>
  )
}
