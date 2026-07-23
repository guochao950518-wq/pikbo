/**
 * Build the Seedance prompt from preset template + user extra.
 * Always keep the toy-first template as the base (never freeform-only).
 * Growth rule (docs/growth/DIFFERENTIATION.md): lock toy identity — not a human face.
 */

export const MAX_EXTRA_CHARS = 400;

/** Appended when template does not already state identity lock. */
export const TOY_IDENTITY_LOCK =
  "Keep the exact same toy/figure identity, colors, and paint apps — do not turn it into a human or different character.";

export function sanitizeExtra(extra: unknown): string {
  if (typeof extra !== "string") return "";
  return extra.trim().slice(0, MAX_EXTRA_CHARS);
}

function withIdentityLock(template: string): string {
  const t = template.trim();
  if (!t) return TOY_IDENTITY_LOCK;
  // Avoid double-appending if preset already locks identity.
  if (/exact same (toy|figure)|keep the (same )?toy|identity lock|do not turn it into a human/i.test(t)) {
    return t;
  }
  return `${t} ${TOY_IDENTITY_LOCK}`;
}

/**
 * @param template preset.promptTemplate
 * @param extra optional user direction (capped)
 */
export function buildGeneratePrompt(template: string, extra?: unknown): string {
  const base = withIdentityLock(template);
  const custom = sanitizeExtra(extra);
  if (!custom) return base;
  return `${base} Additional direction: ${custom}.`;
}
