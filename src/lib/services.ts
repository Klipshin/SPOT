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
        profile: Omit<Profile, "user_id" | "is_expert" | "created_at" | "is_suspended">,
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

export const adminService = {
    async getTotalUsers() {
        const { data, error } = await supabase
            .from("user_profiles")
            .select("*")

        if (error) throw new Error(error.message);
        return data;
    },

    async getActiveUsers() {
        const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("is_suspended", false);

        if (error) throw new Error(error.message);
        return data;
    },

    async getSuspendedUsers() {
        const { data, error } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("is_suspended", true);

        if (error) throw new Error(error.message);
        return data;
    },

    async getVerifiedExperts() {
        const { data, error } = await supabase
            .from("experts")
            .select("*")
            .eq("is_verified", true);

        if (error) throw new Error(error.message);
        return data;
    },

    async getPendingExperts() {
        const { data, error } = await supabase
            .from("experts")
            .select("*")
            .eq("is_verified", false);

        if (error) throw new Error(error.message);
        return data;
    },

    async approveExpert(expert_id: string) {
        const { data, error } = await supabase
            .from("experts")
            .update({ is_verified: "true", verified_at: new Date().toISOString() })
            .eq("expert_id", expert_id);

        if (error) throw new Error(error.message);
        return data;
    },

    async rejectExpert(expert_id: string) {
        const { data: expertData, error: fetchError } = await supabase
            .from("experts")
            .select("user_id")
            .eq("expert_id", expert_id)
            .single();

        if (fetchError) throw new Error(fetchError.message);
        const userId = expertData.user_id;

        const { error: deleteError } = await supabase
            .from("experts")
            .delete()
            .eq("expert_id", expert_id);

        if (deleteError) throw new Error(deleteError.message);

        const { error: updateError } = await supabase
            .from("user_profiles")
            .update({ is_expert: false })
            .eq("user_id", userId);

        if (updateError) throw new Error(updateError.message);

        return true;
    },

    async activateUser(user_id: string) {
        const { data, error } = await supabase
            .from("user_profiles")
            .update({ is_suspended: false })
            .eq("user_id", user_id);

        if (error) throw new Error(error.message);
        return data;
    },

    async suspendUser(user_id: string) {
        const { data, error } = await supabase
            .from("user_profiles")
            .update({ is_suspended: true })
            .eq("user_id", user_id);

        if (error) throw new Error(error.message);
        return data;
    },

    async getTotalReports() {
        const { data, error } = await supabase
            .from("reports")
            .select("*")

        if (error) throw new Error(error.message);
        return data;
    },

    async getUndismissedReports() {
        const { data, error } = await supabase
            .from("reports")
            .select("*")
            .eq("is_dismissed", false);

        if (error) throw new Error(error.message);
        return data;
    },

    async getPost(postId: string) {
        const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("post_id", postId);

        if (error) {
            throw new Error(error.message);
        }

        console.log("Post data returned:", data);
        return data;
    },

    async getComment(commentId: string) {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("comment_id", commentId);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    },

    async dismissReport(reportId: string) {
        const { data, error } = await supabase
            .from("reports")
            .update({ is_dismissed: true })
            .eq("id", reportId);

        if (error) throw new Error(error.message);
        return data;
    },

}