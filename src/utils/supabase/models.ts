export interface Profile {
    user_id: string;
    username: string;
    name: string;
    profile_picture: string;
    location: string;
    is_expert: boolean;
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
    is_verified: boolean;
    verified_at: string;
}

export interface Species {
    species_id: string;
    scientific_name: string | null;
    common_name: string | null;
    habitat: string | null;
    conservation_status: string;
    behavior: string | null;
    image_url: string | null;
}

export interface SafetyProtocol {
    protocol_id: string;
    species_id: string;
    guidance: string | null;
    safety_level: string | null;
}

export interface Identification {
    identification_id: string;
    user_id: string;
    species_id: string;
    image_url: string | null;
    confidence_score: number | null;
    identified_at: string;
    species?: Species;
}

export interface ExpertValidation {
    validation_id: string;
    identification_id: string;
    expert_id: string;
    validation_status: string | null;
    validation_notes: string | null;
    validated_at: string;
}

export interface Community {
    community_id: string;
    created_by: string;
    community_name: string;
    created_at: string;
    member_count: number;
    active_members: number;
    location: string | null;
    banner_image: string | null;
    profile_picture: string | null;
    role?: 'moderator' | 'member'; // User's role in this community
}

export interface Post {
    post_id: string;
    user_id: string;
    community_id: string;
    identification_id: string;
    flair_id: string | null;
    title: string;
    content: string;
    media_url: string | null;
    location: string | null;
    latitude: number | null;
    longitude: number | null;
    created_at: string;
    updated_at: string;
    user_profiles?: Profile;
    communities?: Community;
    identifications?: Identification[];
    expert_validations?: ExpertValidation[];
    is_verified?: boolean;
}

export interface Comment {
    comment_id: string;
    user_id: string;
    post_id: string;
    parent_comment_id: string | null;
    content: string;
    created_at: string;
    updated_at: string;
    user_profiles?: Profile;
}

export interface Vote {
    vote_id: string;
    user_id: string;
    post_id: string | null;
    comment_id: string | null;
    vote_type: 'upvote' | 'downvote';
    created_at: string;
    updated_at: string;
}