/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other configs (like reactStrictMode: true) ...

  // ADD THIS SECTION:
  transpilePackages: ['lucide-react'], // Replace with the actual package name if different
  
  // Moved from experimental in Next.js 16
  serverExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],

  // Configure images to allow Supabase storage URLs
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
