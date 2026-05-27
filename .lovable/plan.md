## Parte 1 — E-mail opcional ao concluir o Termômetro

### UX (pages/Termometro.tsx)
Tela `email`:
- Campo de e-mail deixa de ser `required`.
- Dois botões empilhados:
  1. **"Receber meu resultado"** (primário, `accent`) — habilita só com e-mail válido.
  2. **"Pular e finalizar"** (secundário, link discreto `text-neutral-500 underline`) — envia sem e-mail.
- Ambos chamam `submit(sendEmail: boolean)` e seguem para `celebration` com confete.

### Payload
- Envia `client_email: string | null` e novo flag `send_email: boolean`.
- Valida formato de e-mail só quando `send_email = true`.

### Edge Function (supabase/functions/thermometer-submit/index.ts)
- Aceitar `client_email` opcional e `send_email` booleano.
- Se `send_email = false` ou e-mail vazio: salva `thermometer_responses` (`client_email = ''`) + `thermometer_answers` e **não dispara nenhum e-mail** (nem admin nem cliente).
- Se `send_email = true`: comportamento atual (valida, salva, envia admin + cliente).

## Parte 2 — Detalhamento das respostas no admin

### Hoje
`ThermometersTab.tsx` em "Ver respostas" mostra apenas linha por resposta com e-mail, data e **média**. Sem detalhes das perguntas/notas.

### Mudanças (components/admin/ThermometersTab.tsx)
- Cada linha de resposta vira um **card expansível** (acordeão controlado por estado local `expandedId`).
- Cabeçalho do card mantém: e-mail (ou "Anônimo" quando vazio), data formatada, média.
- Ao expandir, lista por pergunta na ordem original:
  - Texto da pergunta (Instrument Serif).
  - Linha bipolar: `left_label  ←  [barra fina com bolinha na posição value/10]  →  right_label` usando a `accent_color` do termômetro.
  - Nota `X / 10` à direita.
- Perguntas sem resposta exibem "—".
- Botão "Exportar CSV" no topo, gerando arquivo com colunas: e-mail, data, média, e uma coluna por pergunta.

### Edge Function (supabase/functions/thermometer-admin/index.ts)
- Ação `responses` precisa retornar também as **perguntas do termômetro** (id, order_index, question_text, left_label, right_label) para o admin renderizar nomes. Se já retorna, apenas confirmar; se não, adicionar `questions` no payload junto com `responses` e `answers`.

## Restrições
- Sem novas dependências.
- Sem mudanças de schema/RLS.
- Admin segue só com Nunito Sans; corpo das perguntas no detalhe usa Instrument Serif apenas para o texto da pergunta (permitido no admin? — manter Nunito Sans para respeitar memória: tudo no admin em Nunito Sans).
- Mobile-first preservado em ambas as telas.

## Arquivos alterados
- `pages/Termometro.tsx`
- `supabase/functions/thermometer-submit/index.ts`
- `supabase/functions/thermometer-admin/index.ts` (se necessário incluir `questions`)
- `components/admin/ThermometersTab.tsx`
- `context.md`, `essential.md`

## Confirmação
Quando o cliente **pular o e-mail**, o admin **também não recebe** notificação por e-mail (a resposta fica apenas registrada e visível em "Ver respostas"). Confirma?