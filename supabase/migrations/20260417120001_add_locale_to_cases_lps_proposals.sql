-- Migration: Add locale + translation_group to site_cases, site_lps, site_proposals

-- === site_cases ===
ALTER TABLE site_cases
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'pt-BR',
  ADD COLUMN IF NOT EXISTS translation_group UUID DEFAULT gen_random_uuid();

-- Ensure existing rows each have a unique translation_group (they had none)
UPDATE site_cases SET translation_group = gen_random_uuid() WHERE translation_group IS NULL;

ALTER TABLE site_cases
  ALTER COLUMN translation_group SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_site_cases_locale ON site_cases (locale);
CREATE INDEX IF NOT EXISTS idx_site_cases_translation_group ON site_cases (translation_group);

-- === site_lps ===
ALTER TABLE site_lps
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'pt-BR',
  ADD COLUMN IF NOT EXISTS translation_group UUID DEFAULT gen_random_uuid();

UPDATE site_lps SET translation_group = gen_random_uuid() WHERE translation_group IS NULL;

ALTER TABLE site_lps
  ALTER COLUMN translation_group SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_site_lps_locale ON site_lps (locale);

-- === site_proposals ===
ALTER TABLE site_proposals
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'pt-BR',
  ADD COLUMN IF NOT EXISTS translation_group UUID DEFAULT gen_random_uuid();

UPDATE site_proposals SET translation_group = gen_random_uuid() WHERE translation_group IS NULL;

ALTER TABLE site_proposals
  ALTER COLUMN translation_group SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_site_proposals_locale ON site_proposals (locale);
