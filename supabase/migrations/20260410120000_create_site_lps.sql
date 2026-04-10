-- Landing Pages dinâmicas (clone da LP Identidade Visual)
CREATE TABLE IF NOT EXISTS site_lps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL DEFAULT '',
  is_visible boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,

  -- Hero
  hero_badge text NOT NULL DEFAULT '',
  hero_title text NOT NULL DEFAULT '',
  hero_subtitle text NOT NULL DEFAULT '',
  hero_cta_text text NOT NULL DEFAULT 'Solicitar proposta',
  hero_cta_url text NOT NULL DEFAULT '/contato',
  hero_video_desktop text NOT NULL DEFAULT '',
  hero_video_mobile text NOT NULL DEFAULT '',
  hero_poster text NOT NULL DEFAULT '',

  -- About
  about_badge text NOT NULL DEFAULT 'Sobre nós',
  about_title text NOT NULL DEFAULT '',
  about_paragraphs text[] NOT NULL DEFAULT '{}',
  about_cta_text text NOT NULL DEFAULT '',
  about_cta_url text NOT NULL DEFAULT '/estudio',
  about_video_url text NOT NULL DEFAULT '',

  -- Method
  method_badge text NOT NULL DEFAULT '',
  method_title text NOT NULL DEFAULT '',
  method_subtitle text NOT NULL DEFAULT '',
  method_phases jsonb NOT NULL DEFAULT '[]'::jsonb,
  method_cta_text text NOT NULL DEFAULT 'Ver metodologia completa',
  method_cta_url text NOT NULL DEFAULT '/metodologia',

  -- Benefits
  benefits_badge text NOT NULL DEFAULT 'Benefícios',
  benefits_title text NOT NULL DEFAULT '',
  benefits_subtitle text NOT NULL DEFAULT '',
  benefits_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  benefits_cta_text text NOT NULL DEFAULT '',
  benefits_cta_url text NOT NULL DEFAULT '/contato',

  -- Cases
  cases_badge text NOT NULL DEFAULT '',
  cases_title text NOT NULL DEFAULT '',
  cases_subtitle text NOT NULL DEFAULT '',
  cases_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  cases_cta_text text NOT NULL DEFAULT 'Ver todos os cases',
  cases_cta_url text NOT NULL DEFAULT '/cases',

  -- Partners
  partners_badge text NOT NULL DEFAULT 'Parceiros',
  partners_title text NOT NULL DEFAULT '',
  partners_subtitle text NOT NULL DEFAULT '',
  partners_show boolean NOT NULL DEFAULT true,
  partners_cta_text text NOT NULL DEFAULT '',
  partners_cta_url text NOT NULL DEFAULT '/contato',

  -- SEO
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  meta_keywords text NOT NULL DEFAULT '',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Seed: LP Identidade Visual (dados originais hardcoded)
INSERT INTO site_lps (
  slug, title, display_order,
  hero_badge, hero_title, hero_subtitle, hero_cta_text, hero_cta_url,
  hero_video_desktop, hero_video_mobile, hero_poster,
  about_badge, about_title, about_paragraphs, about_cta_text, about_cta_url, about_video_url,
  method_badge, method_title, method_subtitle, method_phases, method_cta_text, method_cta_url,
  benefits_badge, benefits_title, benefits_subtitle, benefits_items, benefits_cta_text, benefits_cta_url,
  cases_badge, cases_title, cases_subtitle, cases_items, cases_cta_text, cases_cta_url,
  partners_badge, partners_title, partners_subtitle, partners_show, partners_cta_text, partners_cta_url,
  meta_title, meta_description, meta_keywords
) VALUES (
  'identidadevisual',
  'Identidade Visual',
  0,
  -- Hero
  'Identidade visual estratégica',
  E'Só estética não vende.\nSem estratégia, sua marca\nnão será escolhida.',
  E'Criamos identidades visuais que não só atraem,\nmas posicionam você para ser a decisão óbvia.',
  'Solicitar proposta',
  '/contato',
  '/lovable-uploads/abertura-site.mp4',
  '/lovable-uploads/abertura-site-mobile.mp4',
  '/lovable-uploads/2fdb741b-7706-4fa8-b5f2-dda301d0572d.png',
  -- About
  'Sobre nós',
  'Estratégia e estética a serviço do seu negócio.',
  ARRAY[
    'Somos o Estúdio Dalla, especialista em estratégias para marcas que não querem disputar, querem ser escolhidas.',
    E'Unindo análise de mercado e design estratégico\npara criar identidades que sustentam valor e posicionamento.',
    'Não é só sobre como sua marca parece, é sobre como ela é percebida e por que isso define quanto ela vale.',
    E'Cada projeto é conduzido com profundidade estratégica\ne rigor criativo para transformar estética em decisão de compra.'
  ],
  'Conheça o estúdio',
  '/estudio',
  '/lovable-uploads/dalla-teaser.mov',
  -- Method
  'Dalla Design Brand',
  'Um método que resolve problemas de marca.',
  'Cinco etapas estratégicas que transformam diagnóstico em identidade visual de alto impacto.',
  '[
    {"id":"I","label":"LANDSCAPE","title":"Diagnóstico.","desc":"Imersão no universo da marca. Mapeamos mercado, concorrência, público e percepção atual para construir uma base estratégica sólida."},
    {"id":"II","label":"ESSENCE + TERRITORY","title":"Posicionamento.","desc":"Definimos o território exclusivo da marca. Essência, diferenciação e o posicionamento que vai guiar toda a construção visual."},
    {"id":"III","label":"EXPRESSION","title":"Sistema Visual.","desc":"Criação do sistema de identidade visual proprietário: logo, tipografia, paleta, elementos gráficos e códigos visuais exclusivos."},
    {"id":"IV","label":"TERRITORY","title":"Aplicações.","desc":"Materialização da marca em todos os pontos de contato — digital, físico, embalagens, papelaria e ambientação."},
    {"id":"V","label":"LEGACY","title":"Legado.","desc":"Entrega do brandbook e diretrizes completas. Sua marca preparada para crescer com consistência e reconhecimento duradouro."}
  ]'::jsonb,
  'Ver metodologia completa',
  '/metodologia',
  -- Benefits
  'Benefícios',
  'O que sua marca ganha.',
  'Cada projeto é entregue com um sistema visual completo, pronto para ser aplicado em todos os pontos de contato da marca.',
  '[
    {"icon":"brand_family","title":"Logotipo e variações","desc":"Versões principal, secundária, monocromática e responsiva."},
    {"icon":"palette","title":"Paleta de cores","desc":"Sistema cromático estratégico para todos os canais."},
    {"icon":"text_fields","title":"Tipografia","desc":"Seleção e hierarquia tipográfica exclusiva."},
    {"icon":"grid_view","title":"Elementos gráficos","desc":"Patterns, texturas e ícones proprietários."},
    {"icon":"auto_stories","title":"Manual de Aplicação","desc":"Manual de identidade com todas as diretrizes."},
    {"icon":"devices","title":"Templates","desc":"Social media, site, apresentações e e-mail."}
  ]'::jsonb,
  'Quero uma identidade visual',
  '/contato',
  -- Cases
  'Quem confiou no nosso método',
  'Cases que comprovam resultados.',
  'Marcas que carregam estratégia na essência e validaram o método Dalla Design Brand.',
  '[
    {"slug":"yerbal","title":"Yerbal","category":"Branding — Identidade Visual — Embalagem","cover_url":"/lovable-uploads/yerbal-cover.gif"},
    {"slug":"clave","title":"Clave","category":"Identidade — Tipografia","cover_url":"/lovable-uploads/7eb64c92-69f8-4c75-8d27-c09dcc336dfb.png"},
    {"slug":"nuts-oclock","title":"Nuts O''Clock","category":"Branding — Identidade Visual — Embalagem","cover_url":"/lovable-uploads/nuts-oclock-cover.gif"},
    {"slug":"dalla","title":"Dalla","category":"Branding — Identidade Visual","cover_url":"/lovable-uploads/dalla-cover.gif"}
  ]'::jsonb,
  'Ver todos os cases',
  '/cases',
  -- Partners
  'Parceiros',
  'Quem caminha com a gente.',
  'Parceiros estratégicos que colocam a marca em ação por meio do design.',
  true,
  'Seja um parceiro',
  '/contato',
  -- SEO
  'Identidade Visual para Marcas de Alto Valor — Studio Dalla',
  'Criamos identidades visuais estratégicas que posicionam marcas no mercado de luxo. Método proprietário Dalla Design Brand para empresas que buscam autoridade e diferenciação.',
  'identidade visual, identidade visual de luxo, branding SP, logo marca premium, identidade visual empresas, rebranding, studio branding São Paulo'
);

-- Enable RLS
ALTER TABLE site_lps ENABLE ROW LEVEL SECURITY;

-- Public read for visible LPs
CREATE POLICY "Public can read visible LPs"
  ON site_lps FOR SELECT
  USING (is_visible = true);
