# Essential Documentation

This document captures details of components, pages, functions, and any code added or modified by AI. It is updated at the end of each cycle of changes.

## Components

### `Navbar.tsx`
- Navigation bar with desktop pill layout and mobile overlay menu.
- Exports `Navbar` component accepting `onNavigate` callback and `currentPage` string.
- Includes internal `DallaLogo` SVG subcomponent.
- Manages `isMenuOpen` state for mobile menu.

### `ContactSection.tsx`
- Reusable contact form section present on many pages.
- Contains title, social icon placeholders, and a stylized form with inputs.

### `Footer.tsx`
- Site footer with contact information, social links, legal links, and copyright.
- Displays `dalla-logo-footer.png` from public uploads.

### `Seo.tsx` 📈
- New utility component added for SEO metadata management.
- Accepts props: `title`, `description`, `keywords`, `image`, `url`.
- On render it updates `document.title`, creates/updates `<meta>` tags for description, keywords and Open Graph properties, and maintains a canonical `<link>`.
- Designed to be included early in page components; ensures mobile‑first, keyword‑rich metadata.

## Pages

### `App.tsx`
- Root component managing page state and routing.
- Renders `Navbar`, the current page from switch, and `Footer`.
- Implements scroll-to-top effect on page change.
- Detects `#admin` hash to render Admin page without Navbar/Footer.

### `Home.tsx`
- Landing page with hero video, global excellence section, selected portfolio, partners logos, and `ContactSection`.
- Accepts `onNavigate` callback to change pages.
- Currently kept in original visual/content format from the base project (no dynamic case binding).
- Now uses `Seo` component to set page-specific title, description, and keywords for improved indexability.

### `About.tsx`
- About page describing the studio's identity, narrative, values grid, and wide image.
- Ends with `ContactSection`.
- Includes `Seo` metadata for "Sobre o Estúdio Dalla" with descriptive keywords.

### `Methodology.tsx`
- Methodology page illustrating phases of the Dalla design process.
- Renders list of phases and `ContactSection`.
- Now sets specialized SEO tags via `Seo` component to capture searches for methodology and process.

### `Portfolio.tsx`
- Portfolio listing of projects; clicking navigates to case study.
- Accepts `onNavigate` callback.
- Projects are loaded dynamically from Supabase (`site_cases`) via `getSiteCases()`.
- Visibility/order now follows admin-managed fields (`is_visible`, `display_order`).
- Includes SEO metadata that summarizes the portfolio content for search engines.

### `src/data/siteCases.ts`
- Central data access for cases consumed by public pages.
- Exposes `getSiteCases(limit?)` and `SiteCase` interface.
- Reads from `site_cases` (visible items ordered by `display_order`) and falls back to six local seed cases.

### `CaseStudy.tsx`
- Detailed case study template with header, image galleries, impact metrics, and next project link.
- Includes `ContactSection`.
- Later replaced by `CaseDetails.tsx` with dynamic slug-based routing and SEO compatibility.

### `Contact.tsx`
- Contact information page with form and details.
- Includes `ContactSection`.
- Metadata added via `Seo` component with contact-focused description to capture lead inquiries.

### `Admin.tsx`
- Admin entry point. Manages session state (PIN stored in sessionStorage with 30min expiry).
- Renders `AdminLogin` if not authenticated, `AdminPanel` if authenticated.

### `AdminLogin.tsx`
- PIN-based login screen with visual numpad (mobile-first).
- Verifies PIN via edge function `admin` with action `verify`.
- Shows 4-dot indicator for PIN entry progress.

### `AdminPanel.tsx`
- Admin dashboard with tabs: Cases and Mídia.
- **Cases tab:** List, create, edit, delete cases (title, category, description, cover_url, order, featured, visible).
- **Mídia tab:** Upload images/videos to storage bucket `media`, list files, copy public URL, delete.
- All CRUD operations go through edge function `admin` with PIN authentication.

## Edge Functions

### `admin` (supabase/functions/admin/index.ts)
- Serverless function for admin operations.
- Uses service role key to bypass RLS for write operations.
- Actions: `verify` (PIN check), `list_cases`, `upsert_case`, `delete_case`, `list_content`, `upsert_content`, `change_pin`.
- PIN stored as MD5 hash in `admin_settings` table. Default PIN: `1234`.

## Database Tables

### `admin_settings`
- Stores admin PIN hash. Single row. RLS: public read only.

