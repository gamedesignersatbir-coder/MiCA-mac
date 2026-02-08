-- Enable Row Level Security
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE execution_stats ENABLE ROW LEVEL SECURITY;

-- Table 1: campaigns
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_description TEXT NOT NULL,
  product_document_url TEXT, -- uploaded document (PDF/DOCX) stored in Supabase Storage
  target_audience VARCHAR(500),
  launch_date DATE NOT NULL,
  budget INTEGER DEFAULT 5000, -- in INR rupees, default ₹5,000
  location VARCHAR(255),
  product_links TEXT, -- comma-separated URLs
  tone VARCHAR(100) DEFAULT 'Professional', -- user's chosen tone
  tone_custom_words VARCHAR(255), -- 2-3 custom tone words from user
  marketing_plan JSONB, -- full 4-week plan from Claude API
  recommended_channels JSONB, -- which channels AI recommends: ["email","whatsapp","instagram","voice"]
  status VARCHAR(50) DEFAULT 'draft', 
  -- Statuses: draft → tone_preview → tone_approved → generating → plan_ready → approved → executing → completed
  tone_preview_content JSONB, -- lightweight preview content for tone approval step
  tone_revision_used BOOLEAN DEFAULT false, -- user gets exactly ONE revision
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "Users see own campaigns" ON campaigns FOR ALL USING (auth.uid() = user_id);

-- Table 2: email_templates
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  template_order INTEGER NOT NULL, -- 1-5
  subject VARCHAR(255) NOT NULL,
  pre_header VARCHAR(150),
  body TEXT NOT NULL,
  cta_text VARCHAR(100),
  scheduled_day INTEGER, -- which day of the 28-day campaign
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "Users see own email templates" ON email_templates FOR ALL 
USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));

-- Table 3: whatsapp_messages
CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  message_order INTEGER NOT NULL, -- 1-8
  message_text TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'nurture', -- intro | nurture | fomo | close | feedback
  scheduled_day INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "Users see own whatsapp messages" ON whatsapp_messages FOR ALL 
USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));

-- Table 4: social_posts
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  post_order INTEGER NOT NULL, -- 1-10
  caption TEXT NOT NULL,
  hashtags VARCHAR(500),
  platform VARCHAR(50) DEFAULT 'instagram',
  image_url TEXT, -- linked to generated_images
  scheduled_day INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "Users see own social posts" ON social_posts FOR ALL 
USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));

-- Table 5: generated_images
CREATE TABLE generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL, -- Supabase Storage URL or Replicate output URL
  image_prompt TEXT,
  image_order INTEGER,
  image_type VARCHAR(50) DEFAULT 'social', -- social | email_header | brand
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "Users see own images" ON generated_images FOR ALL 
USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));

-- Table 6: customer_data
CREATE TABLE customer_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  custom_fields JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "Users see own customer data" ON customer_data FOR ALL 
USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));

-- Table 7: campaign_logs
CREATE TABLE campaign_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  channel VARCHAR(50) NOT NULL, -- email | whatsapp | instagram | voice
  action VARCHAR(100) NOT NULL, -- sent | delivered | failed | posted | called
  recipient VARCHAR(255),
  status_details TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "Users see own logs" ON campaign_logs FOR ALL 
USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));

-- Table 8: execution_stats
CREATE TABLE execution_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  email_sent INTEGER DEFAULT 0,
  email_failed INTEGER DEFAULT 0,
  whatsapp_delivered INTEGER DEFAULT 0,
  whatsapp_failed INTEGER DEFAULT 0,
  instagram_posts INTEGER DEFAULT 0,
  voice_calls INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE POLICY "Users see own stats" ON execution_stats FOR ALL 
USING (campaign_id IN (SELECT id FROM campaigns WHERE user_id = auth.uid()));

-- Storage Buckets (Manual creation usually required in dashboard, but policies can be defined if buckets exist)
-- product-documents: private, per-user
-- campaign-images: public read
-- campaign-videos: public read
