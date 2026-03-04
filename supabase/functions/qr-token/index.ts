import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TOKEN_TTL_SECONDS = 300; // 5 minutes

async function hmacSign(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacVerify(
  secret: string,
  message: string,
  signature: string
): Promise<boolean> {
  const expected = await hmacSign(secret, message);
  return expected === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const hmacSecret = serviceRoleKey; // Use service role key as HMAC secret

  try {
    const { action } = await req.json();

    if (action === "generate") {
      // Authenticate the user
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const expiresAt = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS;
      const message = `${user.id}:${expiresAt}`;
      const signature = await hmacSign(hmacSecret, message);
      const token = `${message}:${signature}`;

      return new Response(JSON.stringify({ token, expires_at: expiresAt }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "validate") {
      const { token } = await req.json();

      // Validate via service role - vendor doesn't need to be the token owner
      const authHeader = req.headers.get("Authorization");
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify the calling user is authenticated
      const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user: caller }, error: callerError } = await supabase.auth.getUser();
      if (callerError || !caller) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!token || typeof token !== "string") {
        return new Response(
          JSON.stringify({ valid: false, error: "Missing token" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const parts = token.split(":");
      if (parts.length !== 3) {
        return new Response(
          JSON.stringify({ valid: false, error: "Invalid token format" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const [userId, expiresAtStr, signature] = parts;
      const expiresAt = parseInt(expiresAtStr, 10);

      if (isNaN(expiresAt) || Math.floor(Date.now() / 1000) > expiresAt) {
        return new Response(
          JSON.stringify({ valid: false, error: "Token expired" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const message = `${userId}:${expiresAtStr}`;
      const isValid = await hmacVerify(hmacSecret, message, signature);

      if (!isValid) {
        return new Response(
          JSON.stringify({ valid: false, error: "Invalid signature" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Look up the customer profile using service role
      const adminSupabase = createClient(supabaseUrl, serviceRoleKey);
      const { data: profile } = await adminSupabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .eq("id", userId)
        .single();

      return new Response(
        JSON.stringify({ valid: true, user_id: userId, profile }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
