# Essential Documentation

This document captures details of components, pages, functions, and any code added or modified by AI. It is updated at the end of each cycle of changes.

## 2026-04-29 - LPs com bloco de video institucional editavel no Admin

### `supabase/migrations/20260429153000_add_institutional_video_url_to_site_lps.sql` (novo)
- Adiciona a coluna `institutional_video_url` em `site_lps` com `text not null default ''`.
- Compatibilidade retroativa preservada: LPs existentes continuam funcionais com valor vazio.

### `supabase/migrations/20260429160000_add_institutional_video_mobile_url_to_site_lps.sql` (novo)
- Adiciona a coluna `institutional_video_mobile_url` em `site_lps` com `text not null default ''`.
- Permite definir uma fonte dedicada para mobile no mesmo bloco institucional.

### `src/data/siteLps.ts` (atualizado)
- Interface `SiteLp` recebeu os campos `institutional_video_url: string` e `institutional_video_mobile_url: string`.
- `normalizeLp()` passa a normalizar os dois campos com fallback para string vazia.
- Impacto: qualquer consumo de LP no front/admin passa a ter o campo disponivel de forma tipada.

### `src/integrations/supabase/types.ts` (atualizado)
- Tipos de `site_lps` atualizados para incluir `institutional_video_url` e `institutional_video_mobile_url` em:
  - `Row`
  - `Insert`
  - `Update`

### `pages/AdminPanel.tsx` (atualizado)
- LP CRUD:
  - `normalizeLp` inclui `institutional_video_url` e `institutional_video_mobile_url`.
  - `newLp()` inicializa ambos com `''`.
- Formulario da aba LPs:
  - Secao "Video Institucional" com inputs de URL desktop e mobile.
  - Campo salvo no mesmo fluxo existente de `saveLp` (`upsert_lp`), sem alterar actions do backend.

### `pages/LandingPage.tsx` (atualizado)
- Nova secao condicional "Video Institucional" inserida entre Hero e primeiro conteudo (`Quem Somos`).
- Renderiza quando existir URL desktop ou mobile.
- Estilo do bloco:
  - fundo proprio (`bg-[#f5f5f6]`), borda e sombra para separacao visual
  - container com `aspect-video` e cantos arredondados
- Configuracao de video:
  - `autoPlay`, `loop`, `muted`, `playsInline`, `preload="metadata"`, `object-cover`
  - suporte a `<source media="(max-width: 767px)">` para mobile, com fallback automatico para desktop
- Label do bloco internacionalizada por locale atual (`en` -> "Institutional Video", demais -> "Video Institucional").

### Validacao
- `get_errors` sem erros em:
  - `pages/LandingPage.tsx`
  - `pages/AdminPanel.tsx`
  - `src/data/siteLps.ts`
  - `src/integrations/supabase/types.ts`
- `npm run build` executado com sucesso apos as alteracoes.

## 2026-04-28 - Correcao de layout do toggle de idioma no desktop

### `components/Navbar.tsx` (atualizado)
- O toggle de idioma desktop (`LocaleFlagSwitcher size="md"`) foi removido de dentro do `nav` central e renderizado como bloco separado no nivel superior do componente.
- Causa corrigida: o `nav` desktop usa `md:left-1/2 md:-translate-x-1/2`; manter o toggle `fixed` como descendente desse ancestral podia gerar referencia de posicionamento inconsistente e sobreposicao visual.
- Novo posicionamento do toggle desktop: `fixed top-8 right-6 z-50`, alinhado na mesma altura do header e isolado no canto superior direito da viewport.
- Separacao visual reforcada com container proprio (`nav-blur`, borda e sombra), mantendo identidade do design system sem impactar o fluxo mobile.
- Comportamento mobile preservado: switcher continua no header mobile e no menu fullscreen mobile, sem alteracao funcional.

### Validacao
- `get_errors` em `components/Navbar.tsx`: sem erros.
- `npm run build`: sucesso.

## 2026-04-22 — SEO/GEO: robots.txt + sitemap.xml

### `public/robots.txt` (reescrito)
- Default `User-agent: *`: Allow `/` + allow-list de assets estaticos; Disallow `/admin`, `/admin/`, `/api/`, `/proposta`, `/proposta/`, `/proposal`, `/proposal/`, `/en/proposal`, `/en/proposal/`, e padroes `?utm_*`, `?fbclid=`, `?gclid=`.
- Blocos especificos para Googlebot, Googlebot-Image, Bingbot, Slurp, DuckDuckBot, Yandex.
- Bots de IA / GEO permitidos para `/` mas bloqueados em `/admin*` e `/proposta*`: GPTBot, ChatGPT-User, OAI-SearchBot, anthropic-ai, ClaudeBot, Claude-SearchBot, Claude-Web, PerplexityBot, Google-Extended, Gemini, GoogleOther, Applebot, Applebot-Extended, YouBot, cohere-ai, meta-externalagent, Amazonbot, Bytespider, DiffBot.
- Scrapers bloqueados integralmente: AhrefsBot, SemrushBot, MJ12bot, DotBot, BLEXBot.
- Diretivas finais: `Host: https://estudiodalla.com` e `Sitemap: https://estudiodalla.com/sitemap.xml`.

