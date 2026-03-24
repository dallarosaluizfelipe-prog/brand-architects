# Context Log

This file records a chronological history of changes, requests, and reasoning for any AI agents interacting with the project. Entries should include date, time, and a brief summary of the action or request.

- **2026-03-03 00:00** – Initial creation by AI after reading README. Project scanned and essential.md generated. No further actions yet.

- **2026-03-03** – Lovable Cloud habilitado para o projeto, fornecendo banco de dados, autenticação e Edge Functions.

- **2026-03-03** – Criação do ambiente administrativo completo:
  - **Banco de dados:** Tabelas `admin_settings` (PIN hash), `site_cases` (cases do portfólio), `site_content` (conteúdos editáveis). RLS habilitado em todas com leitura pública.
  - **Storage:** Bucket `media` público criado para upload de imagens e vídeos.
  - **Edge Function:** `admin` — função serverless para verificação de PIN e CRUD de cases/conteúdos com service role key.
  - **Frontend:** Páginas `AdminLogin.tsx` (tela de PIN com numpad), `AdminPanel.tsx` (painel com abas Cases e Mídia), `Admin.tsx` (gerenciador de sessão).
  - **Acesso:** Via `#admin` na URL. PIN padrão: `1234`. Sessão expira em 30 minutos.
  - **App.tsx** atualizado para renderizar Admin sem Navbar/Footer quando `currentPage === 'admin'`.
  - **tsconfig.json** atualizado para excluir `supabase/functions/**` do type checking.

