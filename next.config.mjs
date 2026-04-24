/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow static workers more time on slow machines / CI
  staticPageGenerationTimeout: 300,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ecommerce.routemisr.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Proxy all /api/v1/* requests to the real API server.
  // This runs server-side so it avoids browser CORS/timeout issues.
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://ecommerce.routemisr.com/api/v1/:path*',
      },
    ]
  },
}

export default nextConfig
