export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_emails: {
        Row: {
          body_html: string | null
          body_text: string | null
          created_at: string
          from_address: string
          from_name: string | null
          id: string
          received_at: string
          subject: string
        }
        Insert: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          from_address?: string
          from_name?: string | null
          id?: string
          received_at?: string
          subject?: string
        }
        Update: {
          body_html?: string | null
          body_text?: string | null
          created_at?: string
          from_address?: string
          from_name?: string | null
          id?: string
          received_at?: string
          subject?: string
        }
        Relationships: []
      }
      admin_settings: {
        Row: {
          created_at: string
          id: string
          pin_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          pin_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          pin_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_cases: {
        Row: {
          author: string
          case_date: string | null
          category: string
          cover_url: string | null
          created_at: string
          cta_text: string
          cta_url: string
          description: string | null
          display_order: number
          external_url: string
          gallery_urls: Json
          id: string
          is_featured: boolean
          is_visible: boolean
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          case_date?: string | null
          category?: string
          cover_url?: string | null
          created_at?: string
          cta_text?: string
          cta_url?: string
          description?: string | null
          display_order?: number
          external_url?: string
          gallery_urls?: Json
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          case_date?: string | null
          category?: string
          cover_url?: string | null
          created_at?: string
          cta_text?: string
          cta_url?: string
          description?: string | null
          display_order?: number
          external_url?: string
          gallery_urls?: Json
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          body: string | null
          id: string
          image_url: string | null
          section_key: string
          subtitle: string | null
          title: string | null
          updated_at: string
          video_url: string | null
        }
        Insert: {
          body?: string | null
          id?: string
          image_url?: string | null
          section_key: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          body?: string | null
          id?: string
          image_url?: string | null
          section_key?: string
          subtitle?: string | null
          title?: string | null
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      site_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          page_path: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          page_path?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      site_form_submissions: {
        Row: {
          challenge: string | null
          company: string | null
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          page_path: string | null
          phone: string | null
        }
        Insert: {
          challenge?: string | null
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          page_path?: string | null
          phone?: string | null
        }
        Update: {
          challenge?: string | null
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          page_path?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      site_lps: {
        Row: {
          about_badge: string
          about_cta_text: string
          about_cta_url: string
          about_paragraphs: string[]
          about_title: string
          about_video_url: string
          benefits_badge: string
          benefits_cta_text: string
          benefits_cta_url: string
          benefits_items: Json
          benefits_subtitle: string
          benefits_title: string
          cases_badge: string
          cases_cta_text: string
          cases_cta_url: string
          cases_items: Json
          cases_subtitle: string
          cases_title: string
          created_at: string
          display_order: number
          hero_badge: string
          hero_cta_text: string
          hero_cta_url: string
          hero_poster: string
          hero_subtitle: string
          hero_title: string
          hero_video_desktop: string
          hero_video_mobile: string
          id: string
          is_visible: boolean
          meta_description: string
          meta_keywords: string
          meta_title: string
          method_badge: string
          method_cta_text: string
          method_cta_url: string
          method_phases: Json
          method_subtitle: string
          method_title: string
          partners_badge: string
          partners_cta_text: string
          partners_cta_url: string
          partners_show: boolean
          partners_subtitle: string
          partners_title: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          about_badge?: string
          about_cta_text?: string
          about_cta_url?: string
          about_paragraphs?: string[]
          about_title?: string
          about_video_url?: string
          benefits_badge?: string
          benefits_cta_text?: string
          benefits_cta_url?: string
          benefits_items?: Json
          benefits_subtitle?: string
          benefits_title?: string
          cases_badge?: string
          cases_cta_text?: string
          cases_cta_url?: string
          cases_items?: Json
          cases_subtitle?: string
          cases_title?: string
          created_at?: string
          display_order?: number
          hero_badge?: string
          hero_cta_text?: string
          hero_cta_url?: string
          hero_poster?: string
          hero_subtitle?: string
          hero_title?: string
          hero_video_desktop?: string
          hero_video_mobile?: string
          id?: string
          is_visible?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          method_badge?: string
          method_cta_text?: string
          method_cta_url?: string
          method_phases?: Json
          method_subtitle?: string
          method_title?: string
          partners_badge?: string
          partners_cta_text?: string
          partners_cta_url?: string
          partners_show?: boolean
          partners_subtitle?: string
          partners_title?: string
          slug: string
          title?: string
          updated_at?: string
        }
        Update: {
          about_badge?: string
          about_cta_text?: string
          about_cta_url?: string
          about_paragraphs?: string[]
          about_title?: string
          about_video_url?: string
          benefits_badge?: string
          benefits_cta_text?: string
          benefits_cta_url?: string
          benefits_items?: Json
          benefits_subtitle?: string
          benefits_title?: string
          cases_badge?: string
          cases_cta_text?: string
          cases_cta_url?: string
          cases_items?: Json
          cases_subtitle?: string
          cases_title?: string
          created_at?: string
          display_order?: number
          hero_badge?: string
          hero_cta_text?: string
          hero_cta_url?: string
          hero_poster?: string
          hero_subtitle?: string
          hero_title?: string
          hero_video_desktop?: string
          hero_video_mobile?: string
          id?: string
          is_visible?: boolean
          meta_description?: string
          meta_keywords?: string
          meta_title?: string
          method_badge?: string
          method_cta_text?: string
          method_cta_url?: string
          method_phases?: Json
          method_subtitle?: string
          method_title?: string
          partners_badge?: string
          partners_cta_text?: string
          partners_cta_url?: string
          partners_show?: boolean
          partners_subtitle?: string
          partners_title?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_page_views: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          page_path: string
          referrer: string | null
          region: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          page_path: string
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          page_path?: string
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      site_partners: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_visible: boolean
          link_url: string
          logo_url: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          link_url?: string
          logo_url?: string
          name?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_visible?: boolean
          link_url?: string
          logo_url?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_proposals: {
        Row: {
          about: string | null
          banner_url: string | null
          client_contact: string | null
          client_name: string | null
          created_at: string | null
          footer_links: Json | null
          id: string
          is_public: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          meta_robots: string | null
          meta_title: string | null
          scope: string | null
          slug: string
          subtitle: string | null
          timeline: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          about?: string | null
          banner_url?: string | null
          client_contact?: string | null
          client_name?: string | null
          created_at?: string | null
          footer_links?: Json | null
          id?: string
          is_public?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_robots?: string | null
          meta_title?: string | null
          scope?: string | null
          slug: string
          subtitle?: string | null
          timeline?: string | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          about?: string | null
          banner_url?: string | null
          client_contact?: string | null
          client_name?: string | null
          created_at?: string | null
          footer_links?: Json | null
          id?: string
          is_public?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_robots?: string | null
          meta_title?: string | null
          scope?: string | null
          slug?: string
          subtitle?: string | null
          timeline?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_tags: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          label: string
          tag_id: string
          tag_type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          tag_id?: string
          tag_type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          tag_id?: string
          tag_type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
