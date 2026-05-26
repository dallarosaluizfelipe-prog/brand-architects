# Termômetro de Marca

Feature completa: questionário bipolar full-screen acessível por link único, gerenciado por nova aba no admin, com envio de e-mail dual (admin + cliente) ao concluir.

## 1. Banco de dados (Supabase)

Nova migration criando 4 tabelas + bucket dedicado:

**`thermometers`**
- `id` uuid PK, `slug` text único, `client_name`, `client_logo_url`, `accent_color` (hex, default `#000000`), `admin_email` (default `lipe@estudiodalla.com`), `welcome_title` text, `is_active` bool default true, `created_at`, `updated_at`.

**`thermometer_questions`**
- `id` uuid PK, `thermometer_id` FK → thermometers (cascade), `order_index` int, `question_text`, `left_label`, `left_icon` (nome Lucide ou emoji), `right_label`, `right_icon`.

**`thermometer_responses`**
- `id` uuid PK, `thermometer_id` FK, `client_email`, `client_name` (opcional, futuro), `completed_at` default now().

**`thermometer_answers`**
- `id` uuid PK, `response_id` FK (cascade), `question_id` FK, `value` int (1–10).

**RLS** (seguindo padrão do projeto — admin opera via PIN/Edge Function service-role; público lê só termômetros ativos e insere respostas):
- `thermometers`: SELECT público quando `is_active = true`.
- `thermometer_questions`: SELECT público (sem filtro — visíveis para qualquer termômetro listado).
- `thermometer_responses` e `thermometer_answers`: INSERT público (anon); sem SELECT/UPDATE/DELETE público.
- Sem políticas de UPDATE/DELETE/INSERT públicas em `thermometers`/`thermometer_questions` — admin grava via Edge Function nova.

**Bucket `media`** já existe e é público → reutilizar para logos do cliente (pasta `thermometers/`).

## 2. Edge Functions

### `supabase/functions/thermometer-admin/index.ts` (nova)
- Protegida por PIN (mesmo padrão da function `admin` atual).
- Ações: `list`, `get`, `upsert` (cria/edita termômetro + substitui perguntas em transação), `delete`, `duplicate`, `responses` (lista respostas com detalhes).
- Usa service-role para bypassar RLS.

### `supabase/functions/thermometer-submit/index.ts` (nova, pública, `verify_jwt = false`)
- Recebe `{ slug, client_email, answers: [{question_id, value}] }`.
- Valida slug ativo, valida email (zod), busca termômetro + perguntas.
- Insere `thermometer_responses` + `thermometer_answers` via service-role.
- Dispara 2 e-mails Resend:
  1. Para `admin_email` do termômetro.
  2. Para `client_email` informado.
- Template HTML inline reaproveitando o estilo do `send-contact` (header preto, corpo branco, serif Georgia para títulos), com: logo do cliente, nome do termômetro, data/hora, lista pergunta + escala visual + valor.

`supabase/config.toml` recebe blocos `verify_jwt = false` para as duas novas functions.

## 3. Rota pública `/termometro/:slug`

Nova página `pages/Termometro.tsx` (lazy-loaded em `App.tsx`, **fora** do `PublicLayout` — sem Navbar/Footer/WhatsApp, igual ao padrão `/admin` e `/links`).

Estados (controle local, sem persistir rascunho):
1. **Tela 0 — Boas-vindas**: logo do cliente + nome + botão "Começar".
2. **Telas de pergunta** (1 por tela, `h-[100dvh]`, sem scroll):
   - Header minúsculo: `2 / 6`.
   - Pergunta em Instrument Serif grande.
   - Slider bipolar 1–10 (input range estilizado + 10 dots clicáveis) com ícones Lucide nos extremos (resolvidos dinamicamente via `lucide-react`; fallback para emoji se string não for ícone válido).
   - Botão "Próxima" aparece após interação; última pergunta → "Continuar".
   - Transição: classe Tailwind controlando `opacity` + `translate-y-4` via state `isTransitioning` (300ms).
3. **Tela final — e-mail**: input + botão "Receber meu resultado" → chama `thermometer-submit`.
4. **Tela celebração**: `canvas-confetti` (nova dep) disparando confetes dourados + brilho via CSS; mensagem central "Parabéns! Agora você está a um passo de ter uma marca de impacto."

Cor de destaque (`accent_color`) aplicada via CSS variable inline no container raiz (`--thermo-accent`), usada nos dots ativos, slider track e botões.

Mobile-first; em telas largas o conteúdo fica centralizado com `max-w-2xl`.

`useAnalytics` já ignora rotas não-admin; manter pageview normal (não bloquear).

## 4. Painel admin — nova aba "Termômetros"

Em `pages/AdminPanel.tsx`:
- Adicionar `'termometros'` ao union `tab` e ao array de abas renderizado em `line 1064`.
- Novo bloco `{tab === 'termometros' && (...)}` com:
  - **Listagem**: grid de cards (nome, mini-logo, contagem de respostas, link `/termometro/<slug>`, botões Editar / Duplicar / Excluir / Copiar Link).
  - **Editor** (modal/painel inline): campos cliente (nome, upload logo no bucket `media/thermometers/`, color picker `accent_color`, `admin_email`, `welcome_title`), lista de perguntas com drag-and-drop simples (botões ↑/↓ — sem nova dep) entre 3 e 12, cada pergunta com texto, label/ícone esquerdo, label/ícone direito (campo texto livre — aceita nome Lucide como "Sparkles" ou emoji).
  - Botão "Salvar" → chama `thermometer-admin` ação `upsert`.
  - Botão "Ver respostas" → modal listando respostas (e-mail, data, médias) via ação `responses`.

Todas chamadas passam `pin` (mesmo padrão das outras chamadas admin já presentes).

## 5. Dependências

- Adicionar `canvas-confetti` + `@types/canvas-confetti` (única dep nova permitida — animação requerida pela spec).
- `lucide-react` já instalado (resolução dinâmica `(LucideIcons as any)[name]`).

## 6. SEO / Rastreamento

- `/termometro/:slug` indexado normalmente; adicionar `<Seo>` com `client_name + " | Termômetro de Marca"` na própria página.
- Bloquear `/termometro/admin*` não se aplica (rota é só por slug); robots permanece como está.

## 7. Documentação obrigatória

- Atualizar `context.md` com data/hora e resumo desta feature.
- Atualizar `essential.md` listando: tabelas novas, edge functions novas, página `Termometro.tsx`, aba admin "Termômetros", dependência `canvas-confetti`.

## Arquivos a criar
- `supabase/migrations/<timestamp>_thermometer.sql`
- `supabase/functions/thermometer-admin/index.ts`
- `supabase/functions/thermometer-submit/index.ts`
- `pages/Termometro.tsx`
- `components/admin/ThermometersTab.tsx` (extraído para não inchar AdminPanel.tsx)

## Arquivos a editar
- `App.tsx` (rota lazy `/termometro/:slug` fora do PublicLayout)
- `pages/AdminPanel.tsx` (aba + render)
- `supabase/config.toml` (verify_jwt das duas functions)
- `package.json` (canvas-confetti)
- `context.md`, `essential.md`

## Restrições respeitadas
- Nenhuma rota/funcionalidade existente alterada.
- Design herda tokens atuais (Instrument Serif títulos, Nunito Sans corpo, preto/branco + accent dinâmica do cliente).
- Apenas 1 nova dep (`canvas-confetti`), justificada pela spec.
- Estrutura de pastas mantida (pages/, components/, supabase/functions/).
