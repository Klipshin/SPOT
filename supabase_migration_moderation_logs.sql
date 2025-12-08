-- Create moderation_logs table to track moderator actions
CREATE TABLE IF NOT EXISTS moderation_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(community_id) ON DELETE CASCADE,
  moderator_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'delete_post', 'ban_user', 'remove_comment', etc.
  target_post_id UUID REFERENCES posts(post_id) ON DELETE SET NULL,
  target_user_id UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_moderation_logs_community ON moderation_logs(community_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_moderator ON moderation_logs(moderator_id);
CREATE INDEX IF NOT EXISTS idx_moderation_logs_created_at ON moderation_logs(created_at DESC);

-- Enable RLS
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Moderators can view logs for their communities"
  ON moderation_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = moderation_logs.community_id
      AND community_members.user_id = auth.uid()
      AND community_members.community_role = true
    )
  );

CREATE POLICY "Moderators can insert logs"
  ON moderation_logs FOR INSERT
  WITH CHECK (
    moderator_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM community_members
      WHERE community_members.community_id = moderation_logs.community_id
      AND community_members.user_id = auth.uid()
      AND community_members.community_role = true
    )
  );
