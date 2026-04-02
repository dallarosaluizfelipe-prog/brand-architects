import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TO_EMAIL = "lipe@estudiodalla.com";

const SERVICE_LABELS: Record<string, string> = {
  estrategia: "Estratégia de marca (posicionamento e conceito)",
  identidade_visual: "Identidade visual (logo, cores, tipografia)",
  sistema_identidade: "Sistema de identidade (aplicações e consistência)",
  branding_lancamento: "Branding, lançamentos e reposicionamento",
  consultoria: "Consultoria de marca",
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, phone, email, company, service } = await req.json();

    if (!name || !email) {
      return new Response(JSON.stringify({ error: "name and email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceLabel = SERVICE_LABELS[service] || service || "Não especificado";

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const htmlBody = `
      <h2>Novo contato via site — Estudio Dalla</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;">
        <tr><td style="padding:8px 16px 8px 0;font-weight:bold;">Nome</td><td style="padding:8px 0;">${name}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;font-weight:bold;">Número</td><td style="padding:8px 0;">${phone || "—"}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;font-weight:bold;">Email</td><td style="padding:8px 0;">${email}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;font-weight:bold;">Empresa</td><td style="padding:8px 0;">${company || "—"}</td></tr>
        <tr><td style="padding:8px 16px 8px 0;font-weight:bold;">Precisa de</td><td style="padding:8px 0;">${serviceLabel}</td></tr>
      </table>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Estudio Dalla Site <noreply@estudiodalla.com>",
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Novo contato: ${name} — ${serviceLabel}`,
        html: htmlBody,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      console.error("Resend error:", result);
      return new Response(JSON.stringify({ error: "failed to send" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
