# Studio Dalla

## Visao Geral

O projeto e o site institucional e comercial do Studio Dalla, com foco em branding, rebranding, identidade visual e posicionamento de marcas premium. A experiencia precisa transmitir autoridade, clareza estrategica e seguranca para empresas medias e grandes, com forte orientacao a conversao organica e comercial.

Hoje a aplicacao funciona como um site React com conteudo dinamico vindo do Supabase, painel administrativo com autenticacao por PIN, rotas publicas em portugues e ingles, sitemap dinamico, tracking proprio e integracoes de marketing.

## Objetivo de Produto

Ao entrar no site, o cliente deve sentir impacto imediato e confianca. O produto nao deve comunicar apenas apelo visual, mas tambem metodo, maturidade e capacidade de operar marcas em escala. Toda decisao de design, navegacao, copy e SEO deve reforcar esse posicionamento.

## Stack Atual

- Frontend: React 19 + TypeScript + Vite 6
- Roteamento: React Router DOM 7
- Backend de dados: Supabase (Postgres, Storage e Edge Functions)
- Deploy: Vercel
- Editor rich text no admin: TipTap
- Exportacao de proposta: jsPDF + html2canvas-pro
- Analytics e tracking: Microsoft Clarity, dataLayer/GTM e tracking proprio em Supabase
- Build optimization: code splitting manual em chunks `vendor`, `supabase`, `tiptap` e `pdf`
- Plugin de dev: `lovable-tagger` (componentTagger ativo apenas no modo development via Vite)
- Dependencia de producao presente: `claude` ^0.1.1 (origem/proposito a confirmar)

## Arquitetura em Alto Nivel

- `App.tsx` monta `BrowserRouter`, `TrackingScripts`, `LocaleProvider` e a arvore de rotas.
- As paginas publicas usam `PublicLayout` com `Navbar`, `Footer` e `Suspense`. O `WhatsAppFloatingButton` e montado fora do `PublicLayout`, diretamente em `AppRoutes`, e suprimido em rotas que comecem com `/admin` (condicional `!isAdminRoute`).
- O idioma e determinado por URL (`/` e `/en/*`), preferencia persistida em `localStorage` e autodeteccao por idioma do navegador.
- O conteudo principal e lido do Supabase por hooks e modulos em `src/data` e `src/hooks`.
- O painel admin usa a Edge Function `supabase/functions/admin` para verificar PIN e executar CRUD de conteudos, cases, propostas, LPs, parceiros, tags e analytics.
- A API `api/track.js` grava page views, eventos e envios de formulario em tabelas de analytics no Supabase.
- A API `api/sitemap.xml.js` gera sitemap XML dinamico com alternates PT/EN.

## Rotas Publicas e Administrativas

### Portugues

- `/` - Home
- `/estudio` - About
- `/metodologia` - Methodology
- `/cases` - Portfolio
- `/cases/:slug` - detalhe de case
- `/lp/:slug` - landing page dinamica
- `/proposta/:slug` - proposta dinamica
- `/identidade-visual` - redirect para `/lp/identidade-visual`
- `/identidadevisual` - redirect para `/identidade-visual` (alias legado sem hifen)
- `/contato` - contato
- `/admin` - painel administrativo

### Ingles

- `/en` - Home
- `/en/studio` - About
- `/en/methodology` - Methodology
- `/en/cases` - Portfolio
- `/en/cases/:slug` - detalhe de case
- `/en/lp/:slug` - landing page dinamica
- `/en/proposal/:slug` - proposta dinamica
- `/en/contact` - contato

### Redirects legados

- `/about` -> `/estudio`
- `/methodology` -> `/metodologia`
- `/portfolio` -> `/cases`
- `/contact` -> `/contato`
- `/identidadevisual` -> `/identidade-visual` (alias sem hifen, redirecionado antes do redirect de `/identidade-visual`)
- `*` -> `/`

## Estrutura Relevante do Repositorio

