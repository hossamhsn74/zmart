import { useEffect } from "react";
import { sendEventApi } from "../api/recommendationsApi";

export const useTelemetry = () => {
  const sendEvent = async (type: string, payload: Record<string, any>) => {
    const event = {
      type,
      ...payload,
      ts: new Date().toISOString(),
      session_id: sessionStorage.getItem("sid") || crypto.randomUUID(),
      source: "web",
    };

    try {
      await sendEventApi(event);
      console.log("✅ Telemetry event sent:", event);
    } catch (err) {
      console.error("❌ Failed to send telemetry event", err);
    }
  };

  // Automatically capture page view on mount
  useEffect(() => {
    sendEvent("page_view", { url: window.location.href });
  }, []);

  return { sendEvent };
};
