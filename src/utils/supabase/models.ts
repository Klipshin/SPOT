export interface Profile {
    user_id: string;
    username: string;
    name: string;
    profile_picture: string;
    location: string;
    is_expert: string;
    created_at: string;
}

export interface Expert {
    expert_id: string;
    user_id: string;
    occupation: string;
    id_docu: string;
    employment_proof: string;
    diploma_docu: string;
	academic_profile: string | null;
    is_verified: string;
    verified_at: string;
}