### `api/sitemap.xml.js` (reescrito)
- `STATIC_PAIRS`: lista de pares `{ pt, en, priority, changefreq }` para emitir reciprocamente as duas URLs com hreflang `pt-BR`, `en` e `x-default` (sempre PT).
- `xmlEscape(str)`: helper que escapa `& < > " '` antes de inserir em `<loc>` ou `href`.
- `isoDate(value, fallback)`: normaliza `updated_at` para `YYYY-MM-DD`; retorna o `today` quando ausente/invalido.
- `groupByTranslation(rows)`: agrupa rows dinamicas por `translation_group`, separando `pt` e `en`.
- `renderUrl({ loc, lastmod, changefreq, priority, alternates })`: monta um `<url>` com `<xhtml:link rel="alternate">` para cada idioma disponivel + `x-default`.
- `buildXml({ staticPairs, caseGroups, lpGroups, today })`: gera o XML completo. Cases featured recebem `priority 0.9` e demais `0.7`; LPs recebem `0.8`. Quando so existe versao PT, hreflang aponta apenas para PT + `x-default`.
- Handler busca de `site_cases` e `site_lps` (`is_visible = true`) os campos `slug, updated_at, locale, translation_group` (+ `is_featured` para cases). Em caso de falha, usa `FALLBACK_CASES` e `FALLBACK_LPS` (com slug `identidade-visual` corrigido).
- Headers: `Content-Type: application/xml; charset=utf-8`, `Cache-Control: s-maxage=3600, stale-while-revalidate=86400`.
- Excluidos do sitemap: `/admin*`, `/api/*`, `/proposta*`, `/en/proposal*`, `/links`.

## 2026-04-22 - Consolidacao da documentacao tecnica do projeto

### Estado atual do produto
- Aplicacao institucional e comercial do Studio Dalla, com conteudo dinamico, portfolio, landing pages, propostas e painel administrativo.
- Stack confirmado: React 19, TypeScript 5.8, Vite 6, React Router 7, Supabase, Vercel, TipTap, jsPDF/html2canvas-pro e Microsoft Clarity.
- Deploy orientado a Vercel com fallback SPA e sitemap dinamico servido por API.

### Arquitetura global

### `App.tsx`
- Compoe `BrowserRouter`, `TrackingScripts`, `LocaleProvider` e `AppRoutes`.
- Mantem `Home` sincrona por ser a pagina critica de entrada e carrega as demais rotas publicas com `React.lazy()` e `Suspense`.
- Separa o tratamento visual da rota `/admin`, que nao usa `Navbar`, `Footer` nem botao flutuante de WhatsApp.
- Possui redirects de rotas legadas PT e arvore completa para rotas EN.

### `src/contexts/LocaleContext.tsx`
- Define o tipo `Locale = 'pt-BR' | 'en'`.
- Resolve locale por ordem de prioridade entre URL, `localStorage` e idiomas do navegador.
- `setLocale()` persiste a preferencia e navega para a rota equivalente no outro idioma via `switchLocaleHref`.
- Executa redirecionamento automatico de primeira visita para ingles quando apropriado, exceto para bots.
- Mantem `document.documentElement.lang` sincronizado com o idioma atual.

### `src/utils/localeRoutes.ts`
- Centraliza o mapa de equivalencia entre rotas PT e EN.
- Suporta rotas estaticas e dinamicas de cases, landing pages e propostas.
- Serve como base para alternancia de idioma, canonical e sitemap internacional.

### Dados e CMS operacional

### `src/hooks/useSiteTexts.ts`
- Continua sendo a principal camada de leitura de conteudo textual e de midia em `site_content`.
- Trabalha com cache por locale e fallback em cascata: locale solicitado -> `pt-BR` -> defaults hardcoded.
- Usa cast amplo no cliente Supabase para contornar tipos desatualizados quando o schema muda antes da regeneracao dos tipos.

### `src/data/siteCases.ts`, `src/data/siteLps.ts`, `src/data/siteProposals.ts`, `src/data/sitePartners.ts`
- Organizam a leitura dos modulos de conteudo dinamico do site.
- Cases, LPs e propostas ja respeitam locale e fallback para `pt-BR`.
- Parceiros seguem sem coluna de locale no schema atual.

### Admin, integracoes e backend operacional

### `pages/Admin.tsx`, `pages/AdminLogin.tsx`, `pages/AdminPanel.tsx`
- `Admin.tsx` controla o estado da sessao administrativa.
- `AdminLogin.tsx` entrega a interface de PIN.
- `AdminPanel.tsx` concentra CRUD de paginas, cases, propostas, LPs, parceiros, tags, leads e analytics.
- O painel permite editar conteudo de `pt-BR` e `en`, mas sua interface segue apenas em portugues.

### `supabase/functions/admin/index.ts`
- Edge Function principal para autenticacao administrativa e operacoes de CRUD.
- Valida PIN com hash SHA-256 em todas as actions alem de `verify`.
- Actions confirmadas na auditoria: `verify`, `list_cases`, `upsert_case`, `delete_case`, `list_content`, `upsert_content`, `change_pin`, `list_proposals`, `upsert_proposal`, `delete_proposal`, `list_tags`, `upsert_tag`, `delete_tag`, `analytics_summary`, `list_form_submissions`, `list_emails`, `list_lps`, `upsert_lp`, `delete_lp`, `list_partners`, `upsert_partner`, `delete_partner`.
- Opera com `SUPABASE_SERVICE_ROLE_KEY`, portanto a seguranca depende criticamente do fluxo de PIN e do ambiente de deploy.

