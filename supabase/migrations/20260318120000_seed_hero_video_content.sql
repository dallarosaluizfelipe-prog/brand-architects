-- Seed hero video entries in site_content for admin-controlled hero videos
-- Idempotent: uses ON CONFLICT to avoid duplicates

INSERT INTO site_content (section_key, title, video_url, image_url)
VALUES (
  'hero_video_desktop',
  'Hero Video Desktop',
  '/lovable-uploads/abertura-site.mp4',
  '/lovable-uploads/2fdb741b-7706-4fa8-b5f2-dda301d0572d.png'
)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO site_content (section_key, title, video_url)
VALUES (
  'hero_video_mobile',
  'Hero Video Mobile',
  '/lovable-uploads/abertura-site-mobile.mp4'
)
ON CONFLICT (section_key) DO NOTHING;
