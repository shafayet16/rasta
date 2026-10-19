export const event = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    // Generate a unique eventID for every track call to prevent Meta from dropping rapid/multiple events
    const uniqueEventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Meta Pixel syntax: fbq('track', eventName, params, { eventID })
    (window as any).fbq("track", name, options, { eventID: uniqueEventId });
  }
};