### `api/track.js`
- Endpoint serverless da Vercel para gravacao de `pageview`, `event` e `form_submission`.
- Injeta geodados quando os headers da Vercel existem.
- Usa `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no ambiente do deploy.

### `supabase/functions/send-contact/index.ts` e `supabase/functions/receive-email/index.ts`
- `send-contact` integra envio de email transacional via Resend.
- `receive-email` persiste emails recebidos em `admin_emails`.
- O fluxo de webhook inbound precisa continuar tratado como superficie sensivel enquanto a validacao de assinatura nao estiver claramente documentada e auditada.

### SEO, analytics e marketing

### `components/Seo.tsx`
- Centraliza `title`, descriptions, keywords, Open Graph, canonical e `hreflang`.
- Trabalha com locale vindo do contexto e aceita override por props.
- E peca estrutural para o objetivo do projeto de rankeamento organico e descoberta por mecanismos de busca com IA.

### `components/TrackingScripts.tsx`
- Carrega scripts dinamicos com base nas tags ativas em `site_tags`.
- Sustenta GTM, GA4, Facebook Pixel, Google Ads e Microsoft Clarity sem hardcode fixo no HTML para cada integracao.

### `src/hooks/useAnalytics.ts`
- Registra page views em `site_page_views` fora da area admin.
- Escuta cliques em links de WhatsApp, grava `whatsapp_click` e publica `dalla_whatsapp_click` em `dataLayer`.
- Exporta `trackFormSubmission()` para formularios e `pushToDataLayer()` para integracoes de marketing.

### `api/sitemap.xml.js`
- Gera sitemap dinamico com alternates PT/EN e cobre rotas estaticas e dinamicas principais.
- Trabalha em conjunto com `vercel.json`, que protege `/sitemap.xml` do fallback generico da SPA.

### Infraestrutura e build

### `vite.config.ts`
- Sobe o servidor local em `0.0.0.0:8080`.
- Expoe `GEMINI_API_KEY` no build via `define`.
- Define alias `@` para a raiz do projeto.
- Separa chunks `vendor`, `supabase`, `tiptap` e `pdf` para reduzir o custo inicial de carregamento.

### `vercel.json`
- Reescreve `/sitemap.xml` para `/api/sitemap.xml`.
- Mantem fallback SPA sem capturar paths de API nem arquivos com extensao.

### Lacunas e riscos conhecidos apos a auditoria
- O projeto nao possui `.env.example` e depende de documentacao manual do ambiente.
- O PIN administrativo historico do projeto foi `1234`; isso deve ser tratado como risco se reaproveitado em qualquer ambiente real.
- Nao foi encontrado rate limiting documentado para `admin` nem para `api/track.js`.
- O fallback multilingual privilegia disponibilidade, nao completude editorial.
- `site_partners` e `site_tags` ainda nao seguem o mesmo modelo de locale das demais tabelas dinamicas.
- Tipos gerados do Supabase podem ficar atrasados em relacao a migrations recentes.

## 2026-04-17 — Internacionalizacao PT-BR / EN

### `src/contexts/LocaleContext.tsx` (novo)
- Exporta: `Locale` (type), `useLocale()` (hook), `LocaleProvider` (component).
- Deteccao de locale em ordem: pathname `/en` → `localStorage.dalla_locale` → `navigator.languages` → `'pt-BR'`.
- `setLocale(locale)`: persiste no localStorage, navega para rota equivalente no outro idioma usando `switchLocaleHref`.
- Redirect automatico na montagem inicial: ocorre uma unica vez por sessao (`sessionStorage.dalla_redirected`). Bots detectados via regex no `navigator.userAgent` sao excluidos do redirect.
- Sincroniza `document.documentElement.lang` a cada mudanca de locale.

### `src/utils/localeRoutes.ts` (novo)
- `PT_TO_EN` / `EN_TO_PT`: mapas de rotas estaticas.
- `switchLocaleHref(currentPath, targetLocale)`: converte qualquer path entre PT e EN. Suporta dinamicos (`/cases/:slug` → `/en/cases/:slug`, `/proposta/:slug` → `/en/proposal/:slug`).
- `detectLocaleFromPath(pathname)`: retorna `'en'` se o path comecar com `/en`, `null` caso neutro.
- `localeCanonical(locale, path)`: retorna URL canonica absoluta por locale.

### `App.tsx` (atualizado)
- `LocaleProvider` importado de `src/contexts/LocaleContext` e adicionado envolvendo `AppRoutes`.
- Arvore de rotas EN: `/en`, `/en/studio`, `/en/methodology`, `/en/cases`, `/en/cases/:slug`, `/en/proposal/:slug`, `/en/lp/:slug`, `/en/contact` — todas com as mesmas paginas lazy-loaded das rotas PT.

### `src/hooks/useSiteTexts.ts` (atualizado)
- Assinatura: `useSiteTexts(defaults, locale?)`.
- Cache keyed por `{locale}:{section_key}` em vez de apenas `section_key`.
- Busca no banco por `(section_key IN [...], locale IN [locale, 'pt-BR'])`.
- Prioridade de valor: banco locale solicitado → banco pt-BR → default hardcoded.
- Usa `(supabase as any)` para contornar tipagem gerada que nao conhece `locale` ainda.

### `src/data/siteCases.ts` (atualizado)
- `SiteCase` interface: adicionados campos opcionais `locale?: string` e `translation_group?: string`.
- `getSiteCases(limit?, locale?)`: filtra por `.eq('locale', locale)`, fallback recursivo para pt-BR.
- `getSiteCaseBySlug(slug, locale?)`: filtra por `locale`, fallback recursivo para pt-BR.

### `src/data/siteLps.ts` (atualizado)
- `getLpBySlug(slug, locale?)`: tenta locale solicitado, fallback pt-BR.
- `listLps(locale?)`: filtra por locale.

### `src/data/siteProposals.ts` (atualizado)
- `SiteProposal` interface: adicionados `locale?` e `translation_group?`.
- `getProposalBySlug(slug, locale?)`: fallback pt-BR automatico.

### `components/Navbar.tsx` (atualizado)
- `NAV_LINKS`: objeto `{ 'pt-BR': [...], 'en': [...] }` com labels e paths por locale.
- `useLocale()` importado para ler e alterar locale.
- Seletor PT|EN no desktop: botoes abaixo do separador, aparencia minimal.
- Seletor PT|EN no mobile: rodape do menu overlay, alinhado a direita dos links sociais.
- `homePath` calculado: `/` em PT, `/en` em EN.
- `useSiteTexts` recebe `locale` como segundo argumento.

### `components/Seo.tsx` (atualizado)
- Nova prop `locale?` (override; default = contexto via `useLocale()`).
- Tags hreflang: gera `<link rel="alternate" hreflang="pt-BR">`, `<link rel="alternate" hreflang="en">` e `<link rel="alternate" hreflang="x-default" href="https://estudiodalla.com/">`.
- `document.documentElement.lang` definido conforme locale em cada render.

### `pages/Home.tsx`, `About.tsx`, `Methodology.tsx`, `Portfolio.tsx`, `Contact.tsx`, `CaseDetails.tsx`, `ProposalDetails.tsx`, `LandingPage.tsx` (atualizados)
- Todos importam `useLocale()` e extraem `locale`.
- `useSiteTexts` recebe `locale` como segundo arg.
- Funcoes de dados (`getSiteCases`, `getSiteCaseBySlug`, `getLpBySlug`, `getProposalBySlug`) recebem `locale`.

### `pages/AdminPanel.tsx` (atualizado)
- `adminLocale: 'pt-BR' | 'en'` adicionado ao state.
- Seletor PT/EN renderizado nas abas Paginas, Cases, Propostas, LPs (toggle com botoes arredondados no topo direito da lista de tabs).
- `loadTexts(locale?)`, `loadCases(locale?)`: aceitam locale como parametro.
- `saveTextField`, `saveAllTexts`, `saveCase`: passam `locale: adminLocale` no payload.
- Interface local `SiteCase` recebeu campos `locale?` e `translation_group?`.
- `normalizeCase` inclui `locale` e `translation_group` normalizados.

### `supabase/functions/admin/index.ts` (atualizado)
- `list_cases`: aceita `data.locale` opcional, aplica filtro `.eq('locale', locale)` quando presente.
- `list_content`: aceita `data.locale` opcional, filtra por locale.
- `upsert_content`: inclui `locale` no payload (default `'pt-BR'`) e usa `onConflict: 'section_key,locale'`.

### `api/sitemap.xml.js` (atualizado)
- 10 rotas EN estaticas adicionadas a `STATIC_PAGES`.
- `buildXml` atualizado: `xmlns:xhtml` adicionado ao urlset. Cada entrada de case e LP gera `<xhtml:link rel="alternate" hreflang>` para PT e EN.

### Migrations novas
- `20260417120000_add_locale_to_site_content.sql`: locale + unique (section_key, locale).
- `20260417120001_add_locale_to_cases_lps_proposals.sql`: locale + translation_group em site_cases, site_lps, site_proposals.
- `20260417120002_seed_en_site_content.sql`: seed EN de chaves SEO, paginas e redes sociais.

## 2026-04-09 — Otimizacao de Performance

### `App.tsx` (atualizado)
- Import de `React.lazy` e `Suspense` adicionados.
- 8 paginas convertidas de import sincrono para `lazy()`: `About`, `Methodology`, `Portfolio`, `Contact`, `Admin`, `CaseDetails`, `ProposalDetails`, `IdentidadeVisual`.
- `Home` permanece sincrona (rota LCP — nao deve ter lazy loading).
- Novo componente `PageLoader` adicionado: spinner CSS puro (border-t-transparent + animate-spin), sem dependencias externas.
- `PublicLayout` agora envolve `{children}` com `<Suspense fallback={<PageLoader />}>`, mantendo Navbar e Footer visiveis durante transicoes de rota.
- `AppRoutes` tambem envolve `<Routes>` com `<Suspense>` para cobrir a rota `/admin` (sem Navbar/Footer).

### `vite.config.ts` (atualizado)
- Adicionado bloco `build` com:
  - `chunkSizeWarningLimit: 500`
  - `rollupOptions.output.manualChunks`:
    - `vendor`: react, react-dom, react-router-dom
    - `supabase`: @supabase/supabase-js
    - `tiptap`: @tiptap/react, @tiptap/starter-kit, @tiptap/extension-underline
    - `pdf`: html2canvas-pro, jspdf
  - Nota: `@tiptap/pm` excluido do manualChunks pois nao possui entry point raiz.

### `pages/About.tsx` (atualizado)
- Removido import quebrado `import lipePhoto from '@/assets/lipe-dalla-rosa.jpeg'` (arquivo inexistente — bug preexistente).
- Fallback de `expertPhotoUrl` alterado para `''`. Em producao, a URL dinamica do Supabase e sempre fornecida via `useSiteTexts`.
- Correcao desbloqueou o build de producao.

## 2026-04-04 Dinamizacao completa de conteudo editavel via Admin

### `pages/About.tsx` (atualizado)
- 3 novos campos dinamicos via `useSiteTexts`:
  - `about_vision_video_url`: URL do video da secao Visao (default: `/lovable-uploads/dalla-teaser.mov`)
  - `about_bottom_image_url`: URL da imagem inferior/GIF (default: `/lovable-uploads/logo-giratoria-2.gif`)
  - `about_expert_role`: Cargo do especialista (default: `Designer & Fundador`)
- Todos os textos, imagens e SEO da pagina /estudio sao agora 100% editaveis no Admin.

### `pages/Home.tsx` (atualizado)
- Cases na Home agora sao dinamicos: importa `getSiteCases(5)` e renderiza com layout preservado (2+1+2).
- Parceiros na Home agora sao dinamicos: importa `getSitePartners()` de `src/data/sitePartners.ts`.
- Removidos todos os dados hardcoded de cases e parceiros.

### `src/data/sitePartners.ts` (novo)
- Interface `SitePartner`: id, name, logo_url, link_url, display_order, is_visible.
- `getSitePartners()`: Busca parceiros visiveis ordenados por `display_order` de `site_partners` com fallback local (10 parceiros).

### `supabase/migrations/20260404120000_create_site_partners.sql` (novo)
- Tabela `site_partners` com colunas: id (uuid PK), name, logo_url, link_url, display_order, is_visible, created_at, updated_at.
- RLS habilitado com leitura publica para anon e authenticated.
- Seed dos 10 parceiros originais hardcoded.

### `pages/AdminPanel.tsx` (atualizado)
- Aba "Parceiros" com CRUD completo: nome, URL do logo (com preview), link de destino, ordem, visibilidade.
- **Reestruturacao da gestao de conteudo:**
  - Removidas abas "Textos" (flat com 14 secoes colapsaveis) e "Hero" (separada).
  - Nova aba "Paginas" com 6 cards: Home, Estudio, Metodologia, Portfolio, Contato, Geral.
  - Cada pagina tem 3 sub-abas: SEO, Textos, Imagens.
  - Hero video fields integrados em Home > Imagens (hero state + saveHero reaproveitados).
  - Previews de imagem/video para campos de URL na sub-aba Imagens.
  - Botao "Salvar Todos" mostra contagem de campos alterados por pagina.
- `TextSection` + `TEXT_SECTIONS` substituidos por `PageConfig` + `PAGE_CONFIGS`.
- `PageConfig` interface: id, label, icon, seo[], textos[], imagens[], hasHero?.
- Estado `openSections`/`toggleSection` removidos. Adicionados `selectedPage` (string|null) + `pageSubTab` ('seo'|'textos'|'imagens').
- Tab type: `'dashboard' | 'cases' | 'media' | 'paginas' | 'proposals' | 'tags' | 'leads' | 'parceiros'`.

### `supabase/functions/admin/index.ts` (atualizado)
- 3 novas actions para parceiros:
  - `list_partners`: Lista todos parceiros ordenados por `display_order`.
  - `upsert_partner`: Cria ou atualiza parceiro com `updated_at`.
  - `delete_partner`: Remove parceiro por ID.

### `components/Footer.tsx` (atualizado)
- Links de redes sociais agora dinamicos via `useSiteTexts` (chaves `social_instagram`, `social_linkedin`, `social_behance`).
- Links so renderizam se a URL existir (condicional).
- Logo do footer agora dinamico via chave `footer_logo_url`.

### `components/Navbar.tsx` (atualizado)
- Redes sociais no menu mobile agora dinamicas via `useSiteTexts`.

### `pages/Contact.tsx` (atualizado)
- Redes sociais na sidebar agora dinamicas via `useSiteTexts`.

## 2026-04-02 Correcao do Grafico de Analytics no Dashboard

### `pages/AdminPanel.tsx` (atualizado)
- Adicionado `emptyAnalyticsSummary` para estado padrao seguro dos dados de dashboard.
- Adicionada funcao `normalizeAnalyticsSummary(raw)` para normalizar o payload retornado da action `analytics_summary`.
  - Garante coercao numerica de KPIs (`total_page_views`, `whatsapp_clicks`, `form_submissions`).
  - Normaliza listas `top_pages` e `top_regions` para evitar quebra de renderizacao por tipos inesperados.
  - Normaliza `daily_views` com suporte a variacoes de chave (`daily_views` e `dailyViews`).
- `loadDashboard()` agora trata `result.error` explicitamente, exibe feedback ao usuario e evita render com shape invalido.

### `supabase/functions/admin/index.ts` (atualizado)
- Action `analytics_summary` reforcada para consolidar visualizacoes de pagina de duas fontes:
  - `site_page_views`
  - `site_events` com `event_type = "page_view"`
- Essa consolidacao evita dashboard vazio quando o tracking real foi gravado em pipeline alternativo/legado.
- Agregacao de `top_pages` e `daily_views` recebeu fallback para `page_path` e `created_at` nulos.
- `total_page_views` passa a refletir o total consolidado (`pageViewRows.length`).

### Validacao
- `get_errors` executado nos arquivos alterados: sem erros.
- `npm run build` executado: falha por problema preexistente e nao relacionado (asset ausente `assets/lipe-dalla-rosa.jpeg` importado em `pages/About.tsx`).

## 2026-04-02 Restauracao do Sitemap Dinamico

### `vercel.json` (atualizado)
- Rewrite de fallback SPA endurecido para nao interceptar caminhos com extensao:
  - Antes: `/((?!api/).*)`
  - Depois: `/((?!api/|.*\..*).*)`
- Com essa regra, `sitemap.xml` e outros assets/arquivos com extensao nao sao enviados para `index.html`.
- Rewrite dedicado `/sitemap.xml -> /api/sitemap.xml` permanece prioritario.

### `public/sitemap.xml` (removido)
- Arquivo legado removido do repositrio para eliminar qualquer ambiguidade entre sitemap estatico e dinamico.
- Fonte canonica do sitemap passa a ser apenas `api/sitemap.xml.js`.

### Validacao executada
- `npm run build` concluido com sucesso.
- Teste em producao durante a sessao indicou que a release ativa ainda serve o conteudo legado (comentario `DEPRECATED`), portanto a correcao depende de novo deploy para entrar em vigor.

## Components

### `Navbar.tsx`
- Navigation bar with desktop pill layout and mobile overlay menu.
- Exports `Navbar` component accepting `onNavigate` callback and `currentPage` string.
- Includes internal `DallaLogo` SVG subcomponent.
- Manages `isMenuOpen` state for mobile menu.

### `ContactSection.tsx`
- Reusable contact form section present on many pages.
- Contains title (editable via admin `cta_section_title`), social icon placeholders, and a stylized form with inputs.
- Uses `useSiteTexts` hook for dynamic title content.
- Form is fully functional: state management, onSubmit calls `trackFormSubmission()` from `useAnalytics`. Shows success feedback after submission. Also pushes `dalla_lead_form_submit` to `dataLayer` on success.

### `Footer.tsx`
- Site footer with contact information, social links, legal links, and copyright.
- Displays `dalla-logo-footer.png` from public uploads.
- Uses `useSiteTexts` hook for dynamic contacts and copyright text.
- Includes external attribution block "Powered by iasin." in the copyright column, linking to `https://iasin.dev.br` in a new tab.
- Attribution entrance animation is one-time (non-loop) using utility classes (`animate-in`, `fade-in-0`, `slide-in-from-bottom-2`).

