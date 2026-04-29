# Context Log

This file records a chronological history of changes, requests, and reasoning for any AI agents interacting with the project. Entries should include date, time, and a brief summary of the action or request.

- **2026-04-29 — LPs: bloco de video institucional entre Hero e primeiro conteudo + edicao no Admin:**
  - **Motivacao:** Usuario solicitou um bloco destacado com video institucional entre o Hero e o primeiro conteudo da LP, com configuracao editavel no painel administrativo.
  - **Escopo definido com o usuario:** Aplicar em todas as LPs (nao apenas `identidade-visual`), com edicao por URL (sem upload) e com fundo proprio separado da secao seguinte.
  - **Evolucao posterior no mesmo dia:** Adicionada tambem opcao de video mobile para o bloco institucional, com fallback automatico entre URLs desktop e mobile.
  - **Banco (`site_lps`):** Nova migration `20260429153000_add_institutional_video_url_to_site_lps.sql` adiciona `institutional_video_url text not null default ''`.
  - **Banco (`site_lps`):** Nova migration `20260429160000_add_institutional_video_mobile_url_to_site_lps.sql` adiciona `institutional_video_mobile_url text not null default ''`.
  - **Tipagem e dados:** `src/integrations/supabase/types.ts` e `src/data/siteLps.ts` atualizados para incluir `institutional_video_url` e `institutional_video_mobile_url` em tipos/interfaces e normalizacao.
  - **Admin (`pages/AdminPanel.tsx`):** Campos `institutional_video_url` e `institutional_video_mobile_url` adicionados em `normalizeLp`, `newLp` e no formulario da aba LPs (secao "Video Institucional"). Persistencia aproveita `saveLp` existente via `upsert_lp`.
  - **Frontend (`pages/LandingPage.tsx`):** Secao condicional "Video Institucional" entre Hero e "Quem Somos" atualizada para suportar fontes desktop/mobile com fallback. O bloco usa `aspect-video` e `<video>` com `autoPlay`, `loop`, `muted`, `playsInline` e `preload="metadata"`.
  - **Locale:** Label do bloco no front respeita idioma atual (`en`/`pt-BR`) e o valor da URL permanece por LP/locale conforme modelo atual de `site_lps`.
  - **Validacao:** `get_errors` sem erros nos arquivos alterados e `npm run build` concluido com sucesso.

- **2026-04-28 — Header desktop: correcao de posicionamento do toggle de idioma:**
  - **Motivacao:** Toggle de idioma estava sobrepondo visualmente o header desktop. Solicitacao: manter na mesma altura, mas separado no canto superior direito.
  - **`components/Navbar.tsx`:** O bloco desktop do `LocaleFlagSwitcher` foi removido de dentro do `nav` central (que usa `md:-translate-x-1/2`) e renderizado como elemento irmao no nivel superior do componente.
  - **Ajuste tecnico aplicado:** Mantido `fixed top-8 right-6` apenas no toggle desktop, agora fora do ancestral transformado para evitar conflito de referencia de posicionamento (`position: fixed` + `transform`).
  - **Separacao visual:** Toggle desktop recebeu container proprio com `nav-blur`, borda e sombra para ficar visualmente isolado do header principal.
  - **Validacao:** `get_errors` sem erros em `Navbar.tsx` e `npm run build` concluido com sucesso.

