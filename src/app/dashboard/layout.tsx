'use client';

import SupabaseProvider from '@/src/components/providers/SupabaseProvider';

// Force dynamic rendering to prevent SSR/prerendering
export const dynamic = 'force-dynamic';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SupabaseProvider>
      {children}
    </SupabaseProvider>
  );
}