### `site_cases`
- Portfolio cases with title, category, description, cover_url, display_order, is_featured, is_visible. RLS: public read only.
- Realtime enabled.
- One-time idempotent import migration created: `supabase/migrations/20260303201000_import_initial_cases.sql`.
- Seed includes: Yerbal, Clave, Nuts O'Clock, Lummina, Dalla, Kuma.

### `site_content`
- Editable site sections identified by `section_key` (unique). Fields: title, subtitle, body, image_url, video_url. RLS: public read only.

## Storage

### `media` bucket
- Public bucket for images and videos uploaded via admin panel.
- RLS policies: public read, insert, update, delete.

## Other project files

- `index.tsx` and `index.html` bootstrap the React app via Vite.
- `package.json` declares React, TypeScript, Vite, and related dependencies.
- Added media asset: `public/lovable-uploads/kuma-cover.gif`.

*End of documentation.*

## 2026-03-20 Sitemap Dinâmico e Robots.txt Aprimorado

### Objetivo
- Substituir o sitemap estático por geração dinâmica que reflete automaticamente os cases visíveis no Supabase, sem rebuild ou edição manual.
- Aprimorar o `robots.txt` com política explícita para crawlers de IA (todos permitidos) e bloqueio da área administrativa.

### `api/sitemap.xml.js` (novo — função serverless Vercel)
- Função JavaScript no formato Vercel Node.js serverless (`export default async function handler(req, res)`).
- Consulta `site_cases` no Supabase (`is_visible=true`, ordenado por `display_order`) a cada request.
- Páginas estáticas incluídas: `/`, `/estudio`, `/metodologia`, `/cases`, `/contato`.
- Páginas dinâmicas: uma entrada para cada `slug` retornado pelo Supabase.
- `lastmod` gerado a partir de `updated_at` do banco; `priority` 0.9 para `is_featured=true`, 0.7 para demais.
- Fallback para array de 6 slugs hardcoded (`yerbal`, `clave`, `nuts-oclock`, `lummina`, `dalla`, `kuma`) quando Supabase retorna dados vazios ou lança erro.
- Variáveis de ambiente usadas: `SITE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Cache via header `s-maxage=3600, stale-while-revalidate=86400`.
- Rotas excluídas: `/admin`, aliases de redirect legados (`/about`, `/methodology`, `/portfolio`, `/contact`).

### `vercel.json` (novo)
- Arquivo de configuração da Vercel adicionado à raiz do projeto.
- `rewrites`: `/sitemap.xml` → `/api/sitemap.xml` (rewrite antes dos arquivos estáticos, conforme documentação Vercel).
- `rewrites`: `/((?!api/).*)` → `/index.html` para garantir que o React Router controle a navegação SPA em qualquer rota não-API.

### `public/robots.txt` (atualizado)
- Seções explícitas para: `*` (all), `Googlebot`, `Bingbot`, `Slurp`.
- Seções permissivas dedicadas para crawlers de IA: `GPTBot`, `ChatGPT-User`, `anthropic-ai`, `ClaudeBot`, `Claude-Web`, `PerplexityBot`, `Gemini`, `GoogleOther`, `YouBot`, `cohere-ai`, `meta-externalagent`.
- Todos os bots: `Allow: /`, `Disallow: /admin` e `Disallow: /admin/`.
- Crawlers de IA: `Allow: /` sem Disallow (permissão total para indexação e treinamento).
- `Sitemap:` aponta para `https://estudiodalla.com/sitemap.xml`.

### `public/sitemap.xml` (removido)
- Arquivo estático deletado para evitar conflito com a função serverless dinâmica.
- O sitemap agora é servido exclusivamente via `/api/sitemap.xml`.

## 2026-03-03 Update

### Routing
- `react-router-dom` adicionado como dependencia.
- `App.tsx` migrado para rotas reais com `BrowserRouter`:
  - `/`
  - `/estudio`
  - `/metodologia`
  - `/cases`
  - `/cases/:slug`
  - `/contato`
  - `/admin`
- Rotas legadas (`/about`, `/methodology`, `/portfolio`, `/contact`) redirecionam para as novas.

### New Page
- `pages/CaseDetails.tsx` criada para case individual por slug.
- Renderiza dados do case: `title`, `description`, `author`, `case_date`, `external_url`, `cover_url`, `gallery_urls`, `cta_text`, `cta_url`.

### Data Layer
- `src/data/siteCases.ts` reestruturado.
- Novo contrato `SiteCase` enriquecido com campos de detalhe de case.
- Inclui `getSiteCases(limit?)` e `getSiteCaseBySlug(slug)`.

### Admin
- `pages/AdminPanel.tsx` atualizado para editar os novos campos de case:
  - `slug`
  - `author`
  - `case_date`
  - `external_url`
  - `cta_text`
  - `cta_url`
  - `gallery_urls`
- Mantida gestao de midia no bucket `media`.

### Database / Migrations
- Nova migration: `supabase/migrations/20260303224000_extend_cases_and_seed_details.sql`
  - Adiciona colunas em `site_cases`: `slug`, `author`, `case_date`, `external_url`, `cta_text`, `cta_url`, `gallery_urls`.
  - Cria indice unico por `slug`.
  - Faz upsert idempotente dos 6 cases com descricoes preenchidas e metadados.

### Public UI
- `components/Navbar.tsx` agora usa links reais de rota.
- `pages/Home.tsx` preserva layout base, mas links de case agora apontam para `/cases/:slug`.
- `pages/Portfolio.tsx` consome `site_cases` e navega para case individual por slug.

## 2026-03-04 Mobile UX Impact Update

### Objetivo
- Tornar a experiencia mobile mais imersiva, intuitiva e responsiva.
- Corrigir quebra do hero/banner na Home.
- Evoluir navegacao para padrao com cara de app.

### Arquivos atualizados
- `App.tsx`
- `index.html`
- `components/Navbar.tsx`
- `components/ContactSection.tsx`
- `components/Footer.tsx`
- `pages/Home.tsx`
- `pages/About.tsx`
- `pages/Methodology.tsx`
- `pages/Portfolio.tsx`
- `pages/Contact.tsx`
- `pages/CaseDetails.tsx`

### Mudancas implementadas
1. App shell mobile
- Navbar mobile reformulada com top bar mais compacta e areas de toque maiores.
- Nova bottom navigation fixa no mobile, com estado ativo por rota.
- Overlay menu mobile refinado para leitura e toque.

2. Hero Home corrigido (quebra em mobile)
- `h-screen` substituido por `min-h-[100svh]`/`md:min-h-screen`.
- Overlay gradiente e bloco de conteudo no primeiro fold.
- CTAs principais no hero para orientacao imediata.

3. Escala tipografica e espacamento mobile-first
- Tamanhos de titulo e paragrafos ajustados para evitar overflow/stack ruim em telas pequenas.
- Reducao de `py`, `gap` e margens excessivas no mobile em todas as paginas publicas.

4. Aderencia a guideline tipografica
- Remocao de estilos em italico na About onde havia destaque com Instrument Serif.

5. Performance percebida
- `loading="lazy"` em imagens nao prioritarias.
- Poster no video de abertura da Home para reduzir tela preta inicial e melhorar primeira percepcao.

### Resultado esperado
- Navegacao mobile mais natural e previsivel.
- Home com impacto visual imediato sem quebra no hero.
- Fluxo geral mais proximo de app (hierarquia, toque e persistencia de navegacao).

### Validacao tecnica
- Build de producao executado com sucesso: `npm run build`.

## 2026-03-18 Hero Video Responsivo com Controle Admin

### Objetivo
- Corrigir video do hero quebrando em mobile (so usava video desktop).
- Permitir troca de video desktop, mobile e poster via painel admin sem alterar codigo.

### Migration
- `supabase/migrations/20260318120000_seed_hero_video_content.sql`
  - Seed de 2 registros em `site_content`: `hero_video_desktop` (com `video_url` e `image_url`) e `hero_video_mobile` (com `video_url`).
  - Idempotente via `ON CONFLICT (section_key) DO NOTHING`.

### AdminPanel.tsx
- Tipo de aba expandido de `'cases' | 'media'` para `'cases' | 'media' | 'hero'`.
- Novo state `hero: HeroSettings` com `desktopVideoUrl`, `mobileVideoUrl`, `posterUrl`.
- `loadHero()` busca registros de `site_content` via action `list_content`.
- `saveHero()` persiste via action `upsert_content` (2 chamadas: desktop e mobile).
- UI da aba Hero: 3 campos de URL com preview inline (video/imagem) e botao "Salvar Hero".

