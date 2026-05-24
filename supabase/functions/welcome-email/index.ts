// =========================================================================
// SUPABASE EDGE FUNCTION: WELCOME EMAIL AUTOMATION
// =========================================================================
// This Edge Function is triggered by a database webhook when a new waitlist
// subscriber completes onboarding. It sends a highly personalized, sleek,
// dark-themed HTML confirmation email using the Resend API.
// Setup instructions:
// 1. Install Supabase CLI: npm install supabase --save-dev
// 2. Set Resend API Key: supabase secrets set RESEND_API_KEY=re_your_api_key
// 3. Deploy: supabase functions deploy welcome-email

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WaitlistRecord {
  email: string;
  role?: string;
  challenge?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("Missing RESEND_API_KEY environment secret.");
    }

    const payload = await req.json();
    const record: WaitlistRecord = payload.record || payload;

    if (!record || !record.email) {
      return new Response(JSON.stringify({ error: "Invalid payload: email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { email, role = "creator", challenge = "moving your creative projects forward" } = record;

    // 1. Design the sleek, dark-themed HTML/editorial email template
    const htmlEmailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to NorthLab</title>
        <style>
          body {
            background-color: #0A0A0A;
            color: #E2E8F0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
          }
          .wrapper {
            width: 100%;
            background-color: #0A0A0A;
            padding: 40px 20px;
            box-sizing: border-box;
          }
          .container {
            max-width: 580px;
            margin: 0 auto;
            background-color: #101010;
            border: 1px solid #262626;
            border-radius: 12px;
            padding: 48px 36px;
            box-sizing: border-box;
          }
          .header {
            margin-bottom: 40px;
            text-align: left;
            border-bottom: 1px solid #262626;
            padding-bottom: 20px;
          }
          .logo {
            font-weight: 800;
            font-size: 20px;
            letter-spacing: 0.1em;
            color: #FFFFFF;
            text-transform: uppercase;
            text-decoration: none;
          }
          .eyebrow {
            font-size: 11px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #64748B;
            font-weight: 600;
            margin-bottom: 16px;
          }
          h1 {
            color: #FFFFFF;
            font-size: 26px;
            font-weight: 400;
            line-height: 1.15;
            letter-spacing: -0.02em;
            margin: 0 0 24px 0;
          }
          .highlight {
            color: #DEDBC8;
            font-style: italic;
          }
          p {
            font-size: 15px;
            line-height: 1.6;
            color: #94A3B8;
            margin: 0 0 20px 0;
          }
          .personalization-box {
            background-color: #161616;
            border-left: 3px solid #DEDBC8;
            padding: 16px 20px;
            margin: 28px 0;
            border-radius: 4px;
          }
          .personalization-box p {
            margin: 0;
            font-size: 13.5px;
            color: #CBD5E1;
            font-weight: 500;
          }
          .footer {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid #262626;
            text-align: center;
          }
          .footer p {
            font-size: 11px;
            color: #475569;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <span class="logo">NorthLab</span>
            </div>
            
            <div class="eyebrow">00 / CONFIRMED EARLY ACCESS</div>
            <h1>Give your independent journey a <span class="highlight">clear North.</span></h1>
            
            <p>Hi there,</p>
            
            <p>This is to confirm that you've successfully claimed your early spot with NorthLab.</p>
            
            <p>Working independently gives you freedom, but it also puts everything on you. You have to shape the brief, manage the work, gather feedback, and figure out what comes next entirely on your own.</p>
            
            <p>NorthLab brings that journey into one connected, ambient system.</p>
            
            <div class="personalization-box">
              <p>We've customized your roadmap around your perspective as an independent <strong>${role}</strong>. We'll prioritize early updates designed to help you with <strong>${challenge}</strong>.</p>
            </div>
            
            <p>Over the coming weeks, we'll send you private updates, product concepts, and early-access invites to our core guidance workspace before public launch.</p>
            
            <p>Welcome to the first group shaping the future of independent creation.</p>
            
            <p style="margin-top: 40px; color: #CBD5E1;">— The NorthLab Team</p>
            
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} NorthLab, Inc. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // 2. Call the Resend API to send the email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "NorthLab <welcome@northlab.co>", // Update this with your verified domain once ready
        to: [email],
        subject: "Welcome to NorthLab — Your spot is claimed",
        html: htmlEmailTemplate,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(resData)}`);
    }

    return new Response(JSON.stringify({ success: true, message: "Welcome email sent successfully!", data: resData }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
