-- Migration: Add media_url column to comments table
-- This allows users to attach images to their comments

-- Add media_url column to comments table
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS media_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN comments.media_url IS 'URL of the media/image attached to the comment';
