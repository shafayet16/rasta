export const event = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", name, options);
  }
};