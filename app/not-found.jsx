import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#f0fdf4,#dcfce7)' }}>
      <div className="text-center p-4">
        <div style={{ fontSize:'7rem', fontWeight:900, color:'#0aad0a', lineHeight:1 }}>404</div>
        <div style={{ fontSize:'3.5rem', margin:'8px 0' }}>🛒</div>
        <h2 style={{ fontWeight:800, color:'#253d4e', marginBottom:8 }}>Page Not Found</h2>
        <p style={{ color:'#7d879c', marginBottom:28, maxWidth:380 }}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link href="/" className="btn-green btn text-white fw-bold px-4 py-2" style={{borderRadius:10}}>
            <i className="fas fa-home me-2" />Back to Home
          </Link>
          <Link href="/products" className="btn-green-outline btn fw-bold px-4 py-2" style={{borderRadius:10}}>
            <i className="fas fa-shopping-bag me-2" />Shop Products
          </Link>
        </div>
      </div>
    </div>
  )
}