### `Seo.tsx` 📈
- New utility component added for SEO metadata management.
- Accepts props: `title`, `description`, `keywords`, `image`, `url`.
- On render it updates `document.title`, creates/updates `<meta>` tags for description, keywords and Open Graph properties, and maintains a canonical `<link>`.
- Designed to be included early in page components; ensures mobile‑first, keyword‑rich metadata.
- Now loads SEO defaults dynamically from `site_content` table (keys: `seo_default_title`, `seo_default_description`, `seo_default_keywords`). Falls back to hardcoded defaults.
- Updated to enforce absolute URLs for share metadata (`https://estudiodalla.com`) and always manage robust social tags: `og:url`, `og:site_name`, `og:image` (with fallback), `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.

### `RichTextEditor.tsx` (new)
- Reusable rich text editor component based on TipTap.
- Toolbar: Bold (B), Italic (I), Underline (U).
- Props: `value: string` (HTML), `onChange: (html: string) => void`, `placeholder?: string`, `minHeight?: string`.
- Outputs clean HTML. Used in AdminPanel Textos tab.
- Disabled heading/codeBlock/blockquote extensions to keep output simple.

### `TrackingScripts.tsx`
- Component that fetches active tags from `site_tags` table (public read) and injects corresponding tracking scripts into `document.head`.
- Supports: GA4 (`gtag.js`), GTM (`gtm.js` + noscript iframe), Facebook Pixel (`fbevents.js` + noscript img), Google Ads (reuses gtag if loaded).
- Cleanup on unmount removes all injected script/noscript elements.
- Mounted once in `App.tsx` inside `BrowserRouter`, runs on all pages.
- **Microsoft Clarity (2026-03-29)**
  - Adicionada função `injectClarity` em `TrackingScripts.tsx` para injetar o script do Microsoft Clarity dinamicamente, apenas se houver uma tag ativa do tipo `clarity` na tabela `site_tags`.
  - O componente garante que o script não será injetado mais de uma vez, mesmo que existam múltiplas tags ou seeds repetidos.
  - Migration SQL criada para seed inicial da tag Clarity (`20260329120000_seed_clarity_tag.sql`).
  - Não há duplicidade de script: se já existe uma tag ativa, não injeta novamente.

## Pages

### `App.tsx`
- Root component managing page state and routing.
- Renders `Navbar`, the current page from switch, and `Footer`.
- Implements scroll-to-top effect on page change.
- Detects `#admin` hash to render Admin page without Navbar/Footer.

