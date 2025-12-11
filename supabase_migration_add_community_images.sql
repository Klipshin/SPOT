-- Add banner_image and profile_picture columns to communities table
-- These columns store base64-encoded images or URLs for community branding

ALTER TABLE public.communities 
ADD COLUMN IF NOT EXISTS banner_image TEXT,
ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Add comment to document the columns
COMMENT ON COLUMN public.communities.banner_image IS 'Community banner image (base64 or URL)';
COMMENT ON COLUMN public.communities.profile_picture IS 'Community profile picture (base64 or URL)';
