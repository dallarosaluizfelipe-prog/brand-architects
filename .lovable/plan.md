# Revisão completa do sistema de idiomas (PT/EN)

## Diagnóstico

Investiguei o fluxo ponta-a-ponta e identifiquei **4 problemas reais** que explicam por que ajustar textos em PT/EN no admin não reflete corretamente no site:

### Problema 1 — Componentes que ignoram o idioma ativo
`Footer.tsx` e `ContactSection.tsx` chamam `useSiteTexts(defaults)` **sem passar o `locale`** atual. Resultado: independente da URL (`/` ou `/en`), esses blocos sempre carregam `pt-BR`. Todas as outras páginas (Home, About, Contact, Methodology, Portfolio, Navbar) já passam `locale` corretamente.

### Problema 2 — Admin EN não lista chaves ainda não traduzidas
Hoje o banco tem **65 chaves em PT** e apenas **21 em EN**. Quando o admin troca para "EN", a função `list_content` retorna **só as 21 linhas EN existentes** — então **44 campos somem da tela**, impossibilitando traduzir o que ainda não existe.

O esperado: ao editar EN, mostrar **todas** as chaves (PT + EN mescladas), com o valor PT exibido apenas como placeholder/referência e o input vazio (ou EN existente) pronto para preencher.

### Problema 3 — Cache do front-end de 60s sem invalidação após salvar
`useSiteTexts` mantém cache em memória com TTL de 60s. Depois de salvar uma alteração no admin, o site público continua exibindo o conteúdo antigo até o TTL expirar **ou** até um full reload. Mesmo dentro do próprio admin, abrir o preview pode mostrar texto desatualizado.

### Problema 4 — Payload de `upsert_content` carrega campos extras
A edge function faz `payload = { ...data, locale, updated_at }`. Como `data` pode trazer campos não pertencentes à tabela (ex.: chaves enviadas por engano pelo front), isso pode causar falhas silenciosas no insert/update. Vamos sanitizar para apenas: `section_key, locale, title, subtitle, body, image_url, video_url, updated_at`.

---

## Mudanças propostas

### 1. `components/Footer.tsx` e `components/ContactSection.tsx`
- Importar `useLocale`, ler `locale` e passar como 2º argumento de `useSiteTexts(defaults, locale)`.

### 2. `supabase/functions/admin/index.ts` — action `list_content`
- Quando `data.locale === 'en'`, retornar a **união** das chaves: para cada `section_key` existente em PT, retornar a linha EN (se houver) ou uma linha "virtual" `{ section_key, locale: 'en', body: '', _pt_reference: <valor pt> }`.
- Quando `data.locale === 'pt-BR'`, comportamento atual.

### 3. `supabase/functions/admin/index.ts` — action `upsert_content`
- Sanitizar `payload` para apenas as colunas reais da tabela. Logar e retornar erro explícito caso `section_key` esteja vazio.

### 4. `pages/AdminPanel.tsx` — UI da aba "Páginas"
- Em modo EN, exibir abaixo do label de cada campo uma linha pequena em cinza `Original PT: "<valor pt>"` (somente leitura) usando `_pt_reference`, para o usuário saber o que está traduzindo.
- Após `saveTextField`/`saveAllTexts`, disparar `window.dispatchEvent(new CustomEvent('site-content:invalidate'))`.

### 5. `src/hooks/useSiteTexts.ts` — invalidação de cache
- Adicionar listener para `site-content:invalidate`: limpar `cache` e refazer fetch.
- Garantir que ao trocar `locale` no app o hook refaça a busca (já depende de `[keys.join(','), locale]` — ok).

### 6. Validação final
- Smoke test manual no preview:
  - PT: salvar `footer_copyright`, recarregar `/`, conferir.
  - EN: salvar `home_cases_subtitle` em EN, navegar `/en`, conferir.
  - Trocar idioma sem reload e ver Footer/Contato atualizarem.

---

## Detalhes técnicos

```text
list_content (locale='en') retorna:
[
  { section_key: 'hero_title', locale: 'en', body: 'Hello', _pt_reference: 'Olá' },
  { section_key: 'about_pillar1_desc', locale: 'en', body: '', _pt_reference: 'Atendimento...' }, // virtual
  ...
]
```

```ts
// useSiteTexts.ts (trecho novo)
useEffect(() => {
  const invalidate = () => { cache.clear(); /* trigger refetch */ };
  window.addEventListener('site-content:invalidate', invalidate);
  return () => window.removeEventListener('site-content:invalidate', invalidate);
}, []);
```

## Arquivos a alterar
- `components/Footer.tsx`
- `components/ContactSection.tsx`
- `src/hooks/useSiteTexts.ts`
- `supabase/functions/admin/index.ts`
- `pages/AdminPanel.tsx`
- `context.md` / `essential.md` (registro obrigatório)

## Fora de escopo
- Não toco em rotas, navegação ou `LocaleContext`.
- Não altero estrutura de tabelas — apenas lógica de leitura/escrita.
- Não mexo em termômetro, propostas, LPs nem cases (já têm fluxo próprio de locale).

## Pergunta antes de executar
A linha de referência PT no admin EN (`Original PT: "..."`) deve ser exibida **abaixo de cada campo** ou prefere **acima** do input? Default proposto: **abaixo**, em texto pequeno cinza.
