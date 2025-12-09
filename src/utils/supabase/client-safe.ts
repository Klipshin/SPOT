// Safe wrapper around Supabase client that prevents SSR errors
import type { SupabaseClient } from '@supabase/supabase-js';

let clientInstance: SupabaseClient | null = null;

export function createClient(): SupabaseClient | null {
  // Always return null on server
  if (typeof window === 'undefined') {
    return null;
  }

  // Return existing instance if available
  if (clientInstance) {
    return clientInstance;
  }

  // Dynamically import and create client only on client side
  try {
    const { createBrowserClient } = require('@supabase/ssr');
    clientInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    return clientInstance;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}
