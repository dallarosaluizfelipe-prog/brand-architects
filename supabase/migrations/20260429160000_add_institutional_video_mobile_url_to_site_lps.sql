-- Add institutional mobile video URL for LP highlight block
ALTER TABLE site_lps
  ADD COLUMN IF NOT EXISTS institutional_video_mobile_url text NOT NULL DEFAULT '';
