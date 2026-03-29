-- Seed: Microsoft Clarity
insert into public.site_tags (tag_type, tag_id, label, is_active)
values ('clarity', 'w3g2hrqgeq', 'Microsoft Clarity', true)
on conflict do nothing;
