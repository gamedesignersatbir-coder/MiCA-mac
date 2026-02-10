-- Run this in your Supabase SQL Editor to apply Session 4 changes
-- Safe to re-run (idempotent)

-- 1. execution_schedule table
CREATE TABLE IF NOT EXISTS execution_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  channel VARCHAR(50) NOT NULL,
  asset_type VARCHAR(50) NOT NULL,
  asset_id UUID NOT NULL,
  scheduled_day INTEGER NOT NULL,
  scheduled_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled',
  recipients_total INTEGER DEFAULT 0,
  recipients_sent INTEGER DEFAULT 0,
  recipients_failed INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_schedule_date_status ON execution_schedule(scheduled_date, status);
CREATE INDEX IF NOT EXISTS idx_schedule_campaign ON execution_schedule(campaign_id);

ALTER TABLE execution_schedule ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own schedule" ON execution_schedule;
CREATE POLICY "Users see own schedule" ON execution_schedule FOR ALL 
USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));

-- 2. Add columns to campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS launched_at TIMESTAMPTZ;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS campaign_start_date DATE;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS campaign_end_date DATE;
