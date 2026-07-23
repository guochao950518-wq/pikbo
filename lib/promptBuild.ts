/**
 * Build the Seedance prompt from preset template + user extra.
 * Always keep the toy-first template as the base (never freeform-only).
 */

export const MAX_EXTRA_CHARS = 400;

export function sanitizeExtra(extra: unknown): string {
  if (typeof extra !== "string") return "";
  return extra.trim().slice(0, MAX_EXTRA_CHARS);
}

/**
 * @param template preset.promptTemplate
 * @param extra optional user direction (capped)
 */
export function buildGeneratePrompt(template: string, extra?: unknown): string {
  const custom = sanitizeExtra(extra);
  if (!custom) return template;
  return `${template} Additional direction: ${custom}.`;
}
