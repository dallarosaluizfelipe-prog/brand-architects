# Essential Documentation

This document captures details of components, pages, functions, and any code added or modified by AI. It is updated at the end of each cycle of changes.

## Components

### `Navbar.tsx`
- Navigation bar with desktop pill layout and mobile overlay menu.
- Exports `Navbar` component accepting `onNavigate` callback and `currentPage` string.
- Includes internal `DallaLogo` SVG subcomponent.
- Manages `isMenuOpen` state for mobile menu.

### `ContactSection.tsx`
- Reusable contact form section present on many pages.
- Contains title, social icon placeholders, and a stylized form with inputs.

### `Footer.tsx`
- Site footer with contact information, social links, legal links, and copyright.
- Displays `dalla-logo-footer.png` from public uploads.

## Pages

### `App.tsx`
- Root component managing page state and routing.
- Renders `Navbar`, the current page from switch, and `Footer`.
- Implements scroll-to-top effect on page change.
- Detects `#admin` hash to render Admin page without Navbar/Footer.

### `Home.tsx`
- Landing page with hero video, global excellence section, selected portfolio, partners logos, and `ContactSection`.
- Accepts `onNavigate` callback to change pages.
- Currently kept in original visual/content format from the base project (no dynamic case binding).

### `About.tsx`
- About page describing the studio's identity, narrative, values grid, and wide image.
- Ends with `ContactSection`.

### `Methodology.tsx`
- Methodology page illustrating phases of the Dalla design process.
- Renders list of phases and `ContactSection`.

### `Portfolio.tsx`
- Portfolio listing of projects; clicking navigates to case study.
- Accepts `onNavigate` callback.
- Projects are loaded dynamically from Supabase (`site_cases`) via `getSiteCases()`.
- Visibility/order now follows admin-managed fields (`is_visible`, `display_order`).

### `src/data/siteCases.ts`
- Central data access for cases consumed by public pages.
- Exposes `getSiteCases(limit?)` and `SiteCase` interface.
- Reads from `site_cases` (visible items ordered by `display_order`) and falls back to six local seed cases.

### `CaseStudy.tsx`
- Detailed case study template with header, image galleries, impact metrics, and next project link.
- Includes `ContactSection`.

### `Contact.tsx`
- Contact information page with form and details.
- Includes `ContactSection`.

### `Admin.tsx`
- Admin entry point. Manages session state (PIN stored in sessionStorage with 30min expiry).
- Renders `AdminLogin` if not authenticated, `AdminPanel` if authenticated.

### `AdminLogin.tsx`
- PIN-based login screen with visual numpad (mobile-first).
- Verifies PIN via edge function `admin` with action `verify`.
- Shows 4-dot indicator for PIN entry progress.

### `AdminPanel.tsx`
- Admin dashboard with tabs: Cases and Mídia.
- **Cases tab:** List, create, edit, delete cases (title, category, description, cover_url, order, featured, visible).
- **Mídia tab:** Upload images/videos to storage bucket `media`, list files, copy public URL, delete.
- All CRUD operations go through edge function `admin` with PIN authentication.

## Edge Functions

### `admin` (supabase/functions/admin/index.ts)
- Serverless function for admin operations.
- Uses service role key to bypass RLS for write operations.
- Actions: `verify` (PIN check), `list_cases`, `upsert_case`, `delete_case`, `list_content`, `upsert_content`, `change_pin`.
- PIN stored as MD5 hash in `admin_settings` table. Default PIN: `1234`.

## Database Tables

### `admin_settings`
- Stores admin PIN hash. Single row. RLS: public read only.

### `site_cases`
- Portfolio cases with title, category, description, cover_url, display_order, is_featured, is_visible. RLS: public read only.
- Realtime enabled.
- One-time idempotent import migration created: `supabase/migrations/20260303201000_import_initial_cases.sql`.
- Seed includes: Yerbal, Clave, Nuts O'Clock, Lummina, Dalla, Kuma.

### `site_content`
- Editable site sections identified by `section_key` (unique). Fields: title, subtitle, body, image_url, video_url. RLS: public read only.

## Storage

### `media` bucket
- Public bucket for images and videos uploaded via admin panel.
- RLS policies: public read, insert, update, delete.

## Other project files

- `index.tsx` and `index.html` bootstrap the React app via Vite.
- `package.json` declares React, TypeScript, Vite, and related dependencies.
- Added media asset: `public/lovable-uploads/kuma-cover.gif`.

*End of documentation.*
