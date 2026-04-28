-- Migration corrigida: remove constraint redundante adicionada incorretamente.
-- A constraint composta (section_key, locale) já existe como
-- site_content_section_key_locale_key criada em 20260417120000.
-- Duas constraints únicas nas mesmas colunas tornam o ON CONFLICT ambíguo.
ALTER TABLE public.site_content
DROP CONSTRAINT IF EXISTS site_content_section_key_locale_unique;