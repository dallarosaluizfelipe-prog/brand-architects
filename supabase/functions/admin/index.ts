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
