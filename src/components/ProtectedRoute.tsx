'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/src/lib/hooks/useUser';

// Public paths that don't require authentication
const PUBLIC_PATHS = ['/', '/landing', '/auth', '/upload', '/error'];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait for auth state to load
    if (!isLoaded) return;

    // Check if current path is public
    const isPublicPath = PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );

    // If not a public path and no user, redirect to login
    if (!isPublicPath && !user) {
      console.log('ProtectedRoute: No user, redirecting to login from', pathname);
      const redirectUrl = `/auth/login?redirectedFrom=${encodeURIComponent(pathname)}`;
      router.push(redirectUrl);
    }
  }, [user, isLoaded, pathname, router]);

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mr-3"></div>
        Loading...
      </div>
    );
  }

  // Check if current path is public
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  // If not public and no user, show redirecting message
  if (!isPublicPath && !user) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl font-semibold">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mr-3"></div>
        Redirecting to login...
      </div>
    );
  }

  // Render children if user is authenticated or path is public
  return <>{children}</>;
}

