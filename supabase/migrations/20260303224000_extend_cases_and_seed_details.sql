-- Extend site_cases for dynamic case pages and richer admin control.
ALTER TABLE public.site_cases ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.site_cases ADD COLUMN IF NOT EXISTS author TEXT NOT NULL DEFAULT '';
ALTER TABLE public.site_cases ADD COLUMN IF NOT EXISTS case_date DATE;
ALTER TABLE public.site_cases ADD COLUMN IF NOT EXISTS external_url TEXT NOT NULL DEFAULT '';
ALTER TABLE public.site_cases ADD COLUMN IF NOT EXISTS cta_text TEXT NOT NULL DEFAULT 'Falar com o Studio Dalla';
ALTER TABLE public.site_cases ADD COLUMN IF NOT EXISTS cta_url TEXT NOT NULL DEFAULT '';
ALTER TABLE public.site_cases ADD COLUMN IF NOT EXISTS gallery_urls JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE public.site_cases
SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE (slug IS NULL OR slug = '')
  AND title IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS site_cases_slug_unique_idx ON public.site_cases(slug);

INSERT INTO public.site_cases (
  slug,
  title,
  category,
  description,
  cover_url,
  gallery_urls,
  author,
  case_date,
  external_url,
  cta_text,
  cta_url,
  display_order,
  is_featured,
  is_visible
)
VALUES
  (
    'yerbal',
    'Yerbal',
    'Branding  -   Identidade Visual   -   Embalagem',
    'Identidade visual para Yerbal com foco em presenca de marca, sistema grafico consistente e aplicacoes que sustentam crescimento comercial.',
    '/lovable-uploads/yerbal-cover.gif',
    '["https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=811,fit=crop/ALpex4Lp99FJXey8/prancheta-1-YD0ElEKvzGCorx9M.png"]'::jsonb,
    'Studio Dalla',
    '2025-01-01',
    'https://estudiodalla.com/yerbal',
    'Quero uma marca nesse nivel',
    'https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0',
    1,
    true,
    true
  ),
  (
    'clave',
    'Clave',
    'Identidade  -   Tipografia',
    'Projeto de identidade para Clave com construcao tipografica proprietaria e diretrizes visuais para fortalecer reconhecimento em diferentes pontos de contato.',
    '/lovable-uploads/7eb64c92-69f8-4c75-8d27-c09dcc336dfb.png',
    '["https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=811,fit=crop/ALpex4Lp99FJXey8/prancheta-1-Aq2G8PZb8vsOy0vn.png"]'::jsonb,
    'Studio Dalla',
    '2025-02-01',
    'https://estudiodalla.com/clave',
    'Quero uma marca nesse nivel',
    'https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0',
    2,
    true,
    true
  ),
  (
    'nuts-oclock',
    'Nuts O''Clock',
    'Branding  -   Identidade Visual   -   Embalagem',
    'Com uma Identidade Visual ousada, a Nuts O''Clock traz sabor e saude para o dia a dia, combinando nuts, chocolate e ingredientes naturais em uma marca memoravel.',
    '/lovable-uploads/nuts-oclock-cover.gif',
    '["https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=2800,h=1682,fit=crop/ALpex4Lp99FJXey8/apresentaassaonuts_prancheta-1-A1aP73QKwySPBw07.png"]'::jsonb,
    'Luiz Felipe Dalla-Rosa',
    '2025-03-01',
    'https://estudiodalla.com/projeto-identidade-visual-nuts-oclock',
    'Quero uma marca nesse nivel',
    'https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0',
    3,
    true,
    true
  ),
  (
    'lummina',
    'Lummina',
    'Branding  -   Identidade Visual   -   Embalagem',
    'Com uma Identidade Visual inovadora, a Lummina reforca bem-estar e sofisticacao em uma linha de velas aromaticas criada para experiencias sensoriais de marca.',
    '/lovable-uploads/lummina-cover.png',
    '["https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=960,fit=crop/ALpex4Lp99FJXey8/idv_lummina_prancheta-1-dOqaLRDvyeSB3M6Z.png"]'::jsonb,
    'Luiz Felipe Dalla-Rosa',
    '2025-04-01',
    'https://estudiodalla.com/projeto-identidade-visual-luminna',
    'Quero uma marca nesse nivel',
    'https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0',
    4,
    true,
    true
  ),
  (
    'dalla',
    'Dalla',
    'Branding  -   Identidade Visual',
    'Case institucional do Studio Dalla com exploracao de posicionamento, narrativa visual e consistencia de marca em ambientes digitais e editoriais.',
    '/lovable-uploads/dalla-cover.gif',
    '["https://assets.zyrosite.com/ALpex4Lp99FJXey8/logogirata3ria-ALpPgb92v6uVXn7D.gif"]'::jsonb,
    'Studio Dalla',
    '2025-05-01',
    'https://estudiodalla.com/estudio-dalla-identidadevisual',
    'Quero uma marca nesse nivel',
    'https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0',
    5,
    true,
    true
  ),
  (
    'kuma',
    'Kuma',
    'Branding  -   Identidade Visual   -   Ilustracao',
    'Identidade da Kuma Jiu-Jitsu desenvolvida para comunicar forca, disciplina e personalidade, com recursos visuais aplicaveis em produtos e comunicacao da marca.',
    '/lovable-uploads/kuma-cover.gif',
    '["https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1440,h=810,fit=crop/ALpex4Lp99FJXey8/prancheta-1-d954pGgpObHpeXEa.png"]'::jsonb,
    'Luiz Felipe Dalla-Rosa',
    '2025-06-01',
    'https://estudiodalla.com/projeto-identidade-visual-kuma-jiu-jitsu',
    'Quero uma marca nesse nivel',
    'https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0',
    6,
    true,
    true
  )
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  cover_url = EXCLUDED.cover_url,
  gallery_urls = EXCLUDED.gallery_urls,
  author = EXCLUDED.author,
  case_date = EXCLUDED.case_date,
  external_url = EXCLUDED.external_url,
  cta_text = EXCLUDED.cta_text,
  cta_url = EXCLUDED.cta_url,
  display_order = EXCLUDED.display_order,
  is_featured = EXCLUDED.is_featured,
  is_visible = EXCLUDED.is_visible,
  updated_at = now();
