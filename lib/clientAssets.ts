/**
 * Browser helper — register a data-URL image into the local Phase D asset path
 * so generate can send assetId instead of re-posting large Base64.
 */

export async function registerLocalAsset(
  dataUrl: string
): Promise<{ assetId: string } | null> {
  if (!dataUrl.startsWith("data:image")) return null;
  try {
    const comma = dataUrl.indexOf(",");
    const meta = dataUrl.slice(0, comma);
    const contentType =
      /data:(image\/[a-zA-Z0-9.+-]+)/.exec(meta)?.[1] || "image/jpeg";
    // Rough decoded size estimate for preflight (base64 → ~3/4).
    const approxBytes = Math.floor(((dataUrl.length - comma) * 3) / 4);

    const prep = await fetch("/api/assets/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentType, byteLength: approxBytes }),
    });
    const prepBody = (await prep.json()) as {
      ok?: boolean;
      assetId?: string;
      uploadUrl?: string;
    };
    if (!prep.ok || !prepBody.ok || !prepBody.assetId || !prepBody.uploadUrl) {
      return null;
    }

    const blob = await (await fetch(dataUrl)).blob();
    const put = await fetch(prepBody.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: blob,
    });
    if (!put.ok) return null;
    return { assetId: prepBody.assetId };
  } catch {
    return null;
  }
}
