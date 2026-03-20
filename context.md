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
