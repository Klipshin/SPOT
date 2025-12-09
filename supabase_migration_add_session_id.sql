-- Add session_id column to chat_history table
-- This allows grouping messages into separate chat sessions

ALTER TABLE chat_history 
ADD COLUMN IF NOT EXISTS session_id TEXT;

-- Create an index for faster queries on session_id
CREATE INDEX IF NOT EXISTS idx_chat_history_session_id 
ON chat_history(session_id);

-- Update existing records to have session_id (group by user_id and created_at proximity)
-- This is a one-time migration for existing data
UPDATE chat_history 
SET session_id = id::text 
WHERE session_id IS NULL;
