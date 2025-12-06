/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable ESLint checks during build for Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig