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
