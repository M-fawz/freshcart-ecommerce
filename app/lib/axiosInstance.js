import axios from 'axios'
import {
  MOCK_CATEGORIES, MOCK_SUBCATEGORIES, MOCK_PRODUCTS, MOCK_BRANDS
} from './mockData'

// All /api/v1/* requests go through Next.js rewrites → proxied server-side
// So we always use relative URLs (no baseURL needed in the browser)
const axiosInstance = axios.create({
  timeout: 20000,
})

// ── Mock data resolver ──────────────────────────────────────────────────────
function getMockResponse(url) {
  if (!url) return null

  // Subcategories: /api/v1/categories/:id/subcategories
  const subMatch = url.match(/\/api\/v1\/categories\/([^/]+)\/subcategories/)
  if (subMatch) {
    const subs = MOCK_SUBCATEGORIES[subMatch[1]] || []
    return { data: { data: subs, results: subs.length } }
  }

  // Single product: /api/v1/products/:id
  const prodMatch = url.match(/\/api\/v1\/products\/([^/?]+)/)
  if (prodMatch && !url.includes('?')) {
    const product = MOCK_PRODUCTS.find(p => p._id === prodMatch[1]) || MOCK_PRODUCTS[0]
    return { data: { data: product } }
  }

  // Categories list
  if (url.includes('/api/v1/categories')) {
    return { data: { data: MOCK_CATEGORIES, results: MOCK_CATEGORIES.length } }
  }

  // Brands list
  if (url.includes('/api/v1/brands')) {
    return { data: { data: MOCK_BRANDS, results: MOCK_BRANDS.length } }
  }

  // Products list
  if (url.includes('/api/v1/products')) {
    return {
      data: {
        data: MOCK_PRODUCTS.slice(0, 16),
        results: 16,
        metadata: { numberOfPages: 2, limit: 12, numberOfItems: MOCK_PRODUCTS.length },
      }
    }
  }

  return null
}

// ── Retry interceptor + mock fallback ────────────────────────────────────────
axiosInstance.interceptors.response.use(
  res => res,
  async error => {
    const config = error.config
    if (!config) return Promise.reject(error)

    config.__retryCount = config.__retryCount || 0
    const isNetworkErr = !error.response
    const isServerErr  = error.response?.status >= 500

    // Retry up to 2 times on network/server errors
    if ((isNetworkErr || isServerErr) && config.__retryCount < 2) {
      config.__retryCount++
      await new Promise(r => setTimeout(r, 800 * config.__retryCount))
      return axiosInstance(config)
    }

    // After all retries fail, serve mock data (GET only, browser only)
    if (typeof window !== 'undefined' && (!config.method || config.method === 'get')) {
      const mock = getMockResponse(config.url)
      if (mock) {
        console.warn('[MOCK FALLBACK]', config.url)
        return mock
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