### `About.tsx` (atualizado em 2026-04-02)
- Nova secao institucional inserida antes do bloco "O que nos move.", com fundo preto e layout premium.
- Estrutura responsiva mobile-first:
  - Mobile: foto vertical e texto empilhados.
  - Desktop: grid 2 colunas (foto a esquerda, texto a direita).
- Conteudo da secao convertido para modo editavel via `useSiteTexts` com as chaves:
  - `about_expert_badge`
  - `about_expert_title`
  - `about_expert_p1`
  - `about_expert_p2`
  - `about_expert_p3`
  - `about_expert_photo_url`
- Campos foram adicionados em `AdminPanel.tsx` na aba `Textos > Sobre`, permitindo editar texto e imagem sem deploy.
- Conteudo default aplicado conforme briefing:
  - "Especialista em marcas"
  - "Lipe Dalla-Rosa Designer & Fundador"
  - Tres paragrafos institucionais sobre repertorio pessoal, atuacao em branding e visao estrategica.
- Imagem usada: `/lovable-uploads/WhatsApp%20Image%202026-04-02%20at%2015.10.19.jpeg` com `alt` descritivo, `loading="lazy"` e sanitizacao por `encodeURI` para evitar quebra com URLs contendo espacos.

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
- Includes identical dataLayer instrumentation (`dalla_lead_form_submit`) for the top-level form as in `ContactSection.tsx`.

