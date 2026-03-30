

## Plano: Corrigir Dashboard + Alternativa para Leitura de E-mails

### 1. Bug do Dashboard — Período não atualiza visualmente

**Problema identificado:** Quando o dashboard já tem dados carregados, a condição de loading na linha 766 (`dashLoading && !dashData`) nunca é verdadeira novamente, porque `dashData` já existe. Isso faz com que durante o recarregamento os dados antigos continuem visíveis sem indicação clara de que estão atualizando. Além disso, o botão "Atualizar" chama `loadDashboard()` sem argumentos — se o período atual for "custom", os parâmetros `from`/`to` não são passados, e o fallback é `days: 7`.

**Correção em `AdminPanel.tsx`:**
- Adicionar um indicador de loading sobreposto (overlay com opacity) quando `dashLoading` é true, mesmo com dados existentes
- Corrigir o botão "Atualizar" para passar os parâmetros corretos do período atual (incluindo custom range)
- Limpar `dashData` antes de recarregar para forçar feedback visual (`setDashData(null)` no início de `loadDashboard`)

### 2. Leitura de E-mails — Abordagem viável

Integrar diretamente com IMAP de um provedor genérico é frágil. A alternativa proposta:

**Opção A — Encaminhamento automático (recomendada):**
- Criar uma Edge Function `receive-email` que recebe e-mails via webhook (usando Resend Inbound ou serviço similar)
- Configurar encaminhamento automático no provedor de e-mail para um endereço que dispara o webhook
- Armazenar os e-mails em uma nova tabela `admin_emails` (from, subject, body_html, body_text, received_at)
- Criar aba "E-mail" no AdminPanel para listar e visualizar os e-mails recebidos

**Opção B — IMAP direto (instável):**
- Criar Edge Function que conecta via IMAP ao provedor
- Requer credenciais IMAP do provedor
- Limitações de timeout e compatibilidade com Deno

**Recomendação:** Opção A é significativamente mais confiável. Requer configurar um encaminhamento no provedor de e-mail para um endereço Resend Inbound.

### Arquivos a modificar
- `pages/AdminPanel.tsx` — fix do dashboard + nova aba E-mail (se aprovado)
- `supabase/functions/receive-email/index.ts` — nova Edge Function (Opção A)
- Nova migração — tabela `admin_emails`
- `context.md` / `essential.md` — documentação