- **2026-04-22 — SEO/GEO: robots.txt e sitemap.xml otimizados:**
  - **Motivacao:** Garantir indexacao ideal no Google Search Console e visibilidade em motores generativos (GPT, Gemini, Claude, Perplexity), bloqueando area administrativa e propostas privadas.
  - **`public/robots.txt`:** Reescrito. Bloqueia `/admin*`, `/api/`, `/proposta*`, `/proposal*` e parametros UTM/fbclid/gclid. Allow-list para assets estaticos (css/js/svg/png/jpg/webp/mp4/woff). Regras explicitas para Googlebot, Bingbot, Slurp, DuckDuckBot, Yandex e bots de IA/GEO (GPTBot, ChatGPT-User, OAI-SearchBot, anthropic-ai, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Gemini, GoogleOther, Applebot, Applebot-Extended, YouBot, cohere-ai, meta-externalagent, Amazonbot, Bytespider, DiffBot). Bloqueio total para scrapers agressivos (AhrefsBot, SemrushBot, MJ12bot, DotBot, BLEXBot). Diretivas `Host` e `Sitemap` no rodape.
  - **`api/sitemap.xml.js`:** Reescrito. URLs estaticas alinhadas ao roteador real (PT ↔ EN: `/`↔`/en`, `/estudio`↔`/en/studio`, `/metodologia`↔`/en/methodology`, `/cases`↔`/en/cases`, `/contato`↔`/en/contact`). Cases e LPs agrupados por `translation_group` para emitir hreflang reciprocos PT/EN + `x-default` apontando para PT. Caracteres XML escapados via `xmlEscape`. `lastmod` em formato `YYYY-MM-DD`. Fallback de LPs atualizado para slug `identidade-visual`. Propostas, `/links`, `/admin*` e `/api/*` excluidos do sitemap. Cache `s-maxage=3600, stale-while-revalidate=86400` mantido.

- **2026-04-22 - Auditoria completa do projeto e atualizacao da documentacao principal:**
  - **Motivacao:** Usuario solicitou leitura do README, verificacao ampla do projeto e atualizacao da documentacao existente antes de novas instrucoes.
  - **Escopo auditado:** `README.md`, `essential.md`, `context.md`, `package.json`, `App.tsx`, `vite.config.ts`, `vercel.json`, `src/contexts/LocaleContext.tsx`, `src/hooks/useAnalytics.ts`, `api/track.js`, `api/sitemap.xml.js` e `supabase/functions/admin/index.ts`, alem da estrutura geral do workspace.
  - **Constatacoes principais:** O README anterior estava centrado em regras operacionais, mas nao documentava setup, rotas, arquitetura, i18n, Supabase, analytics, deploy nem riscos conhecidos. O codigo atual opera como site React + TypeScript + Vite com backend de dados no Supabase, rotas PT/EN, painel admin por PIN, sitemap dinamico, tracking proprio e deploy em Vercel.
  - **Atualizacao executada em `README.md`:** Reestruturado para servir como documentacao operacional do projeto. Foram adicionadas secoes de visao geral, objetivo do produto, stack, arquitetura, rotas, estrutura do repositorio, setup local, variaveis de ambiente conhecidas, modelo de conteudo dinamico, funcionamento do admin, SEO, internacionalizacao, analytics, deploy, riscos/lacunas e convencoes operacionais preservadas.
  - **Atualizacao executada em `essential.md`:** Inserida nova secao de consolidacao tecnica da documentacao em 2026-04-22, resumindo arquitetura atual, fluxos centrais e lacunas conhecidas para manter a referencia tecnica alinhada ao estado real do codigo.
  - **Achados documentados:** Ausencia de `.env.example`, PIN administrativo inicial historico inseguro, falta aparente de rate limiting, webhook de e-mail sem validacao descrita, possivel defasagem de tipos gerados do Supabase e comportamento de fallback multilingual que pode exibir conteudo PT em rotas EN quando a traducao nao existir.
  - **Validacao prevista:** Conferencia manual da documentacao revisada contra os arquivos-fonte do projeto e revisao de diff para garantir consistencia textual.

