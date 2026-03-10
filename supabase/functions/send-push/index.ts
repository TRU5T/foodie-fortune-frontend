import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, title, message, link } = await req.json();

    if (!user_id || !title || !message) {
      return new Response(
        JSON.stringify({ error: "user_id, title, and message are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fcmServerKey = Deno.env.get("FCM_SERVER_KEY");
    if (!fcmServerKey) {
      console.error("FCM_SERVER_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Push notifications not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role to read all device tokens for the user
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: tokens, error: tokensError } = await supabaseAdmin
      .from("device_tokens")
      .select("token, platform")
      .eq("user_id", user_id);

    if (tokensError) {
      console.error("Failed to fetch tokens:", tokensError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch device tokens" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ message: "No device tokens found, skipping push" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send to all registered devices via FCM
    const results = await Promise.allSettled(
      tokens.map(async (device: { token: string; platform: string }) => {
        const fcmPayload = {
          to: device.token,
          notification: {
            title,
            body: message,
            sound: "default",
          },
          data: {
            link: link || "",
            click_action: "FLUTTER_NOTIFICATION_CLICK",
          },
        };

        const res = await fetch("https://fcm.googleapis.com/fcm/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `key=${fcmServerKey}`,
          },
          body: JSON.stringify(fcmPayload),
        });

        const result = await res.json();

        // Clean up invalid tokens
        if (result.failure && result.results) {
          for (const r of result.results) {
            if (
              r.error === "NotRegistered" ||
              r.error === "InvalidRegistration"
            ) {
              await supabaseAdmin
                .from("device_tokens")
                .delete()
                .eq("token", device.token);
              console.log("Removed invalid token:", device.token);
            }
          }
        }

        return result;
      })
    );

    return new Response(
      JSON.stringify({ success: true, sent: results.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-push error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
