"use client";

import type { AssetRole } from "@/components/studio/generation-client";

export type ToyAssetDraft = {
  role: AssetRole;
  dataUrl: string;
  fileName: string;
};

const SLOTS: Array<{
  role: AssetRole;
  label: string;
  hint: string;
  required?: boolean;
}> = [
  { role: "front", label: "Front", hint: "Hero reference", required: true },
  { role: "side", label: "Side", hint: "Saved reference" },
  { role: "back", label: "Back", hint: "Paint reference" },
  { role: "packaging", label: "Packaging", hint: "Campaign reference" },
];

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Use a PNG, JPG, or WebP image."));
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error("Each reference image must be smaller than 10 MB."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("This image could not be read."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export function ToyAssetGrid({
  assets,
  onChange,
  onError,
  compact = false,
}: {
  assets: Partial<Record<AssetRole, ToyAssetDraft>>;
  onChange: (assets: Partial<Record<AssetRole, ToyAssetDraft>>) => void;
  onError: (message: string | null) => void;
  compact?: boolean;
}) {
  async function select(role: AssetRole, file?: File | null) {
    if (!file) return;
    try {
      const dataUrl = await readImage(file);
      onChange({ ...assets, [role]: { role, dataUrl, fileName: file.name } });
      onError(null);
    } catch (error) {
      onError(error instanceof Error ? error.message : "Image upload failed.");
    }
  }

  return (
    <div className={`grid gap-2 ${compact ? "grid-cols-2" : "sm:grid-cols-2"}`}>
      {SLOTS.map((slot) => {
        const asset = assets[slot.role];
        return (
          <div
            key={slot.role}
            className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-soft)]"
          >
            <label
              className={`group relative flex cursor-pointer items-center justify-center overflow-hidden ${
                compact ? "h-28" : "h-36"
              }`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                void select(slot.role, event.dataTransfer.files?.[0]);
              }}
            >
              {asset ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.dataUrl}
                  alt={`${slot.label} toy reference`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="px-3 text-center">
                  <div className="text-xl">{slot.required ? "🧸" : "+"}</div>
                  <div className="mt-1 text-xs font-semibold">
                    {slot.label} {slot.required ? "*" : ""}
                  </div>
                  <div className="mt-0.5 text-[10px] text-[var(--fg-dim)]">
                    {slot.hint}
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="sr-only"
                aria-label={`Upload ${slot.label.toLowerCase()} toy reference${
                  slot.required ? ", required" : ", optional"
                }`}
                onChange={(event) => void select(slot.role, event.target.files?.[0])}
              />
              {asset && (
                <span className="absolute inset-x-2 bottom-2 rounded-md bg-black/70 px-2 py-1 text-center text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  Replace {slot.label.toLowerCase()}
                </span>
              )}
            </label>
            {asset && (
              <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] px-2 py-1.5">
                <span className="min-w-0 truncate text-[9px] text-[var(--fg-dim)]">
                  {asset.fileName}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = { ...assets };
                    delete next[slot.role];
                    onChange(next);
                  }}
                  className="text-[9px] text-[var(--fg-muted)] hover:text-[var(--brand)]"
                  aria-label={`Remove ${slot.label.toLowerCase()} reference`}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
