-- Analytics tables for dashboard: page views, events, form submissions
-- RLS: anon can INSERT (tracking), only service role can SELECT (admin reads via edge function)

-- Page views
CREATE TABLE IF NOT EXISTS site_page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  session_id text,
  referrer text,
  user_agent text,
  country text,
  region text,
  city text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_page_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_page_views" ON site_page_views
  FOR INSERT TO anon WITH CHECK (true);

-- No SELECT policy for anon — admin reads via service role in edge function

-- Events (whatsapp clicks, etc.)
CREATE TABLE IF NOT EXISTS site_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  page_path text,
  metadata jsonb DEFAULT '{}',
  session_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_events" ON site_events
  FOR INSERT TO anon WITH CHECK (true);

-- Form submissions
CREATE TABLE IF NOT EXISTS site_form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  challenge text,
  message text,
  page_path text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE site_form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_form_submissions" ON site_form_submissions
  FOR INSERT TO anon WITH CHECK (true);

-- Indexes for dashboard queries
CREATE INDEX idx_page_views_created_at ON site_page_views (created_at DESC);
CREATE INDEX idx_page_views_page_path ON site_page_views (page_path);
CREATE INDEX idx_events_created_at ON site_events (created_at DESC);
CREATE INDEX idx_events_type ON site_events (event_type);
CREATE INDEX idx_form_submissions_created_at ON site_form_submissions (created_at DESC);
