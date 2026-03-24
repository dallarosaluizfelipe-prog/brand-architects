import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ error: "Missing env" });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const { type, data } = req.body;

    // Geo from Vercel headers
    const country = req.headers["x-vercel-ip-country"] || null;
    const region = req.headers["x-vercel-ip-region"] || null;
    const city = req.headers["x-vercel-ip-city"] || null;

    if (type === "pageview") {
      const { error } = await supabase.from("site_page_views").insert({
        page_path: String(data.page_path || "/").slice(0, 500),
        session_id: data.session_id ? String(data.session_id).slice(0, 100) : null,
        referrer: data.referrer ? String(data.referrer).slice(0, 1000) : null,
        user_agent: req.headers["user-agent"]
          ? String(req.headers["user-agent"]).slice(0, 500)
          : null,
        country,
        region,
        city,
      });
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (type === "event") {
      const { error } = await supabase.from("site_events").insert({
        event_type: String(data.event_type || "unknown").slice(0, 100),
        page_path: data.page_path ? String(data.page_path).slice(0, 500) : null,
        metadata: data.metadata || {},
        session_id: data.session_id ? String(data.session_id).slice(0, 100) : null,
      });
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    if (type === "form_submission") {
      const { error } = await supabase.from("site_form_submissions").insert({
        name: String(data.name || "").slice(0, 200),
        email: String(data.email || "").slice(0, 200),
        phone: data.phone ? String(data.phone).slice(0, 50) : null,
        company: data.company ? String(data.company).slice(0, 200) : null,
        challenge: data.challenge ? String(data.challenge).slice(0, 200) : null,
        message: data.message ? String(data.message).slice(0, 2000) : null,
        page_path: data.page_path ? String(data.page_path).slice(0, 500) : null,
      });
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: "Unknown type" });
  } catch (err) {
    console.error("track error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
