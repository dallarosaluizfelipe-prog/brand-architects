-- Add institutional video URL for LP highlight block between hero and first content
ALTER TABLE site_lps
  ADD COLUMN IF NOT EXISTS institutional_video_url text NOT NULL DEFAULT '';
