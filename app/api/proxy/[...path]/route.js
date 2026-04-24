import { NextResponse } from 'next/server'

const TARGET = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://ecommerce.routemisr.com'

async function handler(req, { params }) {
  const path    = (await params).path?.join('/') || ''
  const search  = new URL(req.url).search

  const targetUrl = `${TARGET}/api/v1/${path}${search}`

  // Forward all original headers except host
  const forwardHeaders = {}
  req.headers.forEach((value, key) => {
    if (!['host', 'connection'].includes(key)) {
      forwardHeaders[key] = value
    }
  })

  try {
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.text()

    const upstream = await fetch(targetUrl, {
      method:  req.method,
      headers: { 'Content-Type': 'application/json', ...forwardHeaders },
      body,
      signal: AbortSignal.timeout(15000),
    })

    const data = await upstream.json().catch(() => ({}))
    return NextResponse.json(data, { status: upstream.status })
  } catch (err) {
    console.error('[PROXY ERROR]', targetUrl, err.message)
    return NextResponse.json(
      { status: 'error', message: 'Upstream API unreachable', detail: err.message },
      { status: 503 }
    )
  }
}

export const GET    = handler
export const POST   = handler
export const PUT    = handler
export const DELETE = handler
export const PATCH  = handler
