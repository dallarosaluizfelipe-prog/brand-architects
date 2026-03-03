
-- Insert default PIN (hash of '1234' using md5 for simplicity)
INSERT INTO public.admin_settings (pin_hash) VALUES (md5('1234'));

-- Storage: allow authenticated and anon uploads to media bucket
CREATE POLICY "Allow public upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "Allow public update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media');
CREATE POLICY "Allow public delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media');
