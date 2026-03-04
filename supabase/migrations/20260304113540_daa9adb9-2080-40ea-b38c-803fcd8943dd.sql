UPDATE public.site_cases 
SET 
  gallery_urls = '["/lovable-uploads/clave-1.png","/lovable-uploads/clave-2.png","/lovable-uploads/clave-3.png","/lovable-uploads/clave-4.png","/lovable-uploads/clave-5.gif","/lovable-uploads/clave-6.png","/lovable-uploads/clave-7.png","/lovable-uploads/clave-8.png","/lovable-uploads/clave-9.gif","/lovable-uploads/clave-10.png","/lovable-uploads/clave-11.gif","/lovable-uploads/clave-12.png","/lovable-uploads/clave-13.png","/lovable-uploads/clave-14.png","/lovable-uploads/clave-15.png","/lovable-uploads/clave-16.png","/lovable-uploads/clave-17.png","/lovable-uploads/clave-18.png"]'::jsonb,
  updated_at = now()
WHERE slug = 'clave';