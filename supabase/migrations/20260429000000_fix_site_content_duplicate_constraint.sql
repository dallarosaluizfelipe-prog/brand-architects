-- Migration: Remove constraint duplicada de site_content
-- Contexto: a migration 20260420124253 adicionou erroneamente uma segunda UNIQUE
-- constraint (site_content_section_key_locale_unique) nas mesmas colunas
-- (section_key, locale) que já possuíam site_content_section_key_locale_key.
-- Duas constraints únicas nas mesmas colunas tornam o ON CONFLICT (section_key, locale)
-- ambíguo no PostgreSQL, causando falha em todos os upserts via admin.
-- Esta migration remove a constraint redundante de forma idempotente.

ALTER TABLE public.site_content
DROP CONSTRAINT IF EXISTS site_content_section_key_locale_unique;

-- Garante que a constraint correta existe (caso não tenha sido criada antes).
ALTER TABLE public.site_content
DROP CONSTRAINT IF EXISTS site_content_section_key_locale_key;

ALTER TABLE public.site_content
ADD CONSTRAINT site_content_section_key_locale_key UNIQUE (section_key, locale);
