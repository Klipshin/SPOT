import { useSupabase } from "@/src/components/providers/SupabaseProvider";

export function useUser() {
  const { session, isLoaded } = useSupabase();
  return { user: session?.user ?? null, isLoaded };
}