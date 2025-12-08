/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other configs (like reactStrictMode: true) ...

  // ADD THIS SECTION:
  transpilePackages: ['lucide-react'], // Replace with the actual package name if different
  
  // Moved from experimental in Next.js 16
  serverExternalPackages: ['@supabase/ssr', '@supabase/supabase-js'],
  
  // Webpack configuration to handle Supabase SSR
  webpack: (config: any, { isServer }: any) => {
    if (isServer) {
      // Provide mock implementations for browser-only APIs during SSR
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
