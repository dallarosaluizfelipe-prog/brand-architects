ALTER TABLE public.site_content   ADD COLUMN IF NOT EXISTS text_styles JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.site_cases     ADD COLUMN IF NOT EXISTS text_styles JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.site_lps       ADD COLUMN IF NOT EXISTS text_styles JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.site_proposals ADD COLUMN IF NOT EXISTS text_styles JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.site_partners  ADD COLUMN IF NOT EXISTS text_styles JSONB NOT NULL DEFAULT '{}'::jsonb;