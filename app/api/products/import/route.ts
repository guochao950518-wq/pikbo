import {
  FETCH_TIMEOUT_MS,
  ProductImportError,
  assertSafeImportUrl,
  fetchFrontImageDataUrl,
  fetchProductPage,
  parseProductMetadata,
} from "@/lib/product-import";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    let body: { url?: unknown; rightsConfirmed?: unknown };
    try {
      body = (await request.json()) as { url?: unknown; rightsConfirmed?: unknown };
    } catch {
      throw new ProductImportError("invalid_request", "A JSON request body is required", 400);
    }

    if (body.rightsConfirmed !== true) {
      throw new ProductImportError(
        "rights_confirmation_required",
        "Confirm that you own or are authorized to use the product assets",
        400
      );
    }
    if (typeof body.url !== "string") {
      throw new ProductImportError("invalid_url", "Enter a valid product URL", 400);
    }

    const initialUrl = await assertSafeImportUrl(body.url.trim());
    const signal = AbortSignal.timeout(FETCH_TIMEOUT_MS);
    const { html, finalUrl } = await fetchProductPage(initialUrl, signal);
    const metadata = parseProductMetadata(html, finalUrl);
    if (metadata.images[0]) {
      metadata.frontImageDataUrl = await fetchFrontImageDataUrl(metadata.images[0], signal);
    }
    return Response.json({ metadata });
  } catch (error) {
    if (error instanceof ProductImportError) {
      return Response.json(
        { error: error.code, message: error.message },
        { status: error.status }
      );
    }
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return Response.json(
        { error: "import_timeout", message: "Product page import timed out" },
        { status: 504 }
      );
    }
    return Response.json(
      { error: "import_failed", message: "The product page could not be imported" },
      { status: 502 }
    );
  }
}
