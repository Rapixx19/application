export function trackEvent(
  eventType: string,
  eventData?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  const sessionId =
    sessionStorage.getItem("sentavita_session") ||
    (() => {
      const id = crypto.randomUUID();
      sessionStorage.setItem("sentavita_session", id);
      return id;
    })();

  const payload = {
    event_type: eventType,
    event_data: eventData || {},
    session_id: sessionId,
  };

  // Use sendBeacon for reliability (works on page unload)
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
  } else {
    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }
}
