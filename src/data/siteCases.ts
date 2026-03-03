import { supabase } from "@/src/integrations/supabase/client";

export interface SiteCase {
  id?: string;
  title: string;
  category: string;
  description: string;
  cover_url: string;
  display_order: number;
  is_featured: boolean;
  is_visible: boolean;
}

const fallbackCases: SiteCase[] = [
  {
    title: "Yerbal",
    category: "Branding  -   Identidade Visual   -   Embalagem",
    description: "",
    cover_url: "/lovable-uploads/yerbal-cover.gif",
    display_order: 1,
    is_featured: true,
    is_visible: true,
  },
  {
    title: "Clave",
    category: "Identidade  -   Tipografia",
    description: "",
    cover_url: "/lovable-uploads/7eb64c92-69f8-4c75-8d27-c09dcc336dfb.png",
    display_order: 2,
    is_featured: true,
    is_visible: true,
  },
  {
    title: "Nuts O'Clock",
    category: "Branding  -   Identidade Visual   -   Embalagem",
    description: "",
    cover_url: "/lovable-uploads/nuts-oclock-cover.gif",
    display_order: 3,
    is_featured: true,
    is_visible: true,
  },
  {
    title: "Lummina",
    category: "Branding  -   Identidade Visual   -   Embalagem",
    description: "",
    cover_url: "/lovable-uploads/lummina-cover.png",
    display_order: 4,
    is_featured: true,
    is_visible: true,
  },
  {
    title: "Dalla",
    category: "Branding  -   Identidade Visual",
    description: "",
    cover_url: "/lovable-uploads/dalla-cover.gif",
    display_order: 5,
    is_featured: true,
    is_visible: true,
  },
  {
    title: "Kuma",
    category: "Branding  -   Identidade Visual   -   Ilustracao",
    description: "",
    cover_url: "/lovable-uploads/kuma-cover.gif",
    display_order: 6,
    is_featured: true,
    is_visible: true,
  },
];

const normalizeCase = (item: any): SiteCase => ({
  id: item.id,
  title: item.title ?? "",
  category: item.category ?? "",
  description: item.description ?? "",
  cover_url: item.cover_url ?? "",
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