- **2026-04-17 — Implementacao completa de internacionalizacao PT-BR / EN:**
  - **Motivacao:** Expansao do site para publico internacional. Usuario solicitou versao em ingles com rotas `/en/`, mantendo portugues como idioma padrao, modelo de dados extensivel, Admin multilingual e SEO internacional completo.
  - **Arquitetura geral:** URLs separadas (`/` = pt-BR, `/en/*` = en). Modelo por linha com coluna `locale` em todas as tabelas dinamicas (sem colunas `_en` hardcoded). Extensivel para novos idiomas.
  - **Fase 0 — Infraestrutura de Locale:**
    - `src/contexts/LocaleContext.tsx` (novo): Provider + hook `useLocale()`. Logica de deteccao: locale na URL -> localStorage `dalla_locale` -> `navigator.languages` -> `pt-BR`. Redirect automatico unico por sessao (sessionStorage), bots detectados pelo user-agent e excluidos. Atualiza `document.documentElement.lang` automaticamente.
    - `src/utils/localeRoutes.ts` (novo): Mapa bidirecional pt <-> en de paths, funcao `switchLocaleHref(path, locale)`, `detectLocaleFromPath(pathname)`, `localeCanonical(locale, path)`. Suporta rotas dinamicas `/cases/:slug`, `/lp/:slug`, `/proposta/:slug`.
    - `App.tsx`: `LocaleProvider` adicionado envolvendo `AppRoutes`. Arvore de rotas `/en/*` criada com todas as paginas publicas (Home, About, Methodology, Portfolio, CaseDetails, Contact, LandingPage, ProposalDetails).
  - **Fase 1 — Migrations:**
    - `20260417120000_add_locale_to_site_content.sql`: ADD COLUMN `locale TEXT DEFAULT 'pt-BR'`, DROP UNIQUE `section_key`, ADD UNIQUE `(section_key, locale)`, INDEX.
    - `20260417120001_add_locale_to_cases_lps_proposals.sql`: ADD `locale` + `translation_group UUID` em `site_cases`, `site_lps`, `site_proposals`. Dados existentes atualizados para `pt-BR`, cada row recebe `translation_group` unico.
    - `20260417120002_seed_en_site_content.sql`: Seed de versoes EN das chaves criticas de SEO, paginas e redes sociais. Tom premium de negocios.
  - **Fase 2 — Camada de dados:**
    - `src/hooks/useSiteTexts.ts`: Aceita `locale` como segundo parametro. Busca por `(section_key, locale)`. Fallback automatico pt-BR -> default hardcoded. Cache keyed por `{locale}:{section_key}`. Usa `(supabase as any)` para contornar tipagem do schema gerado.
    - `src/data/siteCases.ts`: `getSiteCases(limit, locale)` e `getSiteCaseBySlug(slug, locale)` com filtro `.eq('locale', locale)` e fallback automatico para pt-BR.
    - `src/data/siteLps.ts`: `getLpBySlug(slug, locale)` e `listLps(locale)` com mesmo padrao de fallback.
    - `src/data/siteProposals.ts`: `getProposalBySlug(slug, locale)` com fallback pt-BR.
    - Interfaces `SiteCase` e `SiteProposal` receberam campos opcionais `locale` e `translation_group`.
  - **Fase 3 — Roteamento e Navbar:**
    - `components/Navbar.tsx`: `NAV_LINKS` agora e um objeto keyed por locale com labels e paths corretos (PT e EN). Seletor PT|EN adicionado no desktop (separador vertical) e mobile (rodape do menu). `useLocale()` importado. `homePath` calculado conforme locale atual. `useSiteTexts` recebe `locale` como segundo arg.
  - **Fase 4 — Paginas publicas:**
    - `Home.tsx`, `About.tsx`, `Methodology.tsx`, `Portfolio.tsx`, `Contact.tsx`, `CaseDetails.tsx`, `ProposalDetails.tsx`, `LandingPage.tsx`: Todas importam `useLocale()` e passam `locale` para `useSiteTexts` e funcoes de dados.
  - **Fase 5 — Admin multilingual:**
    - `pages/AdminPanel.tsx`: State `adminLocale: 'pt-BR' | 'en'` adicionado. Seletor PT/EN aparece nas abas Paginas, Cases, Propostas, LPs (toggle com botoes estilizados). `loadTexts(locale)`, `loadCases(locale)` aceitam locale. `saveTextField`, `saveAllTexts` e `saveCase` passam `locale` para o backend. Interface local `SiteCase` recebeu `locale?` e `translation_group?`.
    - `supabase/functions/admin/index.ts`: `list_cases` aceita `data.locale` para filtrar. `list_content` aceita `data.locale`. `upsert_content` agora usa `onConflict: 'section_key,locale'` e inclui `locale` no payload.
  - **Fase 6 — SEO internacional:**
    - `components/Seo.tsx`: Prop `locale` adicionada (opcional, fallback para contexto). Gera tags `<link rel="alternate" hreflang>` para pt-BR, en e x-default (`/`). Canonical correto por locale. `document.documentElement.lang` atualizado conforme locale.
    - `api/sitemap.xml.js`: Rotas EN estaticas adicionadas. `buildXml` agora gera `<xhtml:link rel="alternate">` em cada URL de case e LP apontando para PT e EN. `xmlns:xhtml` adicionado ao urlset.
  - **Validacao:**
    - `npx tsc --noEmit`: zero erros.
    - `npm run build`: sucesso. Chunks identicos ao ciclo anterior (sem regressao de performance).

