

## Plano: Remover aba E-mail + Corrigir Dashboard

### 1. Remover aba "E-mail" do AdminPanel

**Alteracoes em `AdminPanel.tsx`:**
- Remover `'emails'` do tipo do state `tab` e do array de tabs renderizado (linha 728)
- Remover state de emails: `adminEmails`, `emailsLoading`, `selectedEmail`, interface `AdminEmail` (linhas 269-281)
- Remover funcao `loadEmails` (linhas 604-609)
- Remover chamada `if (t === 'emails') loadEmails()` no click handler (linha 734)
- Remover todo o bloco `{tab === 'emails' && (...)}` (linhas 1088-1149)

**Manter intactos** (nao excluir — podem ser uteis no futuro):
- Tabela `admin_emails` no banco
- Edge Function `receive-email/index.ts`
- Action `list_emails` na Edge Function `admin/index.ts`

### 2. Corrigir gráfico do Dashboard que nao atualiza

**Problema real identificado:** Ao trocar o periodo, o `loadDashboard` chama `setDashData(null)` e depois `setDashData(result)`. O React re-renderiza, porem o grafico SVG (area chart) pode nao parecer diferente se os dados sao similares ou se ha problemas de cache visual do SVG.

**Correcao:**
- Adicionar uma `key` dinamica ao container do grafico baseada no `period_label` + timestamp, forcando React a destruir e recriar o SVG quando os dados mudam
- Adicionar um indicador visual (overlay de loading com opacity) sobre os dados existentes durante o carregamento, em vez de apenas remover tudo com `setDashData(null)` — isso dara feedback mais claro ao usuario
- Alterar a abordagem: em vez de `setDashData(null)`, manter dados antigos visiveis com um overlay de "Atualizando..." semi-transparente, e so substituir quando os novos dados chegarem

**Mudanca especifica:**
- Remover `setDashData(null)` do inicio de `loadDashboard`
- No bloco de renderizacao do dashboard (linha 795), trocar a condicao `dashLoading && !dashData` para mostrar overlay quando `dashLoading` e `true` (independente de `dashData`)
- Adicionar `key={dashData?.period_label}` no wrapper do grafico SVG

### 3. Documentacao
- Atualizar `context.md` e `essential.md`

### Arquivos modificados
- `pages/AdminPanel.tsx` — remover aba emails + fix dashboard
- `context.md`
- `essential.md`

