import { createClient } from "../utils/supabase/client";
import { Expert, Profile } from "../utils/supabase/models";

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

        if (error) throw error;

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
        
        if (error) throw error;

        return data;
    },
}