### `Admin.tsx`
- Admin entry point. Manages session state (PIN stored in sessionStorage with 30min expiry).
- Renders `AdminLogin` if not authenticated, `AdminPanel` if authenticated.

### `AdminLogin.tsx`
- PIN-based login screen with visual numpad (mobile-first).
- Verifies PIN via edge function `admin` with action `verify`.
- Shows 4-dot indicator for PIN entry progress.

### `AdminPanel.tsx`
- Admin dashboard with tabs: Dashboard, Leads, Cases, Midia, Hero, Propostas, Tags, Textos.
- **Leads tab:** Dedicated view of all form submissions from `site_form_submissions`. Summary cards (total leads, last 7 days, last 30 days). Full table with columns: Nome, Telefone, E-mail, Empresa, Serviço (with readable labels mapped from keys), Página de origem, Data/hora. CSV export button. Service label map: estrategia, identidade_visual, sistema_identidade, branding_lancamento, consultoria.
- **Dashboard tab (default, 7 days):** Period selector (7/30/90 days + custom date range with from/to inputs). KPI cards (total page views, WhatsApp clicks, form submissions) with period_label. SVG area chart for daily views (line + fill + grid). SVG horizontal bar charts for top pages and top regions (graduated opacity). Form submissions table with name, email, company, challenge, date.
- **Cases tab:** List, create, edit, delete cases (title, category, description, cover_url, order, featured, visible).
- **Midia tab:** Upload images/videos to storage bucket `media`, list files, copy public URL, delete.
- **Hero tab:** Manage desktop/mobile hero video URLs and poster image.
- **Propostas tab:** CRUD for commercial proposals with slug auto-generation, footer links, and public toggle.
- **Tags tab:** CRUD for tracking tags (GA4, Facebook Pixel, GTM, Google Ads). Toggle active/inactive per tag. Active tags are injected on the public site via `TrackingScripts` component.
- **Textos tab (new):** Edit all site text content organized by page (Home, Sobre, Metodologia, Portfolio, Contato, Footer, Secao CTA, SEO Padrao, SEO por Pagina — Home/Sobre/Metodologia/Portfolio/Contato). Collapsible sections. Rich text editor for descriptions (bold/italic/underline). Individual save per field or save all at once. Dirty tracking with visual indicators.
- **Case edit form — SEO section (new):** Editable Meta Title, Meta Description, Meta Keywords per case. Placeholder shows fallback values. Data persisted to `site_cases` table.
- **Proposal edit form — SEO section (new):** Editable Meta Title, Meta Description, Meta Keywords, Robots per proposal. Defaults to `noindex, nofollow`. Data persisted to `site_proposals` table.
- All CRUD operations go through edge function `admin` with PIN authentication.

