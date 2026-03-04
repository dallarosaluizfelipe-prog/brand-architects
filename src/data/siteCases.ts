import { supabase } from "@/src/integrations/supabase/client";

export interface SiteCase {
  id?: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  cover_url: string;
  gallery_urls: string[];
  author: string;
  case_date: string;
  external_url: string;
  cta_text: string;
  cta_url: string;
  display_order: number;
  is_featured: boolean;
  is_visible: boolean;
}

const fallbackCases: SiteCase[] = [
  {
    slug: "yerbal",
    title: "Yerbal",
    category: "Branding  -   Identidade Visual   -   Embalagem",
    description:
      "A Yerbal nasce da fusão entre a força natural da erva-mate e a ideia de uma energia de outro planeta. O símbolo do alien representa o mistério, a descoberta e o poder de algo \"fora do comum\", assim como a sensação única que a mateína proporciona. A identidade visual traduz essa proposta com cores contrastantes que expressam vitalidade e um ícone alienígena que conecta a bebida a uma energia cósmica, surpreendente.",
    cover_url: "/lovable-uploads/yerbal-cover.gif",
    gallery_urls: [
      "/lovable-uploads/yerbal-7.png",
      "/lovable-uploads/yerbal-1.png",
      "/lovable-uploads/yerbal-2.png",
      "/lovable-uploads/yerbal-3.png",
      "/lovable-uploads/yerbal-4.png",
      "/lovable-uploads/yerbal-5.png",
      "/lovable-uploads/yerbal-6.png",
      "/lovable-uploads/yerbal-8.png",
      "/lovable-uploads/yerbal-9.png",
      "/lovable-uploads/yerbal-10.gif",
      "/lovable-uploads/yerbal-11.png",
      "/lovable-uploads/yerbal-12.png",
      "/lovable-uploads/yerbal-13.png",
      "/lovable-uploads/yerbal-14.gif",
    ],
    author: "Studio Dalla",
    case_date: "2025-01-01",
    external_url: "https://estudiodalla.com/yerbal",
    cta_text: "Quero uma marca nesse nivel",
    cta_url:
      "https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0",
    display_order: 1,
    is_featured: true,
    is_visible: true,
  },
  {
    slug: "clave",
    title: "Clave",
    category: "Branding  -   Identidade Visual   -   Embalagem",
    description:
      "A Clave Cafés Especiais nasceu da união entre duas paixões herdadas de gerações: o café e a música. Mais do que uma marca, é um convite a transformar o simples ato de tomar café em um ritual sensorial, que envolve aroma, sabor e melodia. Cada detalhe da produção é cuidadosamente conduzido — do cultivo à torra — para entregar cafés de alta qualidade, que carregam em si história, tradição e afeto. A Clave surge para criar uma comunidade que valoriza pausas significativas, encontros genuínos e a inspiração que só a arte e o café podem proporcionar.\n\nA identidade visual traduz esse universo de forma autêntica e envolvente. O design se apoia em elementos musicais e em composições gráficas que evocam ritmo, harmonia e pausa, conectando diretamente com o nome e o propósito da marca. A paleta de cores, a tipografia e o símbolo reforçam a sensação de sofisticação acessível, aconchego e modernidade — atributos fundamentais para se destacar no mercado de cafés especiais. Essa construção visual não apenas diferencia a Clave de seus concorrentes, como também materializa sua essência: arte em forma de café.",
    cover_url: "/lovable-uploads/7eb64c92-69f8-4c75-8d27-c09dcc336dfb.png",
    gallery_urls: [
      "/lovable-uploads/clave-1.png",
      "/lovable-uploads/clave-2.png",
      "/lovable-uploads/clave-3.png",
      "/lovable-uploads/clave-4.png",
      "/lovable-uploads/clave-5.gif",
      "/lovable-uploads/clave-6.png",
      "/lovable-uploads/clave-7.png",
      "/lovable-uploads/clave-8.png",
      "/lovable-uploads/clave-9.gif",
      "/lovable-uploads/clave-10.png",
    ],
    author: "Studio Dalla",
    case_date: "2025-02-01",
    external_url: "https://estudiodalla.com/clave",
    cta_text: "Quero uma marca nesse nivel",
    cta_url:
      "https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0",
    display_order: 2,
    is_featured: true,
    is_visible: true,
  },
  {
    slug: "nuts-oclock",
    title: "Nuts O'Clock",
    category: "Branding  -   Identidade Visual   -   Embalagem",
    description:
      "Com uma Identidade Visual ousada, a Nuts O'Clock traz sabor e saude para o dia a dia, combinando nuts, chocolate e ingredientes naturais em uma marca memoravel.",
    cover_url: "/lovable-uploads/nuts-oclock-cover.gif",
    gallery_urls: ["/lovable-uploads/nuts-oclock-cover.gif"],
    author: "Luiz Felipe Dalla-Rosa",
    case_date: "2025-03-01",
    external_url: "https://estudiodalla.com/projeto-identidade-visual-nuts-oclock",
    cta_text: "Quero uma marca nesse nivel",
    cta_url:
      "https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0",
    display_order: 3,
    is_featured: true,
    is_visible: true,
  },
  {
    slug: "lummina",
    title: "Lummina",
    category: "Branding  -   Identidade Visual   -   Embalagem",
    description:
      "Com uma Identidade Visual inovadora, a Lummina reforca bem-estar e sofisticacao em uma linha de velas aromaticas criada para experiencias sensoriais de marca.",
    cover_url: "/lovable-uploads/lummina-cover.png",
    gallery_urls: ["/lovable-uploads/lummina-cover.png"],
    author: "Luiz Felipe Dalla-Rosa",
    case_date: "2025-04-01",
    external_url: "https://estudiodalla.com/projeto-identidade-visual-luminna",
    cta_text: "Quero uma marca nesse nivel",
    cta_url:
      "https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0",
    display_order: 4,
    is_featured: true,
    is_visible: true,
  },
  {
    slug: "dalla",
    title: "Dalla",
    category: "Branding  -   Identidade Visual",
    description:
      "Case institucional do Studio Dalla com exploracao de posicionamento, narrativa visual e consistencia de marca em ambientes digitais e editoriais.",
    cover_url: "/lovable-uploads/dalla-cover.gif",
    gallery_urls: ["/lovable-uploads/dalla-cover.gif"],
    author: "Studio Dalla",
    case_date: "2025-05-01",
    external_url: "https://estudiodalla.com/estudio-dalla-identidadevisual",
    cta_text: "Quero uma marca nesse nivel",
    cta_url:
      "https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0",
    display_order: 5,
    is_featured: true,
    is_visible: true,
  },
  {
    slug: "kuma",
    title: "Kuma",
    category: "Branding  -   Identidade Visual   -   Ilustracao",
    description:
      "Identidade da Kuma Jiu-Jitsu desenvolvida para comunicar forca, disciplina e personalidade, com recursos visuais aplicaveis em produtos e comunicacao da marca.",
    cover_url: "/lovable-uploads/kuma-cover.gif",
    gallery_urls: ["/lovable-uploads/kuma-cover.gif"],
    author: "Luiz Felipe Dalla-Rosa",
    case_date: "2025-06-01",
    external_url: "https://estudiodalla.com/projeto-identidade-visual-kuma-jiu-jitsu",
    cta_text: "Quero uma marca nesse nivel",
    cta_url:
      "https://api.whatsapp.com/send/?phone=5542999153814&text=Ola%2C+quero+falar+sobre+um+projeto+de+branding&type=phone_number&app_absent=0",
    display_order: 6,
    is_featured: true,
    is_visible: true,
  },
];

