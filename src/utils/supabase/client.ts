// Lazy import to avoid SSR issues
let clientInstance: any = null;

export function createClient() {
  // Only create browser client on the client side
  if (typeof window === 'undefined') {
    // Return a dummy client for SSR - it won't be used
    return null as any;
  }

  // Return existing instance if available (singleton pattern)
  if (clientInstance) {
    return clientInstance;
  }

  // Create client using @supabase/ssr's createBrowserClient
  // Import dynamically to avoid SSR issues
  try {
    const { createBrowserClient } = require('@supabase/ssr');
    
    clientInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    console.log('Supabase browser client created successfully');
    return clientInstance;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}