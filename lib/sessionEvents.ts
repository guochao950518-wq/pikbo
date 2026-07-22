/** Cross-component session refresh (client only). */

export const SESSION_EVENT = "pikbo:session";

export function emitSessionRefresh(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SESSION_EVENT));
}
