

## Objetivo
Otimizar `robots.txt` e `sitemap.xml` para SEO + GEO (busca generativa), bloquear toda a área `/admin` e variações, e entregar um sitemap perfeito para o Google Search Console com `hreflang` correto em todas as URLs (PT + EN).

## 1. `public/robots.txt` — versão otimizada

- **Bloquear** rotas administrativas e técnicas: `/admin`, `/admin/*`, `/#admin` (hash não é rastreado, mas mantemos consistência), `/api/`, `/proposta/`, `/proposal/` (propostas são `noindex` por padrão e privadas), e parâmetros UTM via `Disallow: /*?utm_*`.
- **Permitir** explicitamente: `/`, assets estáticos (`*.css`, `*.js`, `*.svg`, `*.png`, `*.jpg`, `*.webp`, `*.mp4`, `*.mov`) — Google precisa renderizar.
- **Bots de busca tradicionais** (Googlebot, Bingbot, Slurp, DuckDuckBot, Yandex): mesmas regras do default.
- **Bots de IA / GEO** (GPTBot, ChatGPT-User, OAI-SearchBot, anthropic-ai, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Gemini, GoogleOther, Applebot-Extended, YouBot, cohere-ai, meta-externalagent, Amazonbot, Bytespider, DiffBot): **Allow `/`** + **Disallow `/admin`** e `/proposta`. Garante visibilidade em respostas generativas (estratégia GEO) preservando privacidade.
- **Bloquear bots agressivos / scrapers irrelevantes**: AhrefsBot, SemrushBot, MJ12bot, DotBot (`Disallow: /`).
- **Crawl-delay**: omitido para Google/Bing (eles ignoram); aplicado apenas para bots agressivos quando aplicável.
- **Host** + **Sitemap** no rodapé:
  ```
  Host: https://estudiodalla.com
  Sitemap: https://estudiodalla.com/sitemap.xml
  ```

## 2. `api/sitemap.xml.js` — versão ideal para Search Console

Correções e melhorias:

**a. URLs estáticas alinhadas ao roteador real**
- Remover entrada legada e adicionar todas as rotas reais (PT + EN) com `hreflang` recíproco em **todas** elas, não só nos cases:
  - `/` ↔ `/en`
  - `/estudio` ↔ `/en/studio`
  - `/metodologia` ↔ `/en/methodology`
  - `/cases` ↔ `/en/cases`
  - `/contato` ↔ `/en/contact`
- `x-default` apontando sempre para a versão PT (mercado primário SP/Brasil).

**b. Cases dinâmicos**
- Buscar do Supabase agrupados por `translation_group` para parear PT↔EN corretamente quando a tradução existir; quando não existir, listar só a versão PT com `hreflang` apontando só para si + `x-default`.
- `lastmod` em formato ISO completo `YYYY-MM-DD` (Search Console exige).
- `priority` 0.9 para featured, 0.7 para demais.

**c. LPs dinâmicas**
- Mesmo tratamento por `translation_group`.
- Atualizar fallback: `identidadevisual` → `identidade-visual` (slug atual conforme correção anterior).

**d. Validade XML para o Search Console**
- Escapar caracteres especiais (`&`, `<`, `>`, `'`, `"`) em todas as URLs antes de inserir.
- Garantir uma URL única por `<loc>` (evitar duplicatas PT/EN no mesmo bloco).
- Cada URL aparece **uma única vez** como `<loc>`, com seus `<xhtml:link rel="alternate">` para todas as variantes.
- Header `Content-Type: application/xml; charset=utf-8` (mantido) + `X-Robots-Tag: noindex` removido (não há).
- Cache: `s-maxage=3600, stale-while-revalidate=86400` (mantido).

**e. Excluir do sitemap**
- Qualquer rota administrativa, propostas (`/proposta/*`, `/en/proposal/*`), `/links`, `/admin*`, `/api/*`.

## 3. Validação

- Buscar `https://estudiodalla.com/sitemap.xml` localmente após deploy → validar XML em https://www.xml-sitemaps.com/validate-xml-sitemap.html.
- Submeter no Google Search Console (`Sitemaps` → `sitemap.xml`).
- Testar `robots.txt` com o Tester do Search Console: `/admin` deve dar `Bloqueado`; `/cases/yerbal` deve dar `Permitido`.

## Arquivos a modificar
- `public/robots.txt`
- `api/sitemap.xml.js`
- `context.md` + `essential.md` (registro obrigatório conforme regras do projeto)

