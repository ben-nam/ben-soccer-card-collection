/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'i.ebayimg.com'],
  },
  // Allow dynamic routes to skip static generation
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Skip static optimization for dynamic pages
  output: 'standalone',
}

module.exports = nextConfig

