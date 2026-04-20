ALTER TABLE public.site_content
ADD CONSTRAINT site_content_section_key_locale_unique UNIQUE (section_key, locale);