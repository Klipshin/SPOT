-- Create post_flairs junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS post_flairs (
  post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
  flair_id UUID NOT NULL REFERENCES flairs(flair_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, flair_id)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_post_flairs_post_id ON post_flairs(post_id);
CREATE INDEX IF NOT EXISTS idx_post_flairs_flair_id ON post_flairs(flair_id);

-- Enable RLS
ALTER TABLE post_flairs ENABLE ROW LEVEL SECURITY;

-- Create policies for post_flairs
CREATE POLICY "Users can view all post_flairs"
  ON post_flairs FOR SELECT
  USING (true);

CREATE POLICY "Users can insert post_flairs for their own posts"
  ON post_flairs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.post_id = post_flairs.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete post_flairs for their own posts"
  ON post_flairs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.post_id = post_flairs.post_id
      AND posts.user_id = auth.uid()
    )
  );

-- Remove flair_id column from posts table since we're using junction table
-- Note: Commented out to preserve existing data. Uncomment after migration if desired.
-- ALTER TABLE posts DROP COLUMN IF EXISTS flair_id;
