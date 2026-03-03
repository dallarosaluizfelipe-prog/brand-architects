
-- Admin settings table for PIN storage
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site cases table
CREATE TABLE public.site_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site content table for editable sections
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE,
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  body TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  video_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true);

-- RLS: admin_settings readable by anyone (PIN check), but no insert/update/delete via client
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read admin_settings" ON public.admin_settings FOR SELECT USING (true);

-- RLS: site_cases readable by anyone, writable only via edge function
ALTER TABLE public.site_cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read site_cases" ON public.site_cases FOR SELECT USING (true);

-- RLS: site_content readable by anyone
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read site_content" ON public.site_content FOR SELECT USING (true);

-- Storage RLS: allow public read on media bucket
CREATE POLICY "Allow public read media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Enable realtime for site_cases
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_cases;
