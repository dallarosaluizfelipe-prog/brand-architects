import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    const body = await req.json();
    const { action, pin, data } = body;

    if (action === "verify") {
      const { data: settings } = await supabase
        .from("admin_settings")
        .select("pin_hash")
        .single();

      if (!settings) {
        return new Response(JSON.stringify({ error: "No PIN configured" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const hashHex = await hashPin(pin);
      const valid = hashHex === settings.pin_hash;
      return new Response(JSON.stringify({ valid }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // All other actions require PIN verification
    const { data: settings } = await supabase
      .from("admin_settings")
      .select("id, pin_hash")
      .single();

    const hashHex = await hashPin(pin);

    if (!settings || hashHex !== settings.pin_hash) {
      return new Response(JSON.stringify({ error: "Invalid PIN" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (action) {
      case "list_cases": {
        const { data: cases } = await supabase
          .from("site_cases")
          .select("*")
          .order("display_order", { ascending: true });
        return new Response(JSON.stringify({ cases }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "upsert_case": {
        const { data: result, error } = await supabase
          .from("site_cases")
          .upsert({ ...data, updated_at: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ case: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete_case": {
        const { error } = await supabase
          .from("site_cases")
          .delete()
          .eq("id", data.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_content": {
        const { data: content } = await supabase
          .from("site_content")
          .select("*");
        return new Response(JSON.stringify({ content }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "upsert_content": {
        const { data: result, error } = await supabase
          .from("site_content")
          .upsert({ ...data, updated_at: new Date().toISOString() }, { onConflict: "section_key" })
          .select()
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ content: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "change_pin": {
        const newHashHex = await hashPin(data.new_pin);
        const { error } = await supabase
          .from("admin_settings")
          .update({ pin_hash: newHashHex, updated_at: new Date().toISOString() })
          .eq("id", settings.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_proposals": {
        const { data: proposals } = await supabase
          .from("site_proposals")
          .select("*")
          .order("created_at", { ascending: false });
        return new Response(JSON.stringify({ proposals }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "upsert_proposal": {
        const { data: result, error } = await supabase
          .from("site_proposals")
          .upsert({ ...data, updated_at: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ proposal: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete_proposal": {
        const { error } = await supabase
          .from("site_proposals")
          .delete()
          .eq("id", data.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_tags": {
        const { data: tags } = await supabase
          .from("site_tags")
          .select("*")
          .order("created_at", { ascending: true });
        return new Response(JSON.stringify({ tags }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "upsert_tag": {
        const { data: result, error } = await supabase
          .from("site_tags")
          .upsert({ ...data, updated_at: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ tag: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete_tag": {
        const { error } = await supabase
          .from("site_tags")
          .delete()
          .eq("id", data.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "analytics_summary": {
        // Support both "days" (preset) and "from"/"to" (custom range)
        let since: string;
        let until: string | null = null;
        let periodLabel = "";

        if (data?.from && data?.to) {
          since = new Date(data.from).toISOString();
          until = new Date(new Date(data.to).getTime() + 86400000).toISOString(); // end of "to" day
          periodLabel = `${data.from} a ${data.to}`;
        } else {
          const days = data?.days || 7;
          since = new Date(Date.now() - days * 86400000).toISOString();
          periodLabel = `${days} dias`;
        }

        // Build query helpers
        const addRange = (query: any) => {
          query = query.gte("created_at", since);
          if (until) query = query.lt("created_at", until);
          return query;
        };

        // Page views with page_path + created_at.
        // We merge both sources to support legacy/alternative tracking pipelines.
        const { data: pvByPage } = await addRange(
          supabase.from("site_page_views").select("page_path, created_at")
        );
        const { data: pvEvents } = await addRange(
          supabase
            .from("site_events")
            .select("page_path, created_at")
            .eq("event_type", "page_view")
        );

        const pageViewRows = [...(pvByPage || []), ...(pvEvents || [])];

        const pageViewCounts: Record<string, number> = {};
        const dailyViews: Record<string, number> = {};
        for (const row of pageViewRows) {
          const page = row.page_path || "/";
          const createdAt = row.created_at || new Date().toISOString();
          pageViewCounts[page] = (pageViewCounts[page] || 0) + 1;
          const day = createdAt.slice(0, 10);
          dailyViews[day] = (dailyViews[day] || 0) + 1;
        }
        const topPages = Object.entries(pageViewCounts)
          .map(([page, count]) => ({ page, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);

        // Geo data
        const { data: pvGeo } = await addRange(
          supabase.from("site_page_views").select("country, region, city")
        );
        const geoCounts: Record<string, number> = {};
        for (const row of pvGeo || []) {
          const key = [row.country, row.region, row.city].filter(Boolean).join(" / ") || "Desconhecido";
          geoCounts[key] = (geoCounts[key] || 0) + 1;
        }
        const topRegions = Object.entries(geoCounts)
          .map(([region, count]) => ({ region, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20);

        // WhatsApp clicks
        const { count: whatsappClicks } = await addRange(
          supabase.from("site_events").select("id", { count: "exact", head: true }).eq("event_type", "whatsapp_click")
        );

        // Form submissions count
        const { count: formCount } = await addRange(
          supabase.from("site_form_submissions").select("id", { count: "exact", head: true })
        );

        return new Response(JSON.stringify({
          total_page_views: pageViewRows.length,
          whatsapp_clicks: whatsappClicks || 0,
          form_submissions: formCount || 0,
          top_pages: topPages,
          top_regions: topRegions,
          daily_views: dailyViews,
          period_label: periodLabel,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_form_submissions": {
        const limit = data?.limit || 50;
        const { data: submissions, error } = await supabase
          .from("site_form_submissions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(limit);
        if (error) throw error;
        return new Response(JSON.stringify({ submissions }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_emails": {
        const limit = data?.limit || 100;
        const { data: emails, error } = await supabase
          .from("admin_emails")
          .select("*")
          .order("received_at", { ascending: false })
          .limit(limit);
        if (error) throw error;
        return new Response(JSON.stringify({ emails }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_lps": {
        const { data: lps, error } = await supabase
          .from("site_lps")
          .select("*")
          .order("display_order", { ascending: true });
        if (error) throw error;
        return new Response(JSON.stringify({ lps }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "upsert_lp": {
        const { data: result, error } = await supabase
          .from("site_lps")
          .upsert({ ...data, updated_at: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ lp: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete_lp": {
        const { error } = await supabase
          .from("site_lps")
          .delete()
          .eq("id", data.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "list_partners": {
        const { data: partners, error } = await supabase
          .from("site_partners")
          .select("*")
          .order("display_order", { ascending: true });
        if (error) throw error;
        return new Response(JSON.stringify({ partners }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "upsert_partner": {
        const { data: result, error } = await supabase
          .from("site_partners")
          .upsert({ ...data, updated_at: new Date().toISOString() })
          .select()
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ partner: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete_partner": {
        const { error } = await supabase
          .from("site_partners")
          .delete()
          .eq("id", data.id);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
