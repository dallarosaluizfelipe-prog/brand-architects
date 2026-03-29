

## Hub de Links — `/links`

### Objetivo
Criar uma página de links (estilo linktree) em `/links` com a identidade visual do Studio Dalla, mobile-first.

### Estrutura da página

```text
┌─────────────────────────┐
│      Logo Dalla         │  (SVG branco, fundo preto)
│   STUDIO DALLA          │  (Instrument Serif, texto menor)
│                         │
│  ┌───────────────────┐  │
│  │ 📱 WhatsApp       │  │  → api.whatsapp.com
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ ✉️  E-mail         │  │  → mailto:contato@estudiodalla.com
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ 📷 Instagram      │  │  → instagram.com/estudiodalla
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ 🎨 Behance        │  │  → behance.net/luizfedalla-r
│  └───────────────────┘  │
│  ┌───────────────────┐  │
│  │ 📘 Facebook       │  │  → facebook (necessário URL)
│  └───────────────────┘  │
│                         │
│      [ Footer ]         │  (rodapé padrão reutilizado)
└─────────────────────────┘
```

### Design
- Fundo preto, links em botões brancos com borda, hover com inversão (fundo branco, texto preto)
- Tipografia: Nunito Sans nos botões, Instrument Serif no subtítulo
- Ícones minimalistas (Lucide React, já disponível no projeto)
- Sem Navbar — página standalone como um linktree
- Footer padrão importado do componente existente
- Mobile-first: botões full-width com `max-w-md mx-auto`

### Arquivos a criar/editar
1. **`pages/Links.tsx`** — nova página com layout descrito
2. **`App.tsx`** — adicionar rota `/links`
3. **`context.md`** — registrar alteração
4. **`essential.md`** — documentar novo componente

### Observação
- A página `/links` não terá Navbar nem bottom tab bar (é standalone)
- O pixel do Facebook não será disparado nesta página se estiver na rota pública (verificar TrackingScripts)
- Preciso da URL do Facebook do estúdio — vou usar um placeholder que você pode substituir