const normalizeCase = (item: any): SiteCase => ({
  id: item.id,
  slug: item.slug ?? "",
  title: item.title ?? "",
  category: item.category ?? "",
  description: item.description ?? "",
  cover_url: item.cover_url ?? "",
  gallery_urls: Array.isArray(item.gallery_urls) ? item.gallery_urls : [],
  author: item.author ?? "",
  case_date: item.case_date ?? "",
  external_url: item.external_url ?? "",
  cta_text: item.cta_text ?? "",
  cta_url: item.cta_url ?? "",
  display_order: item.display_order ?? 0,
  is_featured: !!item.is_featured,
  is_visible: item.is_visible !== false,
});

export const getSiteCases = async (limit?: number): Promise<SiteCase[]> => {
  let query = supabase
    .from("site_cases")
    .select("*")
    .eq("is_visible", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    return limit ? fallbackCases.slice(0, limit) : fallbackCases;
  }
  return data.map(normalizeCase);
};

export const getSiteCaseBySlug = async (slug: string): Promise<SiteCase | null> => {
  const { data, error } = await supabase
    .from("site_cases")
    .select("*")
    .eq("slug", slug)
    .eq("is_visible", true)
    .maybeSingle();

  if (error) {
    return fallbackCases.find((item) => item.slug === slug) ?? null;
  }

  if (!data) {
    return fallbackCases.find((item) => item.slug === slug) ?? null;
  }

  return normalizeCase(data);
};