### Home.tsx
- Importados `useState`, `useEffect`, `useRef` do React e `supabase` client.
- Constantes de fallback: `FALLBACK_DESKTOP`, `FALLBACK_MOBILE`, `FALLBACK_POSTER`.
- `useEffect` busca `site_content` com `section_key IN ('hero_video_desktop', 'hero_video_mobile')` e atualiza states.
- `<video>` agora usa `ref`, com 2 `<source>` e atributo `media` para selecao responsiva automatica:
  - `<source src={heroMobile} media="(max-width: 768px)">`
  - `<source src={heroDesktop} media="(min-width: 769px)">`
- Poster dinamico vindo do banco, com fallback local.

### Validacao
- Build de producao executado com sucesso: `npm run build`.

## 2026-03-20 Sistema de Propostas Comerciais

### Objetivo
- Criar sistema completo de propostas comerciais acessíveis via link direto, com CRUD no AdminPanel, geração de PDF e compartilhamento via WhatsApp. Propostas NÃO são indexadas por buscadores.

### Migration
- `supabase/migrations/20260320150000_create_site_proposals.sql`
  - Tabela `site_proposals`: `id` (uuid PK), `slug` (text UNIQUE NOT NULL), `title`, `subtitle`, `banner_url`, `client_name`, `client_contact`, `scope` (text), `timeline` (text), `about` (text), `footer_links` (jsonb default `[]`), `is_public` (boolean default true), `created_at`, `updated_at`.
  - RLS habilitado com policy de leitura pública condicionada a `is_public = true`.
  - Índice único em `slug`.

### `src/data/siteProposals.ts` (novo)
- Interface `SiteProposal` espelhando a tabela.
- `getProposalBySlug(slug)`: query no Supabase filtrando `is_public = true`, retorna `null` se não encontrado.
- `slugify(clientName, title)`: gera slug no formato `proposta-{cliente}-{titulo}` (normalizado: lowercase, sem acentos, hífens).
- `normalizeProposal()`: função interna para coerção de tipos e defaults.

### Edge Function `admin` — novas actions
- `list_proposals`: SELECT * FROM site_proposals ORDER BY created_at DESC.
- `upsert_proposal`: INSERT ... ON CONFLICT DO UPDATE, com `updated_at = now()`.
- `delete_proposal`: DELETE por id.
- Todas com validação de PIN (padrão existente).

### `pages/ProposalDetails.tsx` (novo)
- Página pública acessível via `/proposta/:slug`.
- Layout mobile-first com seções: Hero (banner + título + subtítulo), Cliente (nome + contato), Escopo, Cronograma, Sobre, Links do rodapé.
- Botão "Baixar PDF": usa `html2canvas-pro` + `jspdf` via dynamic import (code-split). Captura container da proposta e gera PDF A4 multi-página.
- Botão "Compartilhar": abre WhatsApp com `https://wa.me/?text=Confira+essa+proposta:+{URL}`.
- SEO: usa `<Seo robots="noindex, nofollow" />` para bloquear indexação.
- Estados: loading, 404 (link expirado/incorreto), dados carregados.

### `components/Seo.tsx` (atualizado)
- Nova prop `robots?: string`.
- Quando fornecida, injeta `<meta name="robots" content="...">` via `upsertMeta`.

### `pages/AdminPanel.tsx` (atualizado)
- Tab type expandido para `'cases' | 'media' | 'hero' | 'proposals'`.
- States: `proposals`, `editingProposal`, `proposalsLoading`.
- Funções: `loadProposals()`, `saveProposal()`, `deleteProposal()`, `newProposal()`, `updateProposalField()`, `addFooterLink()`, `updateFooterLink()`, `removeFooterLink()`, `copyProposalUrl()`.
- UI da aba Propostas: lista com título, cliente, slug, status (pública/oculta), ações (copiar link, editar, excluir). Formulário com todos os campos, footer_links como lista dinâmica de {label, url}, slug auto-gerado.

### `App.tsx` (atualizado)
- Nova rota: `/proposta/:slug` → `ProposalDetails` dentro de `PublicLayout`.
- Import de `ProposalDetails` adicionado.

### Database Tables

#### `site_proposals`
- Propostas comerciais com título, subtítulo, banner, cliente, contato, escopo, cronograma, sobre, footer_links (jsonb). RLS: leitura pública condicionada a `is_public = true`.
- Não incluída no sitemap. Não indexada por buscadores.

### Dependências adicionadas
- `html2canvas-pro` — fork ativo de html2canvas com melhor suporte CSS moderno.
- `jspdf` — geração de PDF client-side.
- Ambas carregadas via dynamic import (code-split) apenas quando o usuário clica "Baixar PDF".

### Validação
- Build de produção executado com sucesso: `npm run build`.
