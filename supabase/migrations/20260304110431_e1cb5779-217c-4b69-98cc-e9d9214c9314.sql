UPDATE public.site_cases 
SET 
  description = 'A Yerbal nasce da fusão entre a força natural da erva-mate e a ideia de uma energia de outro planeta. O símbolo do alien representa o mistério, a descoberta e o poder de algo "fora do comum", assim como a sensação única que a mateína proporciona. A identidade visual traduz essa proposta com cores contrastantes que expressam vitalidade e um ícone alienígena que conecta a bebida a uma energia cósmica, surpreendente.',
  gallery_urls = '["/lovable-uploads/yerbal-7.png","/lovable-uploads/yerbal-1.png","/lovable-uploads/yerbal-2.png","/lovable-uploads/yerbal-3.png","/lovable-uploads/yerbal-4.png","/lovable-uploads/yerbal-5.png","/lovable-uploads/yerbal-6.png","/lovable-uploads/yerbal-8.png","/lovable-uploads/yerbal-9.png","/lovable-uploads/yerbal-10.gif","/lovable-uploads/yerbal-11.png","/lovable-uploads/yerbal-12.png","/lovable-uploads/yerbal-13.png","/lovable-uploads/yerbal-14.gif"]'::jsonb,
  updated_at = now()
WHERE slug = 'yerbal';