- **2026-03-03 16:05** - Importacao de cases para fluxo natural via Admin:
  - Criada migration idempotente `supabase/migrations/20260303201000_import_initial_cases.sql` com seed inicial dos 6 cases (Yerbal, Clave, Nuts O'Clock, Lummina, Dalla, Kuma) em `site_cases`, sem duplicar por titulo.
  - Adicionado asset local `public/lovable-uploads/kuma-cover.gif` para o case Kuma.
  - Criado `src/data/siteCases.ts` com leitura de `site_cases` (`is_visible=true`, ordenacao por `display_order`) e fallback local para manter estabilidade.
  - `pages/Home.tsx` e `pages/Portfolio.tsx` migrados de hardcoded para consumo dinamico de `site_cases`, mantendo o fluxo de edicao via Admin e reflexo no site.
  - Build validado com sucesso (`npm run build`).
- **2026-03-03 16:19** - Ajuste solicitado pelo usuario: Home restaurada ao estado original visual.
  - `pages/Home.tsx` revertida para o conteudo original (layout/textos originais), sem alteracoes estruturais.
  - Integracao dinamica de cases mantida em `pages/Portfolio.tsx` para validacao de fluxo via Admin sem comprometer a Home.
  - Build validado com sucesso (`npm run build`).
- **2026-03-03 16:33** - Evolucao completa de cases e roteamento:
  - Router migrado para `react-router-dom` com rotas reais: `/`, `/estudio`, `/metodologia`, `/cases`, `/cases/:slug`, `/contato`, `/admin` (+ redirects de rotas legadas).
  - Criada pagina dinamica `pages/CaseDetails.tsx` consumindo dados por slug com: titulo, descricao, autor, data, link externo, galeria e CTA.
  - `site_cases` evoluida com campos novos via migration `20260303224000_extend_cases_and_seed_details.sql`: `slug`, `author`, `case_date`, `external_url`, `cta_text`, `cta_url`, `gallery_urls`.
  - Importacao dos 6 cases revisada com descricoes preenchidas e upsert idempotente por `slug`.
  - `pages/AdminPanel.tsx` atualizado para gerenciar os novos campos de case, incluindo galeria (multiplas URLs).
  - Camada de dados `src/data/siteCases.ts` atualizada com `getSiteCaseBySlug` e fallback enriquecido.
  - `components/Navbar.tsx`, `pages/Home.tsx` e `pages/Portfolio.tsx` adaptados para navegacao por rotas reais e acesso a cases individuais.
  - Build validado com sucesso (`npm run build`).

- **2026-03-03 19:30** - Início da refatoração de UI/UX para Mobile-First.
  - **Solicitação do usuário:** Apresentar e executar um plano detalhado de refatoração para encontrar uma UI e UX perfeita para mobile first, com foco em fluidez, navegabilidade intuitiva e otimização.
  - **Plano Aprovado:**
    1.  **Fase 1: Fundamentação e Layout Responsivo:** Adotar CSS Flexbox/Grid, remover larguras fixas e usar media queries.
    2.  **Fase 2: Navegação Otimizada e Intuitiva:** Refatorar Navbar para padrão "hambúrguer", priorizar links e otimizar CTAs.
    3.  **Fase 3: Otimização de Conteúdo e Performance:** Otimizar imagens (WebP), vídeos/GIFs e implementar lazy loading.
    4.  **Fase 4: Usabilidade e Interação por Toque:** Aumentar áreas de toque e remover dependências de "hover".
    5.  **Fase 5: Testes e Validação:** Testar em dispositivos reais e auditar com Lighthouse.
  - **Ação Imediata:** Iniciando a Fase 1 da refatoração.
 
 -- inteação humana: por Kauan Iasin ->
 a alteração anterior realizada pelo gemini não realizou nenhuma alteração de layout visivel a proposta era oferecer uma UX melhorada, garantindo um uso melhorado em dispositivos melhorados, porém, nenhuma alteração visual foi notada, para a próxima ação, peço que o agente responsável gere alterações de impacto.

- **2026-03-03 21:10** – SEO improvements executed:
  - Added reusable `Seo` component to manage `<title>` and meta tags dynamically.
  - Updated all public-facing pages to include descriptive titles, meta descriptions, keywords and Open Graph data.
  - Enhanced `index.html` with default description, keywords, OG tags, canonical link and robots directive.
  - Created `robots.txt` and a static `sitemap.xml` under `public/` listing core pages and cases.
  - Documented changes in `essential.md` and ensured context logging.

- **2026-03-04 08:55** - Refatoracao UI/UX mobile-first com foco em impacto visual e experiencia app-like (solicitacao aprovada pelo usuario):
  - **App Shell Mobile:**
    - `components/Navbar.tsx` atualizado com topo mobile mais compacto e toque ampliado.
    - Adicionada barra inferior fixa de navegacao no mobile (tabs para Estudio, Metodologia, Cases e Contatos) para comportamento mais proximo de app.
    - Menu overlay mobile refinado com melhor hierarquia visual e tipografia responsiva.
  - **Viewport/Safe area:**
    - `index.html` atualizado com utilitario `.pt-safe` para respeitar safe area.
    - `App.tsx` ajustado para reservar espaco inferior no mobile (`pb-28`) e evitar conflito com barra inferior.
  - **Home com hero imersivo e responsivo:**
    - `pages/Home.tsx` reestruturada com hero em `min-h-[100svh]` (correcao de quebra do banner em mobile).
    - Incluidos overlay gradiente, mensagem de valor no primeiro fold e CTAs de alta intencao.
    - Escalas tipograficas e espacamentos revisados para mobile-first.
  - **Consistencia mobile nas paginas publicas:**
    - `pages/About.tsx`, `pages/Methodology.tsx`, `pages/Portfolio.tsx`, `pages/Contact.tsx`, `pages/CaseDetails.tsx`, `components/ContactSection.tsx`, `components/Footer.tsx` ajustados para reduzir excesso de tamanho/espacamento em telas pequenas.
    - Removidos usos de itaalico em titulos de destaque da About para aderencia ao guideline.
  - **Performance/percepcao:**
    - Adicionado `loading="lazy"` em imagens nao-criticas nas paginas refatoradas.
    - Hero principal com `poster` para melhorar percepcao de carregamento inicial.
  - **Validacao:**
    - Build validado com sucesso (`npm run build`).

- **2026-03-18 12:00** - Hero Video responsivo com controle via Admin:
  - **Problema:** Video do hero quebrando em dispositivos mobile por usar apenas o video desktop. Nenhuma logica responsiva existia.
  - **Solucao implementada:**
    - **Migration:** `supabase/migrations/20260318120000_seed_hero_video_content.sql` — seed idempotente de 2 registros em `site_content` (`hero_video_desktop` e `hero_video_mobile`) com URLs dos videos e poster.
    - **AdminPanel.tsx:** Adicionada terceira aba "Hero" ao painel admin, com campos editaveis para Video Desktop URL, Video Mobile URL e Poster URL. Preview de video/imagem inline. Salva via action `upsert_content` (ja existente na Edge Function).
    - **Home.tsx:** Refatorada para buscar URLs de `site_content` via Supabase client (leitura publica). `<video>` agora usa `<source media="(max-width: 768px)">` e `<source media="(min-width: 769px)">` para selecionar video adequado ao dispositivo. Fallback para URLs locais caso a query falhe.
  - **Backend:** Nenhuma alteracao necessaria — `upsert_content` e `list_content` ja existiam na Edge Function.
  - **Build:** Validado com sucesso (`npm run build`).

- **2026-03-20 — Sitemap dinâmico e robots.txt aprimorado:**
  - **Motivação:** Sitemap era estático (`public/sitemap.xml`) e precisava ser atualizado manualmente. Qualquer case novo adicionado via admin não aparecia automaticamente no sitemap. O `robots.txt` tinha política genérica sem instruções explícitas para crawlers de IA.
  - **Solução implementada:**
    - **`api/sitemap.xml.js`** — Função serverless da Vercel. Consulta o Supabase (`site_cases` com `is_visible=true`) em cada request, retorna XML com `Content-Type: application/xml`, inclui `lastmod` via `updated_at`, `priority` ajustada para cases com `is_featured=true`. Exclui explicitamente `/admin` e rotas de redirect legadas. Possui fallback com os 6 slugs hardcoded caso o Supabase esteja indisponível.
    - **`vercel.json`** — Novo arquivo de configuração da Vercel. Rewrite `/sitemap.xml` → `/api/sitemap.xml`. Rewrite SPA fallback `/(!(api/).*)` → `/index.html` para garantir navegação por React Router.
    - **`public/robots.txt`** — Reescrito com: `Allow: /` global, `Disallow: /admin` para todos os bots, seções explícitas para Googlebot e Bingbot, e seções permissivas dedicadas para crawlers de IA (`GPTBot`, `ChatGPT-User`, `ClaudeBot`, `anthropic-ai`, `PerplexityBot`, `Gemini`, `GoogleOther`, `YouBot`, `cohere-ai`, `meta-externalagent`). Sitemap apontando para URL dinâmica.
    - **`public/sitemap.xml`** — Arquivo estático deletado para evitar conflito com a função serverless (Vercel serves static files quando sem rewrite explícito em `vercel.json`).
  - **Comportamento automático:** Qualquer case marcado como `is_visible=true` no painel admin aparece no sitemap imediatamente sem necessidade de rebuild ou redeploy do frontend.
  - **Segurança:** A função usa `persistSession: false` / `autoRefreshToken: false` no cliente Supabase (compatível com Node.js serverless). Nenhum dado de admin ou rota administrativa é exposto.
  - **Variáveis de ambiente necessárias na Vercel:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`. Opcional: `SITE_URL` (fallback: `https://estudiodalla.com`).
  - **Build:** Validado com sucesso (`npm run build`).

- **2026-03-20 — Hero: texto realocado abaixo do vídeo:**
  - **Motivação:** Os textos sobrepostos ao vídeo de abertura causavam conflito visual e dificultavam a leitura, especialmente em mobile.
  - **Alteração em `pages/Home.tsx`:**
    - Removidos o overlay gradiente (`bg-gradient-to-b`) e o container absoluto de texto que ficava sobre o vídeo.
    - O hero agora exibe apenas o `<video>` limpo (full-screen, sem sobreposição).
    - Criada nova `<section>` logo abaixo do hero contendo: badge "branding e posicionamento", `<h1>`, parágrafo descritivo e CTAs ("Ver cases", "Falar com o studio").
    - Cores adaptadas de branco/transparente para preto/neutro sobre fundo claro, mantendo contraste e legibilidade.
    - O `<h1>` continua sendo o primeiro heading semântico da página — sem impacto negativo no SEO. Textos e CTAs inalterados.
  - **Build:** Validado com sucesso (`npm run build`).

- **2026-03-20 — Remoção da seção repetitiva "Poder criativo":**
  - **Motivação:** Após realocar os textos do hero para uma seção própria, a seção seguinte ("Poder criativo que impulsiona os negócios") ficou visualmente redundante — mesmo padrão de texto grande + parágrafo + CTA.
  - **Alteração em `pages/Home.tsx`:** Seção inteira removida (título duplo `<h2>`, parágrafo e botão "Conheca o Dalla design brand"). A seção "Conheca Nossos Cases" agora segue diretamente após o bloco de valor do hero.
  - **SEO:** Sem impacto negativo — o `<h1>` principal já cobre o posicionamento. O conteúdo textual relevante ("identidades visuais", "posicionar marcas") já está presente na meta description e em outras seções.
  - **Build:** Validado com sucesso (`npm run build`).

- **2026-03-20 15:00 — Sistema de Propostas Comerciais:**
  - **Motivação:** Criar sistema completo para gerar propostas comerciais acessíveis via link direto (não indexadas), com CRUD no AdminPanel, geração de PDF e compartilhamento via WhatsApp.
  - **Arquivos criados:**
    - `supabase/migrations/20260320150000_create_site_proposals.sql` — Tabela `site_proposals` com RLS (leitura pública condicionada a `is_public = true`), índice único em `slug`.
    - `src/data/siteProposals.ts` — Data layer com interface `SiteProposal`, `getProposalBySlug()` e `slugify()`.
    - `pages/ProposalDetails.tsx` — Página pública da proposta com layout premium mobile-first, PDF via html2canvas-pro/jspdf, WhatsApp share, meta robots `noindex, nofollow`.
  - **Arquivos modificados:**
    - `supabase/functions/admin/index.ts` — 3 novas actions: `list_proposals`, `upsert_proposal`, `delete_proposal`.
    - `pages/AdminPanel.tsx` — Nova aba "Propostas" com CRUD completo (título, subtítulo, banner, cliente, contato, escopo, cronograma, sobre, footer_links como lista dinâmica, is_public). Slug auto-gerado via `slugify()`. Botão "Copiar link".
    - `App.tsx` — Nova rota `/proposta/:slug` com PublicLayout.
    - `components/Seo.tsx` — Nova prop `robots?` para suporte a `noindex, nofollow`.
    - `package.json` — Dependências adicionadas: `html2canvas-pro`, `jspdf`.
  - **Segurança:** Propostas não indexadas (meta robots noindex), não incluídas no sitemap, acessíveis apenas via link direto. RLS bloqueia propostas com `is_public = false`.
  - **Build:** Validado com sucesso (`npm run build`). PDF e jspdf code-split em chunks separados (carregam sob demanda).

- **2026-03-23 12:00 — Gerenciador de Tags de Rastreamento no Admin:**
  - **Motivacao:** Permitir ao admin gerenciar tags de rastreamento (GA4, Facebook Pixel, GTM, Google Ads) diretamente pelo painel, com toggle on/off, sem editar codigo.
  - **Arquivos criados:**
    - `supabase/migrations/20260323120000_create_site_tags.sql` — Tabela `site_tags` com campos `tag_type`, `tag_id`, `label`, `is_active`. RLS leitura publica. Seed com GA4 `G-Y63NLTDN61` ativo.
    - `components/TrackingScripts.tsx` — Componente React que busca tags ativas da tabela `site_tags` e injeta scripts correspondentes no `<head>` (GA4, GTM, Facebook Pixel, Google Ads). Cleanup no unmount.
  - **Arquivos modificados:**
    - `supabase/functions/admin/index.ts` — 3 novas actions: `list_tags`, `upsert_tag`, `delete_tag`.
    - `pages/AdminPanel.tsx` — Nova aba "Tags" com CRUD completo (tipo, ID, label, toggle ativo/inativo). Seguindo padrao de UI das demais abas.
    - `App.tsx` — `<TrackingScripts />` montado dentro do `BrowserRouter` para injecao em todas as paginas.
    - `src/integrations/supabase/types.ts` — Adicionada tipagem da tabela `site_tags`.

- **2026-03-24 12:00 — Editor de Textos do Site no Admin:**
  - **Motivacao:** Permitir ao admin editar todos os textos hardcoded do site diretamente pelo painel, com suporte a negrito, italico e sublinhado via editor rich text. Cases e propostas excluidos (ja editaveis).
  - **Dependencias instaladas:** `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-underline`, `@tiptap/pm`.
  - **Arquivos criados:**
    - `src/components/RichTextEditor.tsx` — Componente reutilizavel de editor rich text com toolbar (Bold, Italic, Underline) baseado em TipTap. Gera HTML limpo.
    - `src/hooks/useSiteTexts.ts` — Hook customizado que busca textos da tabela `site_content` por `section_key`, com cache em memoria e fallback para valores hardcoded.
    - `supabase/migrations/20260324120000_seed_site_texts.sql` — Seed de todos os textos atuais do site em `site_content` com `ON CONFLICT DO NOTHING`.
  - **Arquivos modificados:**
    - `pages/AdminPanel.tsx` — Nova aba "Textos" com secoes colapsaveis por pagina (Home, Sobre, Metodologia, Portfolio, Contato, Footer, Secao CTA, SEO Padrao). Campos simples para titulos, editor rich text para descricoes. Salvar individual por campo ou todos de uma vez. Indicador visual de campos alterados.
    - `pages/Home.tsx` — Textos hardcoded substituidos por `useSiteTexts()` com fallback. Campos rich text renderizados via `dangerouslySetInnerHTML`.
    - `pages/About.tsx` — Idem: header, visao, 3 pilares dinamicos.
    - `pages/Methodology.tsx` — Idem: header e 5 fases dinamicas.
    - `pages/Portfolio.tsx` — Idem: header dinamico.
    - `pages/Contact.tsx` — Idem: header, info contatos, emails dinamicos.
    - `components/Footer.tsx` — Contatos e copyright dinamicos.
    - `components/ContactSection.tsx` — Titulo CTA dinamico.
    - `components/Seo.tsx` — SEO defaults carregados da tabela `site_content` (titulo, descricao, keywords padrao).
  - **Banco de dados:** Nenhuma alteracao de schema — usa tabela `site_content` existente (campo `body` para armazenar texto/HTML). Edge function `list_content`/`upsert_content` ja existiam.
  - **Build:** Validado com sucesso (`npm run build`).

- **2026-03-24 14:00 — Dashboard Analytics no Admin:**
  - **Motivacao:** Solicitacao do usuario para ter dashboards na tela inicial do admin com: visitas por periodo com seletor, cliques no WhatsApp, visitas por pagina (mais visitadas), coleta e armazenamento de formularios, e visitas por regiao.
  - **Arquivos criados:**
    - `supabase/migrations/20260324140000_create_analytics_tables.sql` — 3 novas tabelas: `site_page_views` (visualizacoes de pagina com geo), `site_events` (eventos como cliques WhatsApp), `site_form_submissions` (formularios de contato). RLS: insert publico (anon), sem select publico (admin le via service role). Indices para queries de dashboard.
    - `api/track.js` — Funcao serverless Vercel para receber tracking. Aceita POST com tipos `pageview`, `event`, `form_submission`. Captura geolocalizacao via headers Vercel (`x-vercel-ip-country/region/city`). Input sanitizado e truncado.
    - `src/hooks/useAnalytics.ts` — Hook e funcoes utilitarias: `useAnalytics()` (auto-track pageviews por rota + interceptor global de cliques WhatsApp), `trackPageView()`, `trackEvent()`, `trackFormSubmission()`. Usa `navigator.sendBeacon` para envio nao-bloqueante. Session ID via `sessionStorage`.
  - **Arquivos modificados:**
    - `App.tsx` — Importado e ativado `useAnalytics()` no `AppRoutes` para tracking automatico de todas as rotas e cliques WhatsApp.
    - `components/ContactSection.tsx` — Formulario agora funcional: state management com `useState`, `onSubmit` que chama `trackFormSubmission()`. Estado de envio e mensagem de sucesso. Campos: nome, email, telefone, empresa, desafio, mensagem.
    - `supabase/functions/admin/index.ts` — 2 novas actions: `analytics_summary` (contadores agregados com filtro de periodo: visitas, cliques WhatsApp, formularios, top paginas, top regioes, views diarias) e `list_form_submissions` (lista ultimos 50 envios).
    - `pages/AdminPanel.tsx` — Nova aba "Dashboard" como aba padrao ao abrir. Seletor de periodo (7/30/90 dias). Cards KPI (visitas, cliques WhatsApp, formularios). Grafico de barras de visitas por dia. Listas de paginas mais visitadas e regioes com barras de progresso. Tabela de formularios recebidos com nome, email, empresa, desafio, data.
    - `src/integrations/supabase/types.ts` — Tipagens adicionadas para `site_page_views`, `site_events`, `site_form_submissions`.
  - **Build:** Validado com sucesso (`npm run build`).

- **2026-03-24 16:00 — Refinamento Dashboard Analytics:**
  - **Motivacao:** Corrigir tracking (sendBeacon Content-Type), adicionar periodo personalizado, padrao 7 dias, graficos SVG seguindo identidade visual.
  - **Arquivos modificados:**
    - `src/hooks/useAnalytics.ts` — sendBeacon agora usa `new Blob([body], { type: 'application/json' })` em vez de string crua (fix: Vercel nao parseava text/plain como JSON).
    - `supabase/functions/admin/index.ts` — `analytics_summary` aceita `{from, to}` para periodo personalizado alem de `{days}`. Retorna `period_label` (string descritiva) em vez de `period_days` (number). Helper `addRange()` centraliza filtros de data.
    - `pages/AdminPanel.tsx` — Padrao mudado de 30 para 7 dias. Seletor de periodo agora inclui inputs de data personalizado (de/ate) + botao Filtrar. Grafico de visitas diarias agora e SVG area chart com pontos, linhas e grid (em vez de div bars). Top paginas e regioes agora sao SVG horizontal bar charts com opacidade graduada. Todas as referencias `period_days` substituidas por `period_label`. Typo "disponiveiss" corrigido.
  - **Build:** Validado com sucesso.

- **2026-03-24 17:20 — Favicon por tema do dispositivo + Open Graph de compartilhamento:**
  - **Motivacao:** Ajustar favicon para claro/escuro conforme tema do dispositivo e garantir preview consistente ao compartilhar links do site.
  - **Arquivos modificados:**
    - `index.html` — Adicionados favicons light/dark com `prefers-color-scheme`, fallback light, `apple-touch-icon` por tema, `theme-color` por tema e link de manifest com script para selecionar `manifest-light.webmanifest` ou `manifest-dark.webmanifest` conforme o SO.
    - `components/Seo.tsx` — Reforco de metatags OG/Twitter (`og:url`, `og:site_name`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`), absolutizacao de URLs para `https://estudiodalla.com` e fallback de imagem OG padrao do site.
  - **Arquivos criados:**
    - `public/manifest-light.webmanifest` — Manifest com icones e cores do tema claro.
    - `public/manifest-dark.webmanifest` — Manifest com icones e cores do tema escuro.
  - **SEO/Share:** `index.html` agora tem `og:image` e `twitter:image` estaticos para melhorar leitura por crawlers que nao executam JS.
