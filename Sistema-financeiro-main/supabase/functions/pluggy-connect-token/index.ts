/// <reference types="https://deno.land/x/supabase_functions@1.0.3/src/edge-runtime.d.ts" />
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLUGGY_API_URL = "https://api.pluggy.ai";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    let payload: { userId?: string } = {};
    try {
      payload = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Body JSON inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { userId } = payload;
    if (!userId) {
      return new Response(JSON.stringify({ error: "userId é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("PLUGGY_API_KEY") || "";
    const clientId = Deno.env.get("PLUGGY_CLIENT_ID") || "";
    const clientSecret = Deno.env.get("PLUGGY_CLIENT_SECRET") || "";

    let authKey = apiKey;
    if (!authKey) {
      if (!clientId || !clientSecret) {
        return new Response(JSON.stringify({ error: "Credenciais Pluggy ausentes" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const authResponse = await fetch(`${PLUGGY_API_URL}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret }),
      });

      if (!authResponse.ok) {
        const text = await authResponse.text();
        return new Response(JSON.stringify({ error: text || "Falha ao autenticar na Pluggy" }), {
          status: authResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const authData = await authResponse.json();
      authKey = authData.apiKey;
      if (!authKey) {
        return new Response(JSON.stringify({ error: "API key inválida na resposta da Pluggy" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const response = await fetch(`${PLUGGY_API_URL}/connect_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": authKey,
      },
      body: JSON.stringify({ clientUserId: userId }),
    });

    const responseText = await response.text();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: responseText || "Erro ao gerar connect token" }), {
        status: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let data: any = {};
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      return new Response(JSON.stringify({ error: "Resposta da Pluggy não é JSON" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const connectToken = data.connectToken || data.connect_token || data.token;
    if (!connectToken) {
      return new Response(JSON.stringify({ error: "connectToken ausente na resposta", keys: Object.keys(data || {}) }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ connectToken }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
