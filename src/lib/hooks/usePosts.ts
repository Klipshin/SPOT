"use client";

import { Post } from "@/src/utils/supabase/models";
import { useEffect, useState } from "react";
import { postService, voteService } from "../services";
import { useUser } from "./useUser";

export function usePosts(communityId?: string) {
    const { user } = useUser();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPosts();
    }, [communityId]);

    async function loadPosts() {
        try {
            setLoading(true);
            setError(null);
            const data = communityId 
                ? await postService.getPostsByCommunity(communityId)
                : await postService.getPosts();
            setPosts(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load posts.");
        } finally {
            setLoading(false);
        }
    }

    async function voteOnPost(postId: string, voteType: 'upvote' | 'downvote') {
        if (!user) return;

        try {
            // Get current user vote
            const currentVote = await voteService.getUserVote(user.id, postId);

            if (currentVote === voteType) {
                // Remove vote if clicking same button
                await voteService.removeVote(user.id, postId);
            } else {
                // Cast new vote (upvote or downvote)
                await voteService.castVote(user.id, postId, voteType);
            }

            // Reload posts to get updated vote counts
            await loadPosts();
        } catch (err) {
            console.error('Vote error:', err);
        }
    }

    return { posts, loading, error, refetch: loadPosts, voteOnPost };
}
