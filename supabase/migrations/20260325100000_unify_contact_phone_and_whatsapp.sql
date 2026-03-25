-- Unifica telefone e WhatsApp para o mesmo valor em textos e CTAs.

UPDATE site_content
SET body = 'CURITIBA / BR / PR<br />TEL +55 42 9 9915 3814<br />Central Office<br />TEL +44 20 7946 0000'
WHERE section_key = 'contact_info';

UPDATE site_content
SET body = 'CURITIBA / PARANA / BR<br />TEL +55 42 9 9915 3814<br />CENTRAL OFFICE<br />TEL +44 20 7946 0000'
WHERE section_key = 'footer_contacts';

UPDATE site_cases
SET cta_url = regexp_replace(
  cta_url,
  'phone=[0-9]+',
  'phone=5542999153814'
)
WHERE cta_url ILIKE '%whatsapp.com%phone=%';
