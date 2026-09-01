ALTER TABLE public.site_lps
  ADD COLUMN IF NOT EXISTS numbers_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS hero_images jsonb NOT NULL DEFAULT '[]'::jsonb;