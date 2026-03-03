import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    // Verify PIN for all actions except 'verify'
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

      // MD5 hash comparison
      const encoder = new TextEncoder();
      const dataBytes = encoder.encode(pin);
      const hashBuffer = await crypto.subtle.digest("MD5", dataBytes);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

      const valid = hashHex === settings.pin_hash;
      return new Response(JSON.stringify({ valid }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // All other actions require PIN verification
    const { data: settings } = await supabase
      .from("admin_settings")
      .select("pin_hash")
      .single();

    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(pin);
    const hashBuffer = await crypto.subtle.digest("MD5", dataBytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    if (!settings || hashHex !== settings.pin_hash) {
      return new Response(JSON.stringify({ error: "Invalid PIN" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // CRUD operations
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
        const newEncoder = new TextEncoder();
        const newBytes = newEncoder.encode(data.new_pin);
        const newHashBuffer = await crypto.subtle.digest("MD5", newBytes);
        const newHashArray = Array.from(new Uint8Array(newHashBuffer));
        const newHashHex = newHashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

        const { error } = await supabase
          .from("admin_settings")
          .update({ pin_hash: newHashHex, updated_at: new Date().toISOString() })
          .eq("id", settings.id);
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
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