## Edge Functions

### `admin` (supabase/functions/admin/index.ts)
- Serverless function for admin operations.
- Uses service role key to bypass RLS for write operations.
- Actions: `verify` (PIN check), `list_cases`, `upsert_case`, `delete_case`, `list_content`, `upsert_content`, `change_pin`, `list_proposals`, `upsert_proposal`, `delete_proposal`, `list_tags`, `upsert_tag`, `delete_tag`, `analytics_summary`, `list_form_submissions`.
- `analytics_summary`: Returns aggregated analytics (total views, WhatsApp clicks, form count, top pages, top regions, daily views) filtered by `{days: N}` or custom `{from, to}` date range. Returns `period_label` string.
- `list_form_submissions`: Returns latest 50 form submissions ordered by date.
- PIN stored as SHA-256 hash in `admin_settings` table. Default PIN: `1234`.

## Database Tables

### `admin_settings`
- Stores admin PIN hash. Single row. RLS: public read only.

### `site_page_views`
- Stores page view events with path, session_id, referrer, user_agent, country, region, city. RLS: anon insert only, no public select. Indexes on created_at and page_path.
- Migration: `supabase/migrations/20260324140000_create_analytics_tables.sql`.

### `site_events`
- Stores tracked events (e.g. `whatsapp_click`) with event_type, page_path, metadata (jsonb), session_id. RLS: anon insert only.
- Migration: same as above.

### `site_form_submissions`
- Stores contact form submissions with name, email, phone, company, challenge, message, page_path. RLS: anon insert only.
- Migration: same as above.

### `site_cases`
- Portfolio cases with title, category, description, cover_url, display_order, is_featured, is_visible. RLS: public read only.
- **SEO fields (new):** `meta_title`, `meta_description`, `meta_keywords` — optional text columns defaulting to empty string. Used by CaseDetails.tsx with fallback to title/description/category.
- Realtime enabled.
- One-time idempotent import migration created: `supabase/migrations/20260303201000_import_initial_cases.sql`.
- Seed includes: Yerbal, Clave, Nuts O'Clock, Lummina, Dalla, Kuma.

### `site_content`
- Editable site sections identified by `section_key` (unique). Fields: title, subtitle, body, image_url, video_url. RLS: public read only.
- Now stores all editable site texts (50+ keys) used by `useSiteTexts` hook across all pages.
- **Per-page SEO keys (new):** `{page}_seo_title`, `{page}_seo_description`, `{page}_seo_keywords` for Home, About, Methodology, Portfolio, Contact (15 new keys). Managed in AdminPanel Textos tab under dedicated SEO sections.
- Section key naming convention: `{page}_{section}_{field}` (e.g., `home_hero_title`, `about_pillar1_desc`, `method_phase3_title`).
- Seed migration: `supabase/migrations/20260324120000_seed_site_texts.sql`.

## Hooks

### `src/hooks/useSiteTexts.ts` (new)
- Custom hook: `useSiteTexts(defaults: Record<string, string>): Record<string, string>`
- Fetches multiple `site_content` rows by `section_key` in a single query.
- Returns `body` field values mapped by key, falling back to provided defaults if DB value is missing.
- In-memory cache (`Map`) avoids repeated queries across component re-renders.
- Used by all public pages (Home, About, Methodology, Portfolio, Contact) and shared components (Footer, ContactSection, Seo).

### `src/hooks/useAnalytics.ts` (new)
- `useAnalytics()`: Hook that auto-tracks page views on route change and intercepts WhatsApp link clicks globally via `document.addEventListener`. Now also pushes `dalla_whatsapp_click` event to `window.dataLayer`.
- `pushToDataLayer(event, data)`: Utility to send events directly to GTM via `window.dataLayer`.
- `trackPageView(path)`: Sends pageview event to `/api/track`.
- `trackEvent(type, metadata)`: Sends custom event to `/api/track`.
- `trackFormSubmission(data)`: Sends form submission to `/api/track`.
- Uses `navigator.sendBeacon` for non-blocking async delivery. Falls back to `fetch` with `keepalive`.
- Session ID stored in `sessionStorage` for grouping events per visit.
- Skips tracking on `/admin` routes.

### `site_tags`
- Tracking tags managed from admin. Fields: `tag_type` (ga4, gtm, facebook_pixel, google_ads, custom), `tag_id`, `label`, `is_active`. RLS: public read only.
- Migration: `supabase/migrations/20260323120000_create_site_tags.sql`. Seed: GA4 `G-Y63NLTDN61` ativo.

## Storage

### `media` bucket
- Public bucket for images and videos uploaded via admin panel.
- RLS policies: public read, insert, update, delete.

## Other project files

- `index.tsx` and `index.html` bootstrap the React app via Vite.
- `package.json` declares React, TypeScript, Vite, and related dependencies.
- Added media asset: `public/lovable-uploads/kuma-cover.gif`.

*End of documentation.*

## 2026-03-24 Favicon Tematico e OG Share

### `index.html` (atualizado)
- Adicionados favicons por tema do dispositivo com `prefers-color-scheme`:
  - `DALLA_Favicon_ligth.svg.svg` (light)
  - `DALLA_Favicon_dark.svg.svg` (dark)
