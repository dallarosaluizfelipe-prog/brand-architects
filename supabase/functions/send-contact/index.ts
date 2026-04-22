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

    const htmlBody = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>NEW LEAD | ESTUDIO DALLA</title>
</head>
<body style="margin:0;padding:0;background-color:#F2F2F2;font-family:Arial,Helvetica,sans-serif;">

<!-- Outer wrapper -->
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F2F2F2;">
  <tr>
    <td align="center" style="padding:48px 24px;">

      <!-- Container -->
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

        <!-- ═══════════ HEADER ═══════════ -->
        <tr>
          <td style="background-color:#000000;padding:44px 52px 36px 52px;">

            <!-- Studio label -->
            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:3px;color:#666666;text-transform:uppercase;">ESTUDIO DALLA</p>

            <!-- Main title -->
            <h1 style="margin:0 0 24px 0;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:normal;color:#FFFFFF;line-height:1.1;letter-spacing:-0.5px;">NEW LEAD</h1>

            <!-- Accent line (table-based for Outlook) -->
            <table cellpadding="0" cellspacing="0" border="0"><tr><td width="40" height="1" bgcolor="#444444" style="font-size:0;line-height:0;">&nbsp;</td></tr></table>

          </td>
        </tr>

        <!-- ═══════════ BODY ═══════════ -->
        <tr>
          <td style="background-color:#FFFFFF;padding:44px 52px;">

            <!-- Subtitle -->
            <p style="margin:0 0 36px 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:2.5px;color:#BBBBBB;text-transform:uppercase;">Novo contato recebido via site</p>

            <!-- NOME -->
            <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:2px;color:#CCCCCC;text-transform:uppercase;">Nome</p>
            <p style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#000000;font-weight:normal;">${name}</p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr><td height="1" bgcolor="#F0F0F0" style="font-size:0;line-height:0;">&nbsp;</td></tr></table>

            <!-- TELEFONE + EMAIL -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
              <tr valign="top">
                <td width="48%" style="padding-right:4%;">
                  <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:2px;color:#CCCCCC;text-transform:uppercase;">Telefone</p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#000000;">${phone || "—"}</p>
                </td>
                <td width="48%">
                  <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:2px;color:#CCCCCC;text-transform:uppercase;">Email</p>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#000000;word-break:break-all;">${email}</p>
                </td>
              </tr>
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr><td height="1" bgcolor="#F0F0F0" style="font-size:0;line-height:0;">&nbsp;</td></tr></table>

            <!-- EMPRESA -->
            <p style="margin:0 0 4px 0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:2px;color:#CCCCCC;text-transform:uppercase;">Empresa</p>
            <p style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#000000;font-weight:normal;">${company || "—"}</p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;"><tr><td height="1" bgcolor="#F0F0F0" style="font-size:0;line-height:0;">&nbsp;</td></tr></table>

            <!-- INTERESSE -->
            <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:2px;color:#CCCCCC;text-transform:uppercase;">Interesse</p>
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color:#000000;padding:11px 22px;">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#FFFFFF;text-transform:uppercase;">${serviceLabel}</p>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ═══════════ REPLY CTA ═══════════ -->
        <tr>
          <td style="background-color:#F8F8F8;padding:32px 52px;border-top:1px solid #EFEFEF;">
            <p style="margin:0 0 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#555555;line-height:1.6;">Responda diretamente a este email para entrar em contato com <strong style="color:#000000;">${name}</strong>.</p>
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color:#000000;">
                  <a href="mailto:${email}" style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:bold;letter-spacing:2px;color:#FFFFFF;text-decoration:none;text-transform:uppercase;">Responder agora</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ═══════════ FOOTER ═══════════ -->
        <tr>
          <td style="background-color:#000000;padding:22px 52px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr valign="middle">
                <td>
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:9px;letter-spacing:2px;color:#444444;text-transform:uppercase;">ESTUDIO DALLA &mdash; estudiodalla.com</p>
                </td>
                <td align="right">
                  <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:9px;color:#333333;">Notificação automática</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Estudio Dalla Site <noreply@estudiodalla.com>",
        to: [TO_EMAIL],
        cc: ["kauan@iasin.dev.br"],
        reply_to: email,
        subject: `NEW LEAD | ${name} — ${serviceLabel}`,
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
