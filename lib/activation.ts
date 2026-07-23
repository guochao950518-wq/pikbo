/**
 * First-session activation checklist (local only).
 * Research: outcome-driven onboarding > multi-step tours; checklists lift activation.
 */

const KEY = "pikbo_activation_v1";

export type ActivationState = {
  dismissed: boolean;
  choseJob: boolean;
  addedPhoto: boolean;
  generated: boolean;
  savedOrShared: boolean;
  updatedAt: string;
};

const empty = (): ActivationState => ({
  dismissed: false,
  choseJob: false,
  addedPhoto: false,
  generated: false,
  savedOrShared: false,
  updatedAt: new Date().toISOString(),
});

export function loadActivation(): ActivationState {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty();
    const o = JSON.parse(raw) as Partial<ActivationState>;
    return { ...empty(), ...o };
  } catch {
    return empty();
  }
}

export function saveActivation(patch: Partial<ActivationState>): ActivationState {
  const next = {
    ...loadActivation(),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // quota
  }
  return next;
}

export function activationProgress(s: ActivationState): {
  done: number;
  total: number;
  complete: boolean;
} {
  const steps = [s.choseJob, s.addedPhoto, s.generated, s.savedOrShared] as const;
  const done = steps.filter(Boolean).length;
  return { done, total: steps.length, complete: done >= steps.length };
}
