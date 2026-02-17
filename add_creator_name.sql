-- Add creator_name column to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS creator_name VARCHAR(255);

-- Update RLS policy to allow users to update their own campaigns (including creator_name)
-- (Existing policies might already cover this, but ensuring specific column access is good)
-- checking existing policy: "Users see own campaigns" usually covers SELECT/INSERT/UPDATE/DELETE if defined generally.
-- In `supabase_schema.sql` line 41: CREATE POLICY "Users see own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);
-- This covers ALL operations, so just adding the column is sufficient.
