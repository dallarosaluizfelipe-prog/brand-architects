import { supabase } from "@/src/integrations/supabase/client";

export interface SitePartner {
  id?: string;
  name: string;
  logo_url: string;
  link_url: string;
  display_order: number;
  is_visible: boolean;
}

const fallbackPartners: SitePartner[] = [
  { name: "Nuts O'Clock", logo_url: "/lovable-uploads/partner-1.png", link_url: "/cases/nuts-oclock", display_order: 1, is_visible: true },
  { name: "Yerbal", logo_url: "/lovable-uploads/partner-2.png", link_url: "/cases/yerbal", display_order: 2, is_visible: true },
  { name: "Lummina", logo_url: "/lovable-uploads/partner-3.png", link_url: "/cases/lummina", display_order: 3, is_visible: true },
  { name: "Parceiro 4", logo_url: "/lovable-uploads/partner-4.png", link_url: "/cases", display_order: 4, is_visible: true },
  { name: "Parceiro 5", logo_url: "/lovable-uploads/partner-5.png", link_url: "/cases", display_order: 5, is_visible: true },
  { name: "Parceiro 6", logo_url: "/lovable-uploads/partner-6.png", link_url: "/cases", display_order: 6, is_visible: true },
  { name: "Parceiro 7", logo_url: "/lovable-uploads/partner-7.png", link_url: "/cases", display_order: 7, is_visible: true },
  { name: "Parceiro 8", logo_url: "/lovable-uploads/partner-8.png", link_url: "/cases", display_order: 8, is_visible: true },
  { name: "Parceiro 9", logo_url: "/lovable-uploads/partner-9.png", link_url: "/cases", display_order: 9, is_visible: true },
  { name: "Parceiro 10", logo_url: "/lovable-uploads/partner-10.png", link_url: "/cases", display_order: 10, is_visible: true },
];

export async function getSitePartners(): Promise<SitePartner[]> {
  try {
    const { data, error } = await supabase
      .from("site_partners")
      .select("*")
      .eq("is_visible", true)
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return fallbackPartners;
    return data as SitePartner[];
  } catch {
    return fallbackPartners;
  }
}
