-- Add SEO meta columns to site_cases
ALTER TABLE public.site_cases ADD COLUMN IF NOT EXISTS meta_title TEXT DEFAULT '';
ALTER TABLE public.site_cases ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT '';
ALTER TABLE public.site_cases ADD COLUMN IF NOT EXISTS meta_keywords TEXT DEFAULT '';

-- Add SEO meta columns to site_proposals
ALTER TABLE public.site_proposals ADD COLUMN IF NOT EXISTS meta_title TEXT DEFAULT '';
ALTER TABLE public.site_proposals ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT '';
ALTER TABLE public.site_proposals ADD COLUMN IF NOT EXISTS meta_keywords TEXT DEFAULT '';
ALTER TABLE public.site_proposals ADD COLUMN IF NOT EXISTS meta_robots TEXT DEFAULT 'noindex, nofollow';