- **2026-04-09 — Otimizacao de performance: code splitting, lazy loading e tracking nao-bloqueante:**
  - **Motivacao:** Auditoria de performance identificou bundle inicial massivo (TipTap 460KB + jsPDF/html2canvas 700KB+ carregados para todos os usuarios), zero code splitting nas rotas e scripts de rastreamento competindo com o render inicial.
  - **Alteracoes aplicadas:**
    - `App.tsx` — 8 paginas convertidas para `React.lazy()` com `Suspense` (About, Methodology, Portfolio, Contact, Admin, CaseDetails, ProposalDetails, IdentidadeVisual). `Home` mantida sincrona por ser o LCP. Adicionado componente `PageLoader` (spinner preto sobre fundo branco). `PublicLayout` envolve children com `Suspense` para manter Navbar/Footer visiveis durante navegacao entre rotas publicas.
    - `vite.config.ts` — Adicionado bloco `build` com `manualChunks`: vendor (react/react-dom/react-router-dom), supabase (@supabase/supabase-js), tiptap (@tiptap/react/@tiptap/starter-kit/@tiptap/extension-underline), pdf (html2canvas-pro/jspdf). Limite de aviso de chunk definido em 500KB.
    - `components/TrackingScripts.tsx` — Revertido para carregamento imediato (requestIdleCallback removido a pedido do usuario).
    - `pages/About.tsx` — Removido import quebrado `@/assets/lipe-dalla-rosa.jpeg` (asset ausente, problema preexistente). Fallback de foto do fundador alterado para string vazia (URL dinamica do Supabase e sempre usada em producao).
  - **Resultado do build (chunks gerados):**
    - About: 7KB | Contact: 6KB | Portfolio: 2KB | Methodology: 4KB | CaseDetails: 3KB | ProposalDetails: 5KB | IdentidadeVisual: 15KB | Admin: 59KB
    - vendor: 48KB | supabase: 174KB | tiptap: 371KB | pdf: 623KB (todos isolados)
    - TipTap e PDF so carregam para usuarios que acessam /admin e /proposta/:slug respectivamente.
  - **Validacao:** Build concluido com sucesso (`npm run build`). Sem erros TypeScript.

