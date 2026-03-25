-- Seed all site text content into site_content table
-- Uses ON CONFLICT DO NOTHING to avoid overwriting any manually edited content

INSERT INTO site_content (section_key, title, body) VALUES
  -- Home
  ('home_hero_badge', 'home_hero_badge', 'branding e posicionamento'),
  ('home_hero_title', 'home_hero_title', 'Marcas de alto valor com estrategia que vira percepcao.'),
  ('home_hero_subtitle', 'home_hero_subtitle', 'O Studio Dalla une direcao estrategica e identidade visual para empresas que precisam de autoridade imediata.'),
  ('home_cases_title', 'home_cases_title', 'Conheca Nossos Cases'),
  ('home_cases_subtitle', 'home_cases_subtitle', 'Marcas que carregam estrategia na essencia, e validaram o nosso metodo.'),
  ('home_partners_title', 'home_partners_title', 'Nossos Parceiros'),
  ('home_partners_subtitle', 'home_partners_subtitle', 'Parceiros estrategicos que colocam a marca em acao por meio do design.'),

  -- About
  ('about_header_badge', 'about_header_badge', 'Nossa identidade'),
  ('about_header_title', 'about_header_title', 'This is Dalla.'),
  ('about_header_subtitle', 'about_header_subtitle', 'Somos um estudio de design, estrategista e pensador, dedicado a busca da excelencia visual e da clareza estrategica.'),
  ('about_vision_title', 'about_vision_title', 'Criado com uma visao de precisao.'),
  ('about_vision_p1', 'about_vision_p1', 'O Estudio Dalla surgiu com o principio de que o branding nao se resume a estetica, mas sim a base arquitetonica de uma marca forte.'),
  ('about_vision_p2', 'about_vision_p2', 'Acreditamos no poder da estrategia, nao como discurso abstrato, mas como direcao clara para cada decisao. Nosso processo e estruturado e nossos resultados geram posicionamento e valor real.'),
  ('about_pillars_badge', 'about_pillars_badge', 'Nossos pilares'),
  ('about_pillars_title', 'about_pillars_title', 'O que nos move.'),
  ('about_pillar1_title', 'about_pillar1_title', '01. Estrategia'),
  ('about_pillar1_desc', 'about_pillar1_desc', 'Tudo comeca pela clareza de mercado. Analisamos cenario, concorrencia e negocio para transformar decisoes de design em vantagem competitiva.'),
  ('about_pillar2_title', 'about_pillar2_title', '02. Identidade'),
  ('about_pillar2_desc', 'about_pillar2_desc', 'Construcao de sistemas visuais proprietarios, nao apenas estetica.'),
  ('about_pillar3_title', 'about_pillar3_title', '03. Posicionamento'),
  ('about_pillar3_desc', 'about_pillar3_desc', 'Posicionamento e o territorio que a marca ocupa. Definimos espacos estrategicos que geram diferenciacao real e valor percebido.'),

  -- Methodology
  ('method_header_badge', 'method_header_badge', 'Dalla Design Brand'),
  ('method_header_title', 'method_header_title', 'Estetica e consequencia. Posicionamento e decisao.'),
  ('method_header_subtitle', 'method_header_subtitle', 'Um metodo proprietario que une visao de mercado e design autoral para criar marcas com posicionamento incontestavel.'),
  ('method_phase1_label', 'method_phase1_label', 'LANDSCAPE'),
  ('method_phase1_title', 'method_phase1_title', 'Diagnostico.'),
  ('method_phase1_desc', 'method_phase1_desc', 'Revisao e aprofundamento do cenario atual da marca, analise de percepcao, concorrencia, territorio e oportunidades estrategicas.'),
  ('method_phase2_label', 'method_phase2_label', 'ESSENCE + TERRITORY'),
  ('method_phase2_title', 'method_phase2_title', 'Reposicionamento.'),
  ('method_phase2_desc', 'method_phase2_desc', 'Definicao clara do territorio exclusivo da marca. Refinamento da essencia, diferenciacao competitiva e construcao do posicionamento.'),
  ('method_phase3_label', 'method_phase3_label', 'EXPRESSION'),
  ('method_phase3_title', 'method_phase3_title', 'Sistema de Identidade Visual.'),
  ('method_phase3_desc', 'method_phase3_desc', 'Desenvolvimento de um sistema visual proprietario, com codigos exclusivos e estrutura que sustente reconhecimento e diferenciacao.'),
  ('method_phase4_label', 'method_phase4_label', 'TERRITORY'),
  ('method_phase4_title', 'method_phase4_title', 'Direcionamento e Consolidacao.'),
  ('method_phase4_desc', 'method_phase4_desc', 'Estruturacao das diretrizes de comunicacao, aplicacao da marca em canais fisicos e digitais e orientacao para expansao.'),
  ('method_phase5_label', 'method_phase5_label', 'LEGACY'),
  ('method_phase5_title', 'method_phase5_title', 'Legado.'),
  ('method_phase5_desc', 'method_phase5_desc', 'A marca transcende o presente. Construimos os alicerces para que ela se torne referencia duradoura no seu mercado.'),

  -- Portfolio
  ('portfolio_header_title', 'portfolio_header_title', 'Nossos Cases'),
  ('portfolio_header_subtitle', 'portfolio_header_subtitle', 'Identidades visuais que transformam proposito em desempenho. Design puro, executado com rigor.'),

  -- Contact
  ('contact_header_title', 'contact_header_title', 'Let''s talk.'),
  ('contact_info', 'contact_info', 'CURITIBA / BR / PR<br />TEL +55 42 9 9915 3814<br />Central Office<br />TEL +44 20 7946 0000'),
  ('contact_emails', 'contact_emails', '<a class="hover:opacity-60 transition-opacity" href="mailto:dallarosaluizfelipe@gmail.com">dallarosaluizfelipe@gmail.com</a><br /><a class="hover:opacity-60 transition-opacity" href="mailto:press@brandingstudio.com">press@brandingstudio.com</a>'),

  -- Footer
  ('footer_contacts', 'footer_contacts', 'CURITIBA / PARANA / BR<br />TEL +55 42 9 9915 3814<br />CENTRAL OFFICE<br />TEL +44 20 7946 0000'),
  ('footer_copyright', 'footer_copyright', '© 2026 Studio Dalla. All rights reserved.'),

  -- Contact Section (CTA)
  ('cta_section_title', 'cta_section_title', 'Pronto para transformar sua marca?'),

  -- SEO Defaults
  ('seo_default_title', 'seo_default_title', 'Studio Dalla — High‑End Branding Studio'),
  ('seo_default_description', 'seo_default_description', 'Consultoria de branding e rebranding para marcas de luxo em São Paulo. Transformamos identidades visuais com método, maturidade e visão estratégica.'),
  ('seo_default_keywords', 'seo_default_keywords', 'branding luxo, agência branding São Paulo, rebranding marcas premium, identidade visual luxo')
ON CONFLICT (section_key) DO NOTHING;
