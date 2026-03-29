

## Plano: Aba "Leads" no Admin + Validação do E-mail

### Situação atual
- O painel admin já carrega e exibe leads na aba Dashboard (seção "Últimos Formulários Recebidos"), mas de forma resumida
- A tabela `site_form_submissions` já armazena `name`, `email`, `phone`, `company`, `challenge` (serviço) e `page_path`
- A edge function `send-contact` já envia e-mail para `lipe@estudiodalla.com` via Resend
- O `trackFormSubmission` em `useAnalytics.ts` já salva `page_path` via `window.location.pathname`

### Alterações

**1. AdminPanel.tsx — Adicionar aba "Leads"**
- Adicionar `'leads'` ao tipo do state `tab` e ao array de tabs
- Criar seção dedicada com tabela completa de leads contendo:
  - Nome, Telefone, E-mail, Empresa, Serviço buscado (com label legível), Página de origem (`page_path`), Data/hora
  - Cards de resumo no topo (total de leads, leads últimos 7 dias, últimos 30 dias)
  - Botão para exportar/copiar dados
- Carregar leads ao entrar na aba (reutilizar `loadFormSubmissions` existente)
- Mapa de labels para os valores de serviço (estrategia → "Estratégia de marca", etc.)
- Design mobile-first consistente com as outras abas

**2. Validar fluxo de e-mail**
- O formulário do footer (`ContactSection.tsx`) e da página de contato (`Contact.tsx`) já chamam `supabase.functions.invoke('send-contact', { body: form })` que envia para `lipe@estudiodalla.com`
- A secret `RESEND_API_KEY` precisa estar configurada — verificaremos se existe
- Nenhuma alteração de código necessária no fluxo de e-mail, apenas validação

**3. Documentação**
- Atualizar `context.md` e `essential.md` com a nova aba

### Arquivos modificados
- `pages/AdminPanel.tsx` — nova aba "Leads" com tabela completa e resumo
- `context.md` — registro da alteração
- `essential.md` — documentação do componente

