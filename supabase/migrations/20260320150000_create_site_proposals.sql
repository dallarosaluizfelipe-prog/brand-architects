-- Create site_proposals table for commercial proposals
CREATE TABLE IF NOT EXISTS public.site_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  subtitle text DEFAULT '',
  banner_url text DEFAULT '',

  client_name text DEFAULT '',
  client_contact text DEFAULT '',

  scope text DEFAULT '',
  timeline text DEFAULT '',
  about text DEFAULT '',

  footer_links jsonb DEFAULT '[]'::jsonb,

  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_proposals ENABLE ROW LEVEL SECURITY;

-- Public read policy (only public proposals)
CREATE POLICY "Allow public read of visible proposals"
  ON public.site_proposals
  FOR SELECT
  USING (is_public = true);

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_site_proposals_slug ON public.site_proposals (slug);
