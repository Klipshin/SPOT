"use client";

import { Community } from "@/src/utils/supabase/models";
import { useEffect, useState } from "react";
import { useUser } from "./useUser";
import { communityService } from "../services";

export function useCommunities() {
    const { user } = useUser();
    const [userCommunities, setUserCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadUserCommunities();
        } else {
            setLoading(false);
        }
    }, [user]);

    async function loadUserCommunities() {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            
            // Use API route to bypass RLS
            const response = await fetch('/api/communities/user');
            
            if (!response.ok) {
                throw new Error('Failed to fetch communities');
            }
            
            const result = await response.json();
            setUserCommunities(result.communities || []);
        } catch (err) {
            console.error('Error loading communities:', err);
            setError(err instanceof Error ? err.message : "Failed to load communities.");
        } finally {
            setLoading(false);
        }
    }

    return { userCommunities, loading, error, refetch: loadUserCommunities };
}
