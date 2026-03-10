import { useEffect, useRef } from "react";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export function usePushNotifications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const registered = useRef(false);

  useEffect(() => {
    if (!user || !Capacitor.isNativePlatform() || registered.current) return;

    const setup = async () => {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === "prompt") {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== "granted") {
        console.log("Push notification permission not granted");
        return;
      }

      await PushNotifications.register();
      registered.current = true;
    };

    // Listen for registration success
    PushNotifications.addListener("registration", async (token) => {
      console.log("Push token:", token.value);
      const platform = Capacitor.getPlatform(); // 'ios' | 'android'

      // Upsert the token
      const { error } = await supabase
        .from("device_tokens" as any)
        .upsert(
          {
            user_id: user.id,
            token: token.value,
            platform,
          },
          { onConflict: "user_id,token" }
        );

      if (error) {
        console.error("Failed to save push token:", error);
      }
    });

    // Listen for registration errors
    PushNotifications.addListener("registrationError", (err) => {
      console.error("Push registration error:", err);
    });

    // Listen for incoming notifications while app is open
    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      toast({
        title: notification.title || "Notification",
        description: notification.body || "",
      });
    });

    // Listen for notification taps (app was in background)
    PushNotifications.addListener("pushNotificationActionPerformed", (action) => {
      const link = action.notification.data?.link;
      if (link) {
        navigate(link);
      }
    });

    setup();

    return () => {
      PushNotifications.removeAllListeners();
    };
  }, [user, navigate]);
}