- `App.tsx`: composicao global, layouts, lazy loading e roteamento
- `components/`: navegacao, SEO, tracking, footer, CTA e componentes globais
- `pages/`: paginas publicas, pagina admin e painel de gestao. `pages/CaseStudy.tsx` e um arquivo legado sem rota ativa em `App.tsx` — nao e utilizado em producao
- `src/contexts/LocaleContext.tsx`: estado global de locale e redirect inicial
- `src/hooks/`: analytics, textos dinamicos e hooks de apoio
- `src/data/`: leitura de cases, landing pages, propostas e parceiros
- `src/integrations/supabase/`: cliente e tipos do Supabase
- `api/`: serverless functions do deploy Vercel
- `supabase/functions/`: edge functions do Supabase
- `supabase/migrations/`: schema e seeds do banco
- `public/`: manifestos, robots e uploads publicos
- `context.md`: historico cronologico das alteracoes
- `essential.md`: referencia tecnica mantida por IA

## Setup Local

### Frontend

1. Instale dependencias com `npm install`.
2. Configure as variaveis de ambiente necessarias.
3. Rode `npm run dev`.
4. O servidor Vite sobe em `http://0.0.0.0:8080`.

### Scripts disponiveis

- `npm run dev`: ambiente local com Vite
- `npm run build`: build de producao
- `npm run build:dev`: build usando modo development
- `npm run preview`: preview local do build

### Supabase

O projeto depende de tabelas, policies, storage e Edge Functions definidas em `supabase/`. Para reproduzir backend e dados dinamicos localmente, a operacao esperada e:

1. Iniciar o ambiente local do Supabase CLI.
2. Aplicar as migrations da pasta `supabase/migrations/`.
3. Publicar ou rodar localmente as Edge Functions `admin`, `send-contact` e `receive-email`.
4. Garantir que o frontend aponte para a URL e chave corretas do projeto local ou remoto.

O repositorio nao possui hoje um `.env.example`, entao as variaveis abaixo devem ser conferidas diretamente no ambiente em uso.

## Variaveis de Ambiente Conhecidas

### Frontend / Vite

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `GEMINI_API_KEY`

Observacao: `vite.config.ts` expoe `GEMINI_API_KEY` como `process.env.API_KEY` e `process.env.GEMINI_API_KEY` no build.

### Vercel / APIs serverless

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SITE_URL` para canonical, sitemap e links absolutos quando aplicavel

### Supabase Edge Functions

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` para `send-contact`

## Conteudo Dinamico e Modelo Operacional

- `site_content`: textos, imagens, videos e chaves SEO por secao/pagina, agora com locale
- `site_cases`: portfolio e detalhes de case
- `site_lps`: landing pages dinamicas
- `site_proposals`: propostas dinamicas
- `site_partners`: logos e links de parceiros
- `site_tags`: tags de tracking e integracoes
- `site_page_views`, `site_events`, `site_form_submissions`: analytics e conversao
- `admin_settings`: hash do PIN administrativo
- `admin_emails`: caixa de entrada persistida via webhook

O frontend usa fallback agressivo para preservar renderizacao: locale solicitado -> `pt-BR` -> defaults hardcoded. Isso reduz quebra de tela, mas tambem pode expor conteudo em portugues quando a traducao em ingles nao existir.

## Painel Admin

O painel administrativo esta centralizado em `/admin` e depende da Edge Function `admin`.

- Autenticacao: PIN validado por hash SHA-256 contra `admin_settings`
- Persistencia de sessao no frontend: `sessionStorage`, com expiração de 30 minutos. A sessao e armazenada como `{ pin, expires }` e validada a cada carregamento; expirada, e removida automaticamente e o usuario retorna a tela de login
- Escopos atuais do painel: paginas/textos, cases, propostas, LPs, parceiros, tags, leads e dashboard de analytics
- Edicao multilingual: o admin nao tem versao EN, mas permite editar conteudos por locale `pt-BR` e `en`

### Fluxo resumido

1. O usuario informa o PIN na tela admin.
2. O frontend chama `action = verify` na Edge Function.
3. Em caso de sucesso, novas actions usam o mesmo PIN para CRUD e leitura administrativa.
4. O backend valida o PIN em todas as requests antes de operar com service role.

## SEO, Internacionalizacao e Analytics

### SEO

- `components/Seo.tsx` atualiza `title`, `meta`, canonical e Open Graph dinamicamente.
- O projeto usa chaves SEO dinamicas por pagina, case e proposta.
- `api/sitemap.xml.js` gera sitemap dinamico com `hreflang` PT/EN.
- O foco do produto exige copy, estrutura e taxonomia voltadas para descoberta organica e conversao.

