

## Problem
When editing content in the Admin panel with locale switched to EN, changes don't persist. Root cause: the admin upsert flow ignores the current locale selector — it always writes to `pt-BR` rows (or fails silently because the upsert key doesn't include locale properly).

## Investigation Plan
Before writing code, I need to confirm exactly where the locale is dropped. I'll inspect:

1. `pages/AdminPanel.tsx` — how the locale selector state is wired into save handlers for the "Páginas" tab (Home, About, Methodology, Portfolio, Contact, General SEO).
2. `supabase/functions/admin/index.ts` — the `upsert_content` action: does it accept and use a `locale` parameter, and does the upsert `onConflict` target `(section_key, locale)`?
3. `src/hooks/useSiteTexts.ts` — already locale-aware on read (good), so the fix is purely on write.
4. The unique constraint added in the last migration (`site_content_section_key_locale_unique`) — confirm it exists so upsert with `onConflict: 'section_key,locale'` works.

## Fix Plan

### 1. Admin Panel (`pages/AdminPanel.tsx`)
- Ensure the **locale selector** in the "Páginas" tab is read by every save handler for site content (hero, sections, SEO fields, OG image).
- Pass `locale` explicitly in every `upsert_content` payload sent to the edge function.
- When the user switches locale in the admin, **reload the form fields** for that locale (fetching the matching rows from `site_content` filtered by `locale`), so they edit the right version instead of overwriting PT values.
- Show a clear visual indicator ("Editando: Português" / "Editing: English") on each page card so the user knows which version they're saving.

### 2. Edge Function (`supabase/functions/admin/index.ts`)
- Update `upsert_content` to:
  - Accept `locale` in the payload (default `'pt-BR'` only if missing).
  - Validate locale is one of `'pt-BR' | 'en'`.
  - Upsert with `onConflict: 'section_key,locale'` — relies on the unique constraint added previously.
- Apply the same fix to any related actions (e.g. `upsert_seo`, `upsert_og_image`) that touch `site_content`.

### 3. Coverage across all pages
The same `upsert_content` path is used by every "Páginas" sub-tab (Home, Estúdio, Método, Portfolio, Contato, Geral, plus SEO and OG image fields). Fixing the handler centrally makes EN editing work for **all of them at once**. I'll verify by listing every save call site in `AdminPanel.tsx` and confirming each forwards `locale`.

### 4. LPs and Cases (bonus consistency check)
`site_lps` and `site_cases` already have a `locale` column + `translation_group`. I'll verify their admin save handlers also forward the active locale (they likely do, since these tables were designed with locale from the start), and patch any that don't.

### 5. Validation
- Switch admin to EN, edit a Home hero title, save → reload `/en` and confirm the new EN title appears.
- Switch back to PT, confirm PT version is untouched.
- Repeat for: About, Methodology, Portfolio, Contact, OG image upload, SEO meta fields.

## Technical details
- Table `site_content` has unique `(section_key, locale)` — already in place from last migration.
- Read path (`useSiteTexts`) already falls back EN → PT → defaults, so partial EN translations degrade gracefully.
- No schema changes needed; this is purely a client + edge function wiring fix.
- No data migration needed; existing PT rows stay; new EN rows are created on first save per key.

## Files to modify
- `pages/AdminPanel.tsx` — wire locale into every save + reload form on locale switch + add "Editing: <locale>" indicator.
- `supabase/functions/admin/index.ts` — accept and use `locale` in `upsert_content` (and related actions).
- `context.md` + `essential.md` — log the fix per project rules.

