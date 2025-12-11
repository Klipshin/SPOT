'use client';

import ProtectedRoute from '@/src/components/ProtectedRoute';

// Force dynamic rendering to prevent SSR/prerendering
export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}