
export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
  impact?: string;
  isFeatured?: boolean;
}

export interface Partner {
  name: string;
  logo?: string;
}

export interface NavLink {
  label: string;
  path: string;
}
