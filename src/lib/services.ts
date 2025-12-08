import { createClient } from "../utils/supabase/client";
import { Expert, Profile, Community, Post, Comment, Vote } from "../utils/supabase/models";

const supabase = createClient();

export const profileService = {
    async getUserProfile(userId: string): Promise<Profile> {
        const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        return data;
    },

    async createUserProfile (
        profile: Omit<Profile, "user_id" | "is_expert" | "created_at">,
        userId: string,
    ) : Promise<Profile> {
        const { data, error } = await supabase
            .from("user_profiles")
            .upsert([{ ...profile, user_id: userId }], { onConflict: "user_id" })
            .select()
            .single();
        
        if (error) throw error;

        return data;
    },
}

export const expertService = {
    async getExpert(userId: string): Promise<Expert> {
        const { data, error } = await supabase
            .from("experts")
            .select("*")
            .eq("user_id", userId)
            .single();

		if (error) throw new Error(error.message);

        return data;
    },

    async createExpert (
        expert: Omit<Expert, "expert_id" | "is_verified" | "verified_at">
    ) : Promise<Expert> {

        const { data, error } = await supabase
            .from("experts")
            .insert(expert)
            .select()
            .single();
        
		if (error) throw new Error(error.message);

        return data;
    },
}

export const communityService = {
    async getUserCommunities(userId: string): Promise<Community[]> {
        const { data, error } = await supabase
            .from("community_members")
            .select(`
                communities (
                    community_id,
                    created_by,
                    community_name,
                    created_at,
                    member_count,
                    active_members,
                    location
                )
            `)
            .eq("user_id", userId);

        if (error) throw error;

        // Extract communities from the nested structure
        return data?.map((item: any) => item.communities).filter(Boolean) || [];
    },

    async getAllCommunities(): Promise<Community[]> {
        const { data, error } = await supabase
            .from("communities")
            .select("*")
            .order("member_count", { ascending: false })
            .limit(10);

        if (error) throw error;

        return data || [];
    },

    async createCommunity(communityData: {
        community_name: string;
        location?: string;
        created_by: string;
    }): Promise<Community> {
        // Create the community
        const { data: community, error: communityError } = await supabase
            .from("communities")
            .insert([{
                community_name: communityData.community_name,
                location: communityData.location || null,
                created_by: communityData.created_by,
                member_count: 1,
                active_members: 1
            }])
            .select()
            .single();

        if (communityError) {
            console.error('Error creating community:', communityError);
            throw new Error(communityError.message || 'Failed to create community');
        }

        // Add creator as a member
        const { error: memberError } = await supabase
            .from("community_members")
            .insert([{
                user_id: communityData.created_by,
                community_id: community.community_id,
                community_role: true, // true = admin/moderator
                is_active: true
            }]);

        if (memberError) {
            console.error('Error adding member:', memberError);
            // Try to rollback - delete the community if member insertion fails
            await supabase.from("communities").delete().eq("community_id", community.community_id);
            throw new Error(memberError.message || 'Failed to add user to community');
        }

        return community;
    },
}

export const postService = {
    async getPosts(limit: number = 20): Promise<Post[]> {
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                user_profiles!posts_user_id_fkey (
                    user_id,
                    username,
                    name,
                    profile_picture
                ),
                communities!posts_community_id_fkey (
                    community_id,
                    community_name
                )
            `)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;

        return data || [];
    },

    async getPostsByUser(userId: string): Promise<Post[]> {
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                user_profiles!posts_user_id_fkey (
                    user_id,
                    username,
                    name,
                    profile_picture
                ),
                communities!posts_community_id_fkey (
                    community_id,
                    community_name
                )
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data || [];
    },

    async getPostsByCommunity(communityId: string, limit: number = 20): Promise<Post[]> {
        const { data, error } = await supabase
            .from("posts")
            .select(`
                *,
                user_profiles!posts_user_id_fkey (
                    user_id,
                    username,
                    name,
                    profile_picture
                ),
                communities!posts_community_id_fkey (
                    community_id,
                    community_name
                )
            `)
            .eq("community_id", communityId)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;

        return data || [];
    },
}

export const voteService = {
    async getPostVotes(postId: string) {
        const { data, error } = await supabase
            .from("votes")
            .select("vote_type")
            .eq("post_id", postId);

        if (error) throw error;

        const upvotes = data?.filter(v => v.vote_type === 'upvote').length || 0;
        const downvotes = data?.filter(v => v.vote_type === 'downvote').length || 0;

        return { upvotes, downvotes };
    },

    async getUserVote(userId: string, postId: string): Promise<'upvote' | 'downvote' | null> {
        const { data, error } = await supabase
            .from("votes")
            .select("vote_type")
            .eq("user_id", userId)
            .eq("post_id", postId)
            .maybeSingle();

        if (error) throw error;

        return data?.vote_type as 'upvote' | 'downvote' | null;
    },

    async castVote(userId: string, postId: string, voteType: 'upvote' | 'downvote') {
        const { data, error } = await supabase
            .from("votes")
            .upsert({
                user_id: userId,
                post_id: postId,
                vote_type: voteType,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,post_id'
            })
            .select()
            .single();

        if (error) throw error;

        return data;
    },

    async removeVote(userId: string, postId: string) {
        const { error } = await supabase
            .from("votes")
            .delete()
            .eq("user_id", userId)
            .eq("post_id", postId);

        if (error) throw error;
    },
}