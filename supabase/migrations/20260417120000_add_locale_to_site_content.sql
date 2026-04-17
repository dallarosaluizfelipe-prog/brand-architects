-- Migration: Add locale support to site_content
-- Drops unique constraint on section_key, adds locale column,
-- adds composite unique constraint (section_key, locale).

-- 1. Add locale column (defaults pt-BR so all existing data becomes pt-BR)
ALTER TABLE site_content
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'pt-BR';

-- 2. Drop the old unique constraint on section_key (name may vary — handle both)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'site_content_section_key_key'
      AND conrelid = 'site_content'::regclass
  ) THEN
    ALTER TABLE site_content DROP CONSTRAINT site_content_section_key_key;
  END IF;
END$$;

-- 3. Add composite unique constraint
ALTER TABLE site_content
  DROP CONSTRAINT IF EXISTS site_content_section_key_locale_key;

ALTER TABLE site_content
  ADD CONSTRAINT site_content_section_key_locale_key UNIQUE (section_key, locale);

-- 4. Index for locale queries
CREATE INDEX IF NOT EXISTS idx_site_content_locale ON site_content (locale);
