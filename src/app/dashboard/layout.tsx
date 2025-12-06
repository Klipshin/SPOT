// app/dashboard/layout.tsx
import SupabaseProvider from '@/src/components/providers/SupabaseProvider';

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