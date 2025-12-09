"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { createClient } from "@/src/utils/supabase/client";

type SupabaseContextType = {
  supabase: SupabaseClient | null;
  session: Session | null;
  isLoaded: boolean;
};

const SupabaseContext = createContext<SupabaseContextType>({
  supabase: null,
  session: null,
  isLoaded: false,
});

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize client on mount (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoaded(true);
      return;
    }

    const client = createClient();
    console.log('Supabase client created:', !!client);
    
    if (!client) {
      console.error('Failed to create Supabase client - check environment variables');
      setIsLoaded(true);
      return;
    }

    setSupabase(client);

    client.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      console.log('Session loaded:', !!data.session);
      setSession(data.session);
      setIsLoaded(true);
    });

    const { data: listener } = client.auth.onAuthStateChange((_event: any, session: Session | null) => {
      console.log('Auth state changed:', !!session);
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabase, session, isLoaded }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider");
  }
  return context;
};