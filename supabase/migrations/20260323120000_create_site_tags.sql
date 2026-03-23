-- ============================================================
-- Tabela site_tags: gerenciamento de tags de rastreamento
-- GA4, Facebook Pixel, GTM, Google Ads, Custom
-- ============================================================

create table if not exists public.site_tags (
  id         uuid primary key default gen_random_uuid(),
  tag_type   text not null default 'ga4',
  tag_id     text not null default '',
  label      text not null default '',
  is_active  boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: leitura publica (mesmo padrao das demais tabelas)
alter table public.site_tags enable row level security;

create policy "Public read access for site_tags"
  on public.site_tags for select
  using (true);

-- Seed: GA4 do Studio Dalla ja ativo
insert into public.site_tags (tag_type, tag_id, label, is_active)
values ('ga4', 'G-Y63NLTDN61', 'GA4 Principal', true)
on conflict do nothing;
