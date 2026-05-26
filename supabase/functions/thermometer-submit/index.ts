import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmail(opts: {
  clientName: string;
  clientLogoUrl: string;
  thermometerSlug: string;
  accentColor: string;
  receivedAt: string;
  clientEmail: string;
  rows: Array<{ question: string; leftLabel: string; rightLabel: string; value: number }>;
  isAdmin: boolean;
}): string {
  const headline = opts.isAdmin
    ? "NOVA RESPOSTA — TERMÔMETRO DE MARCA"
    : "SEU TERMÔMETRO DE MARCA";
  const subtitle = opts.isAdmin
    ? `Termômetro: ${esc(opts.clientName)}`
    : "Obrigado por responder — aqui está o resultado.";

  const rowsHtml = opts.rows
    .map((r) => {
      const pct = Math.round(((r.value - 1) / 9) * 100);
      return `
      <tr><td style="padding:18px 0 6px 0;font-family:Georgia,serif;font-size:18px;color:#000;line-height:1.3;">${esc(r.question)}</td></tr>
      <tr><td style="padding:0 0 4px 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;color:#666;text-transform:uppercase;">
        <span>${esc(r.leftLabel)}</span>
        <span style="float:right;">${esc(r.rightLabel)}</span>
      </td></tr>
      <tr><td style="padding:0 0 8px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#EAEAEA;height:6px;border-radius:3px;">
          <tr><td style="line-height:0;font-size:0;height:6px;">
            <div style="width:${pct}%;background:${esc(opts.accentColor)};height:6px;border-radius:3px;"></div>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:0 0 14px 0;font-family:Arial,sans-serif;font-size:12px;color:#888;">Nota: <strong style="color:#000;">${r.value}/10</strong></td></tr>
      <tr><td style="border-top:1px solid #EEE;height:1px;line-height:0;font-size:0;">&nbsp;</td></tr>`;
    })
    .join("");

  const logoBlock = opts.clientLogoUrl
    ? `<img src="${esc(opts.clientLogoUrl)}" alt="${esc(opts.clientName)}" style="max-height:60px;max-width:200px;display:block;margin:0 auto 24px auto;" />`
    : "";

  return `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${headline}</title></head>
<body style="margin:0;padding:0;background-color:#F2F2F2;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F2F2F2;">
  <tr><td align="center" style="padding:48px 24px;">
    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
      <tr><td style="background-color:#000000;padding:44px 52px 36px 52px;">
        <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:10px;font-weight:bold;letter-spacing:3px;color:#666;text-transform:uppercase;">ESTUDIO DALLA</p>
        <h1 style="margin:0 0 24px 0;font-family:Georgia,serif;font-size:30px;font-weight:normal;color:#FFFFFF;line-height:1.1;letter-spacing:-0.5px;">${headline}</h1>
        <table cellpadding="0" cellspacing="0" border="0"><tr><td width="40" height="1" bgcolor="#444" style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
      </td></tr>
      <tr><td style="background-color:#FFFFFF;padding:44px 52px;">
        ${logoBlock}
        <p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:2px;color:#666;text-transform:uppercase;">${esc(subtitle)}</p>
        <p style="margin:0 0 4px 0;font-family:Arial,sans-serif;font-size:13px;color:#555;">Cliente: <strong style="color:#000;">${esc(opts.clientName)}</strong></p>
        <p style="margin:0 0 4px 0;font-family:Arial,sans-serif;font-size:13px;color:#555;">E-mail respondente: <strong style="color:#000;">${esc(opts.clientEmail)}</strong></p>
        <p style="margin:0 0 24px 0;font-family:Arial,sans-serif;font-size:13px;color:#555;">Data: <strong style="color:#000;">${esc(opts.receivedAt)}</strong></p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">${rowsHtml}</table>
      </td></tr>
      <tr><td style="background:#000;padding:24px 52px;text-align:center;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:10px;letter-spacing:3px;color:#666;">© 2024 BRANDING STUDIO. ALL RIGHTS RESERVED.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY missing");
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Studio Dalla <contato@notify.estudiodalla.com>",
      to: [to],
      subject,
      html,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Resend error", res.status, text);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { slug, client_email, answers } = await req.json();
    if (!slug || !client_email || !Array.isArray(answers) || !answers.length) {
      return new Response(JSON.stringify({ error: "invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client_email)) {
      return new Response(JSON.stringify({ error: "invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: thermo, error: tErr } = await supabase
      .from("thermometers")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    if (tErr || !thermo) {
      return new Response(JSON.stringify({ error: "thermometer not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: questions } = await supabase
      .from("thermometer_questions")
      .select("*")
      .eq("thermometer_id", thermo.id)
      .order("order_index", { ascending: true });

    const qMap = new Map((questions || []).map((q: any) => [q.id, q]));

    // insert response
    const { data: resp, error: rErr } = await supabase
      .from("thermometer_responses")
      .insert({ thermometer_id: thermo.id, client_email })
      .select()
      .single();
    if (rErr) throw rErr;

    const cleanAnswers = answers
      .filter((a: any) => qMap.has(a.question_id) && Number.isInteger(a.value) && a.value >= 1 && a.value <= 10)
      .map((a: any) => ({
        response_id: resp.id,
        question_id: a.question_id,
        value: a.value,
      }));
    if (cleanAnswers.length) {
      await supabase.from("thermometer_answers").insert(cleanAnswers);
    }

    // build email rows in question order
    const rows = (questions || []).map((q: any) => {
      const a = cleanAnswers.find((x: any) => x.question_id === q.id);
      return {
        question: q.question_text,
        leftLabel: q.left_label,
        rightLabel: q.right_label,
        value: a?.value ?? 0,
      };
    });

    const receivedAt = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });

    const adminHtml = buildEmail({
      clientName: thermo.client_name,
      clientLogoUrl: thermo.client_logo_url,
      thermometerSlug: thermo.slug,
      accentColor: thermo.accent_color || "#000000",
      receivedAt,
      clientEmail: client_email,
      rows,
      isAdmin: true,
    });
    const clientHtml = buildEmail({
      clientName: thermo.client_name,
      clientLogoUrl: thermo.client_logo_url,
      thermometerSlug: thermo.slug,
      accentColor: thermo.accent_color || "#000000",
      receivedAt,
      clientEmail: client_email,
      rows,
      isAdmin: false,
    });

    await Promise.all([
      sendEmail(thermo.admin_email || "lipe@estudiodalla.com", `Nova resposta — Termômetro ${thermo.client_name}`, adminHtml),
      sendEmail(client_email, `Seu resultado — Termômetro de Marca ${thermo.client_name}`, clientHtml),
    ]);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("thermometer-submit error", e);
    return new Response(JSON.stringify({ error: e?.message || "error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});