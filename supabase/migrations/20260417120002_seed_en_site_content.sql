-- Migration: Seed English (en) content for site_content critical keys
-- Inserts EN versions of existing PT-BR content keys.
-- Uses INSERT ... ON CONFLICT DO NOTHING so it's idempotent.

INSERT INTO site_content (section_key, locale, title, subtitle, body, image_url, video_url)
VALUES

-- === SEO defaults ===
('seo_default_title', 'en', NULL, NULL, 'Studio Dalla — High-End Branding Studio', NULL, NULL),
('seo_default_description', 'en', NULL, NULL, 'Studio Dalla is a premium branding studio based in Brazil, crafting strategic brand identities for luxury and mid-to-large companies.', NULL, NULL),
('seo_default_keywords', 'en', NULL, NULL, 'branding studio, brand identity, luxury branding, rebranding, visual identity, premium brands', NULL, NULL),

-- === SEO por página ===
('seo_home_title', 'en', NULL, NULL, 'Studio Dalla — Premium Branding & Brand Identity', NULL, NULL),
('seo_home_description', 'en', NULL, NULL, 'We build brands that last. Studio Dalla is a high-end branding studio specialized in strategic brand identity for ambitious businesses.', NULL, NULL),
('seo_home_keywords', 'en', NULL, NULL, 'brand identity, premium branding studio, luxury brand design, rebranding agency', NULL, NULL),

('seo_about_title', 'en', NULL, NULL, 'Studio — Studio Dalla', NULL, NULL),
('seo_about_description', 'en', NULL, NULL, 'Meet the minds behind Studio Dalla. A brand strategy and visual identity studio built for companies serious about their market position.', NULL, NULL),
('seo_about_keywords', 'en', NULL, NULL, 'branding studio, brand strategist, visual identity designer, São Paulo', NULL, NULL),

('seo_methodology_title', 'en', NULL, NULL, 'Our Method — Studio Dalla', NULL, NULL),
('seo_methodology_description', 'en', NULL, NULL, 'Discover the Studio Dalla method: a strategic, structured process for building brands with precision and lasting impact.', NULL, NULL),
('seo_methodology_keywords', 'en', NULL, NULL, 'brand strategy process, branding methodology, identity design process', NULL, NULL),

('seo_portfolio_title', 'en', NULL, NULL, 'Cases — Studio Dalla', NULL, NULL),
('seo_portfolio_description', 'en', NULL, NULL, 'Explore our case studies. Premium branding projects that transformed how companies are perceived in their markets.', NULL, NULL),
('seo_portfolio_keywords', 'en', NULL, NULL, 'branding portfolio, brand identity cases, visual identity projects', NULL, NULL),

('seo_contact_title', 'en', NULL, NULL, 'Contact — Studio Dalla', NULL, NULL),
('seo_contact_description', 'en', NULL, NULL, 'Ready to build a brand that commands attention? Talk to Studio Dalla and start your brand transformation.', NULL, NULL),
('seo_contact_keywords', 'en', NULL, NULL, 'contact branding studio, hire brand designer, brand identity agency', NULL, NULL),

-- === Redes sociais (compartilhadas — mesmas URLs) ===
('social_instagram', 'en', NULL, NULL, 'https://www.instagram.com/estudiodalla/', NULL, NULL),
('social_behance', 'en', NULL, NULL, 'https://www.behance.net/luizfedalla-r/projects', NULL, NULL),

-- === Contato / rodapé ===
('footer_logo_url', 'en', NULL, NULL, '', NULL, NULL)

ON CONFLICT (section_key, locale) DO NOTHING;
