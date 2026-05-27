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

function slugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60) || `t-${Math.random().toString(36).slice(2, 8)}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { action, pin, data } = await req.json();

    const { data: settings } = await supabase
      .from("admin_settings")
      .select("pin_hash")
      .single();
    const hashHex = await hashPin(pin || "");
    if (!settings || hashHex !== settings.pin_hash) {
      return new Response(JSON.stringify({ error: "Invalid PIN" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = (payload: unknown, status = 200) =>
      new Response(JSON.stringify(payload), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    switch (action) {
      case "list": {
        const { data: items, error } = await supabase
          .from("thermometers")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        const ids = (items || []).map((t: any) => t.id);
        let counts: Record<string, number> = {};
        if (ids.length) {
          const { data: resp } = await supabase
            .from("thermometer_responses")
            .select("thermometer_id")
            .in("thermometer_id", ids);
          for (const r of resp || []) {
            counts[r.thermometer_id] = (counts[r.thermometer_id] || 0) + 1;
          }
        }
        return json({
          items: (items || []).map((i: any) => ({ ...i, response_count: counts[i.id] || 0 })),
        });
      }

      case "get": {
        const { id } = data || {};
        const { data: t, error } = await supabase
          .from("thermometers")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        const { data: questions } = await supabase
          .from("thermometer_questions")
          .select("*")
          .eq("thermometer_id", id)
          .order("order_index", { ascending: true });
        return json({ thermometer: t, questions: questions || [] });
      }

      case "upsert": {
        const t = data?.thermometer || {};
        const questions = Array.isArray(data?.questions) ? data.questions : [];

        let slug = (t.slug || "").trim() || slugify(t.client_name || "termometro");
        // ensure unique slug
        const { data: clash } = await supabase
          .from("thermometers")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        if (clash && clash.id !== t.id) {
          slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
        }

        const payload: Record<string, unknown> = {
          slug,
          client_name: t.client_name || "",
          client_logo_url: t.client_logo_url || "",
          accent_color: t.accent_color || "#000000",
          admin_email: t.admin_email || "lipe@estudiodalla.com",
          welcome_title: t.welcome_title || "",
          is_active: t.is_active !== false,
        };

        let row;
        if (t.id) {
          const { data: updated, error } = await supabase
            .from("thermometers")
            .update(payload)
            .eq("id", t.id)
            .select()
            .single();
          if (error) throw error;
          row = updated;
          await supabase.from("thermometer_questions").delete().eq("thermometer_id", t.id);
        } else {
          const { data: inserted, error } = await supabase
            .from("thermometers")
            .insert(payload)
            .select()
            .single();
          if (error) throw error;
          row = inserted;
        }

        if (questions.length) {
          const toInsert = questions.map((q: any, idx: number) => ({
            thermometer_id: row.id,
            order_index: idx,
            question_text: q.question_text || "",
            left_label: q.left_label || "",
            left_icon: q.left_icon || "",
            right_label: q.right_label || "",
            right_icon: q.right_icon || "",
          }));
          const { error: qErr } = await supabase
            .from("thermometer_questions")
            .insert(toInsert);
          if (qErr) throw qErr;
        }

        return json({ thermometer: row });
      }

      case "delete": {
        const { id } = data || {};
        const { error } = await supabase.from("thermometers").delete().eq("id", id);
        if (error) throw error;
        return json({ ok: true });
      }

      case "duplicate": {
        const { id } = data || {};
        const { data: src } = await supabase.from("thermometers").select("*").eq("id", id).single();
        if (!src) return json({ error: "not found" }, 404);
        const { data: srcQ } = await supabase
          .from("thermometer_questions")
          .select("*")
          .eq("thermometer_id", id)
          .order("order_index", { ascending: true });

        const newSlug = `${src.slug}-${Math.random().toString(36).slice(2, 6)}`;
        const { data: copy, error } = await supabase
          .from("thermometers")
          .insert({
            slug: newSlug,
            client_name: `${src.client_name} (cópia)`,
            client_logo_url: src.client_logo_url,
            accent_color: src.accent_color,
            admin_email: src.admin_email,
            welcome_title: src.welcome_title,
            is_active: src.is_active,
          })
          .select()
          .single();
        if (error) throw error;

        if (srcQ?.length) {
          await supabase.from("thermometer_questions").insert(
            srcQ.map((q: any, idx: number) => ({
              thermometer_id: copy.id,
              order_index: idx,
              question_text: q.question_text,
              left_label: q.left_label,
              left_icon: q.left_icon,
              right_label: q.right_label,
              right_icon: q.right_icon,
            }))
          );
        }
        return json({ thermometer: copy });
      }

      case "responses": {
        const { id } = data || {};
        const { data: responses } = await supabase
          .from("thermometer_responses")
          .select("*")
          .eq("thermometer_id", id)
          .order("completed_at", { ascending: false });
        const respIds = (responses || []).map((r: any) => r.id);
        let answers: any[] = [];
        if (respIds.length) {
          const { data: ans } = await supabase
            .from("thermometer_answers")
            .select("*")
            .in("response_id", respIds);
          answers = ans || [];
        }
        const { data: questions } = await supabase
          .from("thermometer_questions")
          .select("*")
          .eq("thermometer_id", id)
          .order("order_index", { ascending: true });
        return json({ responses: responses || [], answers, questions: questions || [] });
      }
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e: any) {
    console.error("thermometer-admin error", e);
    return new Response(JSON.stringify({ error: e?.message || "error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});