- Adicionados `apple-touch-icon` por tema e fallback light.
- Adicionadas metas `theme-color` para claro/escuro.
- Link de manifest com id (`site-manifest`) para troca conforme tema detectado.
- Script inline no head escolhe `manifest-light.webmanifest` ou `manifest-dark.webmanifest` no load e escuta mudanca de tema do SO.
- Open Graph/Twitter estaticos reforcados no HTML base para crawlers sem JS:
  - `og:url`, `og:site_name`, `og:image`, `og:image:width`, `og:image:height`
  - `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`

### Manifests (novos)
- `public/manifest-light.webmanifest`
  - `background_color` e `theme_color` claros.
  - icones light 192x192 e 512x512.
- `public/manifest-dark.webmanifest`
  - `background_color` e `theme_color` escuros.
  - icones dark 192x192 e 512x512.

### Impacto esperado
- Favicon e app icon mais coerentes com tema claro/escuro do dispositivo.
- Melhor consistencia de preview em compartilhamentos (WhatsApp, LinkedIn, etc.) por incluir fallback OG no HTML inicial.

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

### `api/track.js` (novo — funcao serverless Vercel)
- Recebe POST com `{ type, data }`. Tipos: `pageview`, `event`, `form_submission`.
- Insere diretamente no Supabase (`site_page_views`, `site_events`, `site_form_submissions`).
- Captura geolocalizacao via headers Vercel (`x-vercel-ip-country`, `x-vercel-ip-region`, `x-vercel-ip-city`).
- Inputs sanitizados e truncados para seguranca.

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
- **SEO fields (new):** `meta_title`, `meta_description`, `meta_keywords`, `meta_robots` (default: `noindex, nofollow`) — optional text columns. Used by ProposalDetails.tsx with fallback to auto-generated title/description.
- Não incluída no sitemap.

### Dependências adicionadas
- `html2canvas-pro` — fork ativo de html2canvas com melhor suporte CSS moderno.
- `jspdf` — geração de PDF client-side.
- Ambas carregadas via dynamic import (code-split) apenas quando o usuário clica "Baixar PDF".

### Validação
- Build de produção executado com sucesso: `npm run build`.

---
## Atualização — Edição multi-locale no Admin (Páginas)
- **`pages/AdminPanel.tsx`**:
  - `loadHero(locale?)` agora aceita locale e filtra `list_content` por idioma.
  - `saveHero` envia `locale: adminLocale` em ambos os `upsert_content` (desktop + mobile).
  - Switcher de idioma (linha ~1045) chama `loadHero(loc)` adicionalmente.
  - Badge visual "Editando: PT" / "Editing: EN" no header da página em edição.
- Resultado: ao trocar para EN, todos os campos (SEO, OG image, textos, hero) carregam a versão EN; ao salvar, gravam na linha EN sem afetar PT.
- Constraint única `(section_key, locale)` em `site_content` garante o upsert correto.


---

## Termômetro de Marca
- **Tabelas Supabase**: `thermometers`, `thermometer_questions`, `thermometer_responses`, `thermometer_answers`.
- **Edge Functions**: 
  - `thermometer-admin` — CRUD protegido por PIN (ações: list, get, upsert, delete, duplicate, responses).
  - `thermometer-submit` — endpoint público que valida slug, insere resposta/notas e dispara 2 e-mails Resend.
- **Página pública**: `pages/Termometro.tsx` em `/termometro/:slug`, mobile-first, com tela de boas-vindas, perguntas full-screen com slider 1–10, coleta de e-mail e celebração (canvas-confetti).
- **Componente admin**: `components/admin/ThermometersTab.tsx` (nova aba 'Termômetros' em AdminPanel).
- **Dependência adicionada**: `canvas-confetti` + `@types/canvas-confetti`.
- **Rotas**: nova rota lazy `/termometro/:slug` em `App.tsx`, fora do PublicLayout; WhatsApp button desabilitado nesta rota.


## Sistema de idiomas (PT/EN) — revisão 2026-05-28
- **components/Footer.tsx, components/ContactSection.tsx**: agora reativos ao `locale` (useLocale + useSiteTexts).
- **src/hooks/useSiteTexts.ts**: exporta `invalidateSiteTextsCache()` e `SITE_CONTENT_INVALIDATE_EVENT`. Cache em memória limpo via CustomEvent quando admin salva.
- **supabase/functions/admin/index.ts**:
  - `list_content` com `locale='en'` mescla chaves PT (cada item recebe `_pt_reference`) — admin sempre vê todos os campos para traduzir.
  - `upsert_content` valida `section_key` e só persiste colunas reais (`section_key, locale, title, subtitle, body, image_url, video_url`).
- **pages/AdminPanel.tsx**: novo state `siteTextsPtRef`, exibe referência PT abaixo de cada campo em modo EN, invalida cache após salvar.

### pages/LpIdentidadeVisual.tsx (IA — 2026-08-28)
Landing page de conversão para Google Ads. Componentes internos: Eyebrow, Cta (scroll suave para `#proposta`).
Eventos dataLayer: `dalla_cta_click`, `dalla_form_start`, `dalla_lead_form_submit`, `dalla_scroll_depth`.
Formulário qualificador (nome, empresa, WhatsApp, e-mail, site/instagram, atuação, necessidade, investimento, prazo)
enviado para a function `send-contact`. Rotas registradas em App.tsx; Navbar/Footer/WhatsApp global ocultos nessa rota.

### LP — parâmetros completos no admin (2026-08-29)
- `TextStyle.lineHeight` (unitless) suportado em `getFieldStyle`/`setFieldStyle` e no popover "Aa".
- `AdminPanel`: `uploadLpMedia`, `uploadLpCaseCover`, `renderLpMedia(field, label, 'image'|'video')`.
- Novas chaves de estilo da LP: `method_phase_id|label|title|desc`, `benefits_item_title|desc`, `cases_item_title|category`.

### LP — numbers_items / hero_images
Campos JSONB em site_lps editáveis no AdminPanel (seções 1 e 2 do editor de LPs) e renderizados em pages/LandingPage.tsx com estilos `numbers_value` e `numbers_label`.
