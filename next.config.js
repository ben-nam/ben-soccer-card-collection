/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'i.ebayimg.com'],
  },
  // Disable static optimization for pages that use dynamic features
  output: 'standalone',
}

module.exports = nextConfig

