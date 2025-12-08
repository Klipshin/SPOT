export interface Profile {
    user_id: string;
    username: string;
    name: string;
    profile_picture: string;
    location: string;
    is_expert: string;
    created_at: string;
    is_suspended: boolean;
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

export interface Post {
  post_id: string; 
  user_id: string;
  community_id: string; 
  identification_id: string; 
  flair_id?: string | null; 
  title: string;
  content: string;
  media_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  comment_id: string;
  user_id: string;
  post_id: string; 
  parent_comment_id?: string | null; 
  content: string;
  created_at: string; 
  updated_at: string;
}


export interface Report {
  id: string; 
  reporter_user_id: string; 
  reported_user_id: string; 
  content_id: string; 
  type: "post" | "comment";
  reported_at: string; 
  violation: string;
}