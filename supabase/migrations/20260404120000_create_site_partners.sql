-- Create site_partners table for managing partner logos in the Home page
CREATE TABLE IF NOT EXISTS site_partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  logo_url text NOT NULL DEFAULT '',
  link_url text NOT NULL DEFAULT '/cases',
  display_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS with public read
ALTER TABLE site_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_partners"
  ON site_partners FOR SELECT
  TO anon, authenticated
  USING (true);

-- Seed the 10 current partner logos
INSERT INTO site_partners (name, logo_url, link_url, display_order) VALUES
  ('Nuts O''Clock', '/lovable-uploads/partner-1.png', '/cases/nuts-oclock', 1),
  ('Yerbal',        '/lovable-uploads/partner-2.png', '/cases/yerbal',      2),
  ('Lummina',       '/lovable-uploads/partner-3.png', '/cases/lummina',     3),
  ('Parceiro 4',    '/lovable-uploads/partner-4.png', '/cases',             4),
  ('Parceiro 5',    '/lovable-uploads/partner-5.png', '/cases',             5),
  ('Parceiro 6',    '/lovable-uploads/partner-6.png', '/cases',             6),
  ('Parceiro 7',    '/lovable-uploads/partner-7.png', '/cases',             7),
  ('Parceiro 8',    '/lovable-uploads/partner-8.png', '/cases',             8),
  ('Parceiro 9',    '/lovable-uploads/partner-9.png', '/cases',             9),
  ('Parceiro 10',   '/lovable-uploads/partner-10.png', '/cases',            10)
ON CONFLICT DO NOTHING;