### Internacionalizacao

- Locale suportado hoje: `pt-BR` e `en`
- Estrategia: URLs separadas, sem sufixos `_en` no schema
- Deteccao inicial: rota -> preferencia salva -> idioma do navegador
- Primeira visita pode redirecionar automaticamente para `/en` quando o idioma preferido for ingles

### Analytics

O projeto possui dois mecanismos de tracking paralelos e complementares:

**Client-side direto (Supabase JS):**
- `src/hooks/useAnalytics.ts` escreve diretamente nas tabelas Supabase via cliente JS no browser
- Grava page views em `site_page_views` e eventos de clique em `site_events` a cada mudanca de rota
- Intercepta cliques em links de WhatsApp e dispara `dalla_whatsapp_click` no dataLayer
- `pushToDataLayer` publica eventos como `dalla_whatsapp_click` e `dalla_lead_form_submit`

**Serverless via Vercel (api/track.js):**
- Endpoint POST alternativo/complementar que tambem grava em `site_page_views`, `site_events` e `site_form_submissions`
- Suporta os tipos `pageview`, `event` e `form_submission`
- Captura dados geograficos via headers exclusivos da Vercel: `x-vercel-ip-country`, `x-vercel-ip-region` e `x-vercel-ip-city`, armazenados nas colunas `country`, `region` e `city` de `site_page_views`. Esses campos ficam nulos fora do ambiente Vercel (local/dev)

**Outras integrações:**
- O dashboard administrativo consolida `site_page_views` e eventos `page_view`
- Clarity e outras tags dinamicas sao injetadas por `components/TrackingScripts.tsx`

## Deploy

- O deploy principal esta configurado para Vercel.
- `vercel.json` define rewrite para `/sitemap.xml` e fallback SPA sem interceptar arquivos com extensao.
- O frontend depende de envs de Supabase tambem no ambiente Vercel.
- Sempre valide `npm run build` antes de publicar alteracoes de codigo.

## Riscos, Lacunas e Pendencias Documentadas

- Nao existe hoje `.env.example`, o que aumenta atrito de onboarding.
- O PIN administrativo inicial historico do projeto foi `1234`; em producao ele deve ser alterado imediatamente.
- `api/track.js` e a Edge Function `admin` nao documentam rate limiting.
- `receive-email` precisa de validacao de assinatura do webhook se for exposto publicamente.
- `site_partners` e `site_tags` nao seguem hoje o mesmo modelo multilingual das demais tabelas.
- Os tipos gerados do Supabase podem ficar desatualizados em relacao a migrations recentes, especialmente as colunas de locale.
- O fallback de traducao privilegia resiliencia, nao integridade editorial.
- O geotracking depende de headers da Vercel e tende a ficar vazio fora de producao.

## Convencoes Operacionais do Repositorio

- A leitura deste README e obrigatoria antes de qualquer alteracao.
- Toda alteracao deve considerar mobile-first como requisito primario.
- `context.md` deve ser lido antes de trabalhar e atualizado ao fim de cada ciclo relevante.
- `essential.md` deve registrar tudo que for criado ou alterado por IA em nivel tecnico.
- Sempre apresente um plano ao usuario antes de executar alteracoes substanciais, salvo quando ele pedir execucao direta.
- Toda implementacao deve respeitar o design system e sinalizar qualquer desvio.
- O projeto deve manter alto potencial de rankeamento organico para Google e mecanismos de busca com IA.
- Toda alteracao precisa de validacao ao final.
- Tipografia obrigatoria: Nunito Sans para textos e Instrument Serif para titulos e frases de efeito. Evitar italico e nunca usar Instrument Serif em caps lock.

## Quick Links

- AI Studio Project: https://ai.studio/apps/drive/1-5qJIsZZ5GWHtQ-8-K5wpK_XSIRX08rA
- Instagram: https://www.instagram.com/estudiodalla?igsh=dmgzbnRud2NvNnF6&utm_source=qr
- Behance: https://www.behance.net/luizfedalla-r

---

Mantido como fonte principal de onboarding e operacao do projeto. Para historico detalhado, consultar `context.md`. Para detalhamento tecnico incremental, consultar `essential.md`.
