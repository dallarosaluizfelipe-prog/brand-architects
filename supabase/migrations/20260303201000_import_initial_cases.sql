-- One-time, idempotent import of cases from estudiodalla.com into site_cases.
INSERT INTO public.site_cases (
  title,
  category,
  description,
  cover_url,
  display_order,
  is_featured,
  is_visible
)
SELECT
  seed.title,
  seed.category,
  seed.description,
  seed.cover_url,
  seed.display_order,
  seed.is_featured,
  seed.is_visible
FROM (
  VALUES
    ('Yerbal', 'Branding  -   Identidade Visual   -   Embalagem', '', '/lovable-uploads/yerbal-cover.gif', 1, true, true),
    ('Clave', 'Identidade  -   Tipografia', '', '/lovable-uploads/7eb64c92-69f8-4c75-8d27-c09dcc336dfb.png', 2, true, true),
    ('Nuts O''Clock', 'Branding  -   Identidade Visual   -   Embalagem', '', '/lovable-uploads/nuts-oclock-cover.gif', 3, true, true),
    ('Lummina', 'Branding  -   Identidade Visual   -   Embalagem', '', '/lovable-uploads/lummina-cover.png', 4, true, true),
    ('Dalla', 'Branding  -   Identidade Visual', '', '/lovable-uploads/dalla-cover.gif', 5, true, true),
    ('Kuma', 'Branding  -   Identidade Visual   -   Ilustracao', '', '/lovable-uploads/kuma-cover.gif', 6, true, true)
) AS seed(title, category, description, cover_url, display_order, is_featured, is_visible)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.site_cases existing
  WHERE existing.title = seed.title
);