- **2026-04-04 14:00** - Reestruturacao da aba de conteudo no Admin Panel:
  - **Motivacao:** Interface flat "Textos" com 14 secoes colapsaveis + aba "Hero" separada nao era intuitiva. Usuario pediu organizacao por pagina.
  - **Mudanca:** Removidas abas "Textos" e "Hero". Criada nova aba "Paginas" com 6 cards (Home, Estudio, Metodologia, Portfolio, Contato, Geral).
  - **Navegacao:** Clicar em uma pagina abre detalhe com 3 sub-abas: SEO, Textos, Imagens.
  - **Hero:** Campos de video hero movidos para Home > Imagens (hero state + saveHero reaproveitados).
  - **Dados:** `TextSection` + `TEXT_SECTIONS` substituidos por `PageConfig` + `PAGE_CONFIGS`. Mesmas section_keys — zero mudancas no banco.
  - **Estado:** `openSections`/`toggleSection` removidos. Adicionados `selectedPage` + `pageSubTab`.
  - **Arquivo alterado:** AdminPanel.tsx. Zero erros TypeScript.

- **2026-04-04 12:00** - Dinamizacao completa de conteudo do site (textos, imagens, SEO) editaveis via Admin:
  - **Motivacao:** Usuario solicitou que todas as imagens e textos, incluindo SEO, sejam conteudos dinamicos editaveis no painel, com atencao especial a pagina /estudio.
  - **Fase 1 — About.tsx completamente dinamica:**
    - Adicionadas 3 novas chaves ao `useSiteTexts`: `about_vision_video_url`, `about_bottom_image_url`, `about_expert_role`.
    - Video da secao Visao, imagem inferior (GIF) e cargo do especialista agora sao editaveis via Admin > Textos > Sobre.
    - 3 novos campos adicionados ao TEXT_SECTIONS do AdminPanel.
  - **Fase 2 — Home: cases dinamicos:**
    - Removidos 5 cases hardcoded (Yerbal, Clave, Nuts O'Clock, Lummina, Dalla).
    - Importado `getSiteCases()` de `src/data/siteCases.ts` para puxar cases do Supabase.
    - Layout preservado: 2 cols + 1 wide + 2 cols usando slicing por index.
  - **Fase 3 — Parceiros editaveis:**
    - Nova migration `20260404120000_create_site_partners.sql`: tabela `site_partners` com RLS publica + seed dos 10 parceiros atuais.
    - Novo arquivo `src/data/sitePartners.ts` com `getSitePartners()` e fallback local.
    - Home.tsx atualizada para consumir parceiros do banco.
    - Nova aba "Parceiros" no AdminPanel com CRUD completo (nome, logo URL, link, ordem, visibilidade).
    - Edge Function `admin/index.ts`: 3 novas actions — `list_partners`, `upsert_partner`, `delete_partner`.
  - **Fase 4 — Redes sociais centralizadas:**
    - Adicionadas chaves `social_instagram`, `social_linkedin`, `social_behance` ao sistema de textos.
    - Nova secao "Redes Sociais" no AdminPanel TEXT_SECTIONS.
    - Navbar.tsx, Footer.tsx e Contact.tsx atualizados para consumir URLs de redes sociais do banco. Links so aparecem se a URL existir (condicional).
  - **Fase 5 — Footer logo dinamico:**
    - Adicionada chave `footer_logo_url` ao useSiteTexts do Footer.
    - Campo correspondente adicionado no AdminPanel secao Footer.
  - **Arquivos alterados:** About.tsx, Home.tsx, Contact.tsx, Navbar.tsx, Footer.tsx, AdminPanel.tsx, admin/index.ts.
  - **Arquivos criados:** `supabase/migrations/20260404120000_create_site_partners.sql`, `src/data/sitePartners.ts`.
  - **Validacao:** Zero erros TypeScript. Zero erros de lint.

- **2026-04-02 16:40** - Correcao do bug no grafico do Dashboard (dados reais nao renderizavam):
  - **Motivacao:** Usuario reportou que o grafico da aba Dashboard nao refletia dados reais de analytics.
  - **Alteracoes aplicadas:**
    - `pages/AdminPanel.tsx` — adicionada normalizacao do payload de analytics (`normalizeAnalyticsSummary`) com fallback seguro para evitar quebra de renderizacao quando a resposta vier com formato inesperado ou erro.
    - `pages/AdminPanel.tsx` — tratamento explicito de erro de `analytics_summary` com feedback visual via `showMessage`, evitando estado inconsistente em `dashData`.
    - `supabase/functions/admin/index.ts` — `analytics_summary` passou a consolidar page views de duas fontes (`site_page_views` + eventos `site_events` com `event_type = page_view`) para suportar pipelines legados/alternativos e exibir dados reais no grafico.
    - `supabase/functions/admin/index.ts` — adicionados guards para `page_path` e `created_at` nulos durante agregacao diaria.
  - **Validacao:**
    - Verificacao de erros nos arquivos alterados: sem erros.
    - Build local falhou por causa preexistente e nao relacionada: asset ausente `assets/lipe-dalla-rosa.jpeg` importado por `pages/About.tsx`.

- **2026-04-02 16:05** - Secao do fundador na pagina Estudio convertida para conteudo editavel (texto + imagem):
  - **Motivacao:** Usuario solicitou que a nova secao adicionada antes de "O que nos move." fosse totalmente editavel no painel.
  - **Alteracoes aplicadas:**
    - `pages/About.tsx` — bloco "Especialista em marcas" passou a consumir `useSiteTexts()` para badge, titulo, 3 paragrafos e URL da foto.
    - `pages/About.tsx` — adicionada chave `about_expert_photo_url` com `encodeURI` no `src` para suportar URLs com espacos sem quebrar renderizacao.
    - `pages/AdminPanel.tsx` — adicionados 6 campos na secao "Sobre" da aba Textos:
      - `about_expert_badge`
      - `about_expert_title`
      - `about_expert_p1`
      - `about_expert_p2`
      - `about_expert_p3`
      - `about_expert_photo_url`
  - **Fluxo de edicao:** Conteudos editados em Admin > Textos > Sobre e salvos via `site_content` (action `upsert_content`).
  - **Validacao:** Build executado com sucesso (`npm run build`).

- **2026-04-02 15:30** - Nova secao institucional na pagina Estudio (antes de "O que nos move."):
  - **Solicitacao:** Adicionar bloco com fundo preto, foto vertical a esquerda e texto institucional do fundador a direita.
  - **Alteracao aplicada em `pages/About.tsx`:**
    - Inserida nova `<section>` entre a secao "Criado com uma visao de precisao." e a secao de pilares.
    - Layout responsivo mobile-first: pilha unica no mobile e grid em 2 colunas no desktop (foto esquerda / texto direita).
    - Foto configurada com path URL-encoded: `/lovable-uploads/WhatsApp%20Image%202026-04-02%20at%2015.10.19.jpeg`.
    - Conteudo textual inserido conforme briefing: "Especialista em marcas", nome/cargo e 3 paragrafos institucionais.
  - **Validacao:** Build executado com sucesso (`npm run build`).

- **2026-04-02 10:40** - Correcao de roteamento do sitemap para restaurar comportamento dinamico esperado:
  - **Motivacao:** Usuario reportou que `/sitemap.xml` deixou de funcionar como esperado no passado. Diagnostico apontou conflito potencial entre rewrite especifico do sitemap e fallback SPA amplo no deploy Vercel.
  - **Alteracoes aplicadas:**
    - `vercel.json` — rewrite SPA alterado de `/((?!api/).*)` para `/((?!api/|.*\\..*).*)` para impedir captura de paths com extensao (ex.: `.xml`) e preservar prioridade do rewrite `/sitemap.xml` -> `/api/sitemap.xml`.
    - `public/sitemap.xml` — arquivo legado removido definitivamente do workspace para eliminar ambiguidade entre sitemap estatico e dinamico.
  - **Validacoes executadas:**
    - Build local concluido com sucesso (`npm run build`).
    - Verificacao HTTP em producao mostrou que o dominio ainda responde com o conteudo legado estatico (comentario `DEPRECATED`) na release atual, confirmando necessidade de novo deploy para publicar esta correcao.
  - **Resultado esperado apos deploy:** `https://estudiodalla.com/sitemap.xml` deve retornar XML dinamico gerado pela funcao serverless (`api/sitemap.xml.js`) em vez do legado estatico.

- **2026-03-30 15:00** - Removida aba E-mail do AdminPanel + Fix definitivo do Dashboard:
  - Removidos estados, função `loadEmails`, tab button e bloco JSX da aba E-mail (infraestrutura backend mantida para uso futuro).
  - Dashboard fix: removido `setDashData(null)` que causava flash. Adicionado overlay semi-transparente "Atualizando..." durante reload. Adicionada `key` dinâmica ao gráfico SVG para forçar re-render ao trocar período.
  - **Arquivos modificados:** `AdminPanel.tsx`, `context.md`, `essential.md`.

- **2026-03-30 14:00** - Fix Dashboard + Aba E-mail no Admin:
  - **Bug corrigido:** Dashboard não atualizava visualmente ao mudar período. Causa: `dashData` não era resetado antes do reload e botão "Atualizar" não passava os parâmetros do período atual.
  - **Nova aba "E-mail":** Criada infraestrutura para leitura de e-mails no painel admin via webhook (tabela `admin_emails`, Edge Function `receive-email`, UI de listagem e visualização detalhada).
  - **Arquivos modificados:** `AdminPanel.tsx`, `supabase/functions/admin/index.ts`, `supabase/functions/receive-email/index.ts`.

- **2026-03-29 12:00** - Aba "Leads" no Admin Panel + Validação do fluxo de e-mail:
  - **Motivação:** Centralizar visualização de leads no painel admin e validar envio de e-mails.
  - **Alterações:**
    - `pages/AdminPanel.tsx`: Nova aba "Leads" adicionada ao painel admin com tabela completa (Nome, Telefone, E-mail, Empresa, Serviço com labels legíveis, Página de origem, Data/hora), cards de resumo (total, últimos 7 e 30 dias), botão de exportar CSV.
    - Configurada secret `RESEND_API_KEY` para ativar envio de e-mails via Resend.
    - Edge function `send-contact` reimplantada.
  - **Impacto:** Admin agora tem visão completa dos leads com exportação. E-mails de contato enviados para lipe@estudiodalla.com.

- **2026-03-27 18:00** - Centralização do rastreamento no GTM para Google Ads:
  - **Motivacao:** Implementar eventos dataLayer confiáveis no front-end para capturar leads via formulário (conversão primária) e cliques no WhatsApp (conversão secundária), evitando falsos positivos e duplicidade de tags.
  - **Alterações:**
    - `src/hooks/useAnalytics.ts`: Adicionado utilitário `pushToDataLayer` que acessa `window.dataLayer`. Listener de cliques em links do WhatsApp atualizado para disparar o evento `dalla_whatsapp_click`.
    - `components/ContactSection.tsx`: Form submission atualizado com o disparo de `dalla_lead_form_submit` pro dataLayer apenas dentro do bloco try após sucesso do disparo interno.
    - `pages/Contact.tsx`: Mesma lógica de validação de `dalla_lead_form_submit` implementada para o formulário principal da página de contato.
  - **Impacto:** Permite configuração precisa de Enhanced Conversions no Google Tag Manager em conjunto com as tags nativas.

- **2026-03-25 16:00** - SEO editavel no Admin Panel:
  - **Motivacao:** Permitir edicao rapida de meta title, meta description e meta keywords por pagina, por case e por proposta, tudo refletindo no front.
  - **Phase 1 — SEO por Pagina (aba Textos):** Adicionadas 5 secoes colapsaveis "SEO — Home/Sobre/Metodologia/Portfolio/Contato" ao TEXT_SECTIONS do AdminPanel, com 3 campos cada (title, description, keywords). Usa `site_content` existente, zero mudanca no backend. Todas as 5 paginas publicas (Home, About, Portfolio, Methodology, Contact) atualizadas para consumir SEO dinamico via `useSiteTexts` com valores atuais como fallback.
  - **Phase 2 — SEO por Case (aba Cases):** Nova migration `20260325160000_add_seo_columns.sql` adicionando `meta_title`, `meta_description`, `meta_keywords` em `site_cases`. Secao "SEO do Case" adicionada ao form de edicao no AdminPanel com placeholders indicando fallback. CaseDetails.tsx atualizado para usar campos meta com fallback para title/description/category.
  - **Phase 3 — SEO por Proposta (aba Propostas):** Mesma migration adiciona `meta_title`, `meta_description`, `meta_keywords`, `meta_robots` (default: `noindex, nofollow`) em `site_proposals`. Secao "SEO da Proposta" adicionada ao form de edicao com 4 campos (incl. robots). ProposalDetails.tsx atualizado para usar campos meta.
  - **Arquivos alterados:** AdminPanel.tsx, Home.tsx, About.tsx, Portfolio.tsx, Methodology.tsx, Contact.tsx, CaseDetails.tsx, ProposalDetails.tsx, siteCases.ts, siteProposals.ts, supabase/types.ts, nova migration SQL.
  - **Validacao:** `npx tsc --noEmit` sem erros.

- **2026-03-24 18:10** - Rodape com atribuicao "Powered by" para parceiro externo:
  - **Motivacao:** Solicitação do usuário para mencionar no final do rodape um "Powered by" com marca e link para outro site.
  - **Alteracao em `components/Footer.tsx`:** Adicionado bloco na coluna de copyright com texto "Powered by" + wordmark "iasin." clicavel para `https://iasin.dev.br`.
  - **Comportamento:** Link externo abre em nova aba (`target="_blank"`, `rel="noreferrer"`).
  - **Animacao:** Entrada unica com classes utilitarias (`animate-in`, `fade-in-0`, `slide-in-from-bottom-2`, `duration-700`) sem loop continuo.
  - **Responsividade:** Mantida estrutura mobile-first existente (grid 1/2/4 colunas) sem alterar layout principal do footer.

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

- **2026-03-29 15:00** - Integração Microsoft Clarity via Supabase:
  - **Motivação:** Solicitação do usuário para instalar Microsoft Clarity sem duplicidade de script.
  - **Alterações:**
    - Adicionada função `injectClarity` em `TrackingScripts.tsx` para injetar o script do Clarity apenas se houver uma tag ativa do tipo `clarity` na tabela `site_tags`.
    - Migration SQL criada para seed inicial da tag Clarity (`20260329120000_seed_clarity_tag.sql`).
    - Lógica garante que o script não será injetado mais de uma vez, mesmo que existam múltiplas tags ou seeds repetidos.
  - **Validação:** Não há duplicidade de script Clarity no site. Documentação atualizada em essential.md.

---
## 2026-04-22 14:06 — Fix: Edição de conteúdo em EN não persistia
**Pedido:** Ao trocar para EN no admin (aba Páginas) e editar campos, as alterações não eram salvas.
**Causa:** `loadHero` e `saveHero` não passavam o locale (sempre liam/gravavam pt-BR). O switcher de idioma também não recarregava o Hero.
**Fix:**
- `loadHero(locale)` e `saveHero` agora propagam `adminLocale` em todas as chamadas `upsert_content` / `list_content`.
- Switcher de idioma chama `loadHero(loc)` ao trocar.
- Adicionado badge "Editando: PT" / "Editing: EN" no header da página em edição para deixar claro qual versão está sendo salva.
- Edge function `admin/upsert_content` já usava `onConflict: section_key,locale` (constraint única adicionada na migration anterior).
- Cobre todas as páginas (Home, Estúdio, Método, Portfolio, Contato, Geral) pois usam o mesmo handler `saveTextField`/`saveAllTexts` que já incluía locale.
