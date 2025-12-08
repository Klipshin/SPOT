'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import the dashboard with no SSR
const DashboardContent = dynamic(() => import('./DashboardContent').then(mod => {
  console.log('DashboardContent module loaded:', !!mod.default);
  return mod;
}), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  ),
});

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log('Dashboard page mounted');
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return <DashboardContent />;
}

// Prevent static generation
export const dynamicConfig = 'force-dynamic';
export const dynamicParams = false;
