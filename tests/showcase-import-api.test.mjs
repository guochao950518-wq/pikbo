import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("showcase APIs use the shared project registry and return a typed 404", async () => {
  const collection = await source("app/api/showcase/route.ts");
  const detail = await source("app/api/showcase/[slug]/route.ts");
  assert.match(collection, /SHOWCASE_PROJECTS/);
  assert.match(collection, /projects:\s*SHOWCASE_PROJECTS/);
  assert.match(detail, /getShowcaseProject\(slug\)/);
  assert.match(detail, /showcase_not_found/);
  assert.match(detail, /status:\s*404/);
});

test("product import exposes testable SSRF and metadata helpers", async () => {
  const importHelpers = await import(new URL("lib/product-import.ts", root));

  for (const address of [
    "0.0.0.0",
    "10.0.0.1",
    "100.64.0.1",
    "127.0.0.1",
    "169.254.169.254",
    "172.16.0.1",
    "192.168.1.1",
    "198.51.100.1",
    "224.0.0.1",
    "::1",
    "fc00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
    "2001:db8::1",
  ]) {
    assert.equal(importHelpers.isBlockedIpAddress(address), true, `${address} must be blocked`);
  }
  assert.equal(importHelpers.isBlockedIpAddress("8.8.8.8"), false);
  assert.equal(importHelpers.isBlockedIpAddress("2606:4700:4700::1111"), false);

  await assert.rejects(
    importHelpers.assertSafeImportUrl("http://localhost/product", async () => ["8.8.8.8"]),
    /Private or reserved hosts/
  );
  await assert.rejects(
    importHelpers.assertSafeImportUrl("https://user:pass@shop.example.com/product", async () => [
      "8.8.8.8",
    ]),
    /credentials/
  );
  await assert.rejects(
    importHelpers.assertSafeImportUrl("https://shop.invalid/product", async () => ["8.8.8.8"]),
    /Private or reserved hosts/
  );
  await assert.rejects(
    importHelpers.assertSafeImportUrl("https://shop.test/product", async () => ["127.0.0.1"]),
    /Private or reserved hosts/
  );
  await assert.rejects(
    importHelpers.assertSafeImportUrl("https://internal.pikbo.dev/product", async () => [
      "127.0.0.1",
    ]),
    /Private or reserved hosts/
  );
  await assert.rejects(
    importHelpers.assertSafeImportUrl("http://2130706433/product", async () => ["8.8.8.8"]),
    /Private or reserved hosts/
  );
  await assert.rejects(
    importHelpers.assertSafeImportUrl("file:///etc/passwd", async () => ["8.8.8.8"]),
    /Only HTTP\(S\)/
  );

  const safe = await importHelpers.assertSafeImportUrl(
    "https://shop.pikbo.dev/product#reviews",
    async () => ["8.8.8.8"]
  );
  assert.equal(safe.toString(), "https://shop.pikbo.dev/product");

});

test("product metadata parser normalizes text, URLs, and image duplicates", async () => {
  const importHelpers = await import(new URL("lib/product-import.ts", root));
  const metadata = importHelpers.parseProductMetadata(
    `<!doctype html>
      <html><head>
        <title>Fallback title</title>
        <meta content="Orbit &amp; Glow" property="og:title">
        <meta name="description" content="  A   collectible &quot;hero&quot;. ">
        <meta property="og:image" content="/images/hero.webp#crop">
        <meta property="og:image:url" content="https://shop.pikbo.dev/images/hero.webp">
        <meta property="twitter:image" content="http://127.0.0.1/private.png">
      </head></html>`,
    new URL("https://shop.pikbo.dev/products/orbit")
  );

  assert.deepEqual(metadata, {
    sourceUrl: "https://shop.pikbo.dev/products/orbit",
    title: "Orbit & Glow",
    description: 'A collectible "hero".',
    images: ["https://shop.pikbo.dev/images/hero.webp"],
    frontImageDataUrl: null,
  });
});

test("front image proxy validates redirects, type, signature, and returns a data URL", async () => {
  const importHelpers = await import(new URL("lib/product-import.ts", root));
  const publicResolver = async () => ["8.8.8.8"];
  const png = Uint8Array.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00,
  ]);
  const dataUrl = await importHelpers.fetchFrontImageDataUrl(
    "https://cdn.pikbo.dev/toy.png",
    AbortSignal.timeout(1_000),
    publicResolver,
    async () => new Response(png, { headers: { "content-type": "image/png" } })
  );
  assert.equal(dataUrl, `data:image/png;base64,${Buffer.from(png).toString("base64")}`);

  let fetchCount = 0;
  await assert.rejects(
    importHelpers.fetchFrontImageDataUrl(
      "https://cdn.pikbo.dev/toy.png",
      AbortSignal.timeout(1_000),
      publicResolver,
      async () => {
        fetchCount += 1;
        return new Response(null, {
          status: 302,
          headers: { location: "http://127.0.0.1/admin.png" },
        });
      }
    ),
    /Private or reserved hosts/
  );
  assert.equal(fetchCount, 1, "blocked redirect must not be fetched");

  await assert.rejects(
    importHelpers.fetchFrontImageDataUrl(
      "https://cdn.pikbo.dev/toy.png",
      AbortSignal.timeout(1_000),
      publicResolver,
      async () =>
        new Response("<html>not an image</html>", {
          headers: { "content-type": "image/png" },
        })
    ),
    /does not match its declared type/
  );
});

test("product import route enforces rights, manual redirects, timeout, HTML, and size limits", async () => {
  const route = await source("app/api/products/import/route.ts");
  const helpers = await source("lib/product-import.ts");
  assert.match(route, /body\.rightsConfirmed !== true/);
  assert.match(helpers, /redirect:\s*"manual"/);
  assert.match(helpers, /assertSafeImportUrl\(redirectUrl\.toString\(\)\)/);
  assert.match(helpers, /lookup:\s*lookupPinnedAddress/);
  assert.match(helpers, /"accept-encoding":\s*"identity"/);
  assert.match(route, /AbortSignal\.timeout\(FETCH_TIMEOUT_MS\)/);
  assert.match(helpers, /MAX_RESPONSE_BYTES/);
  assert.match(helpers, /MAX_IMAGE_BYTES/);
  assert.match(helpers, /content-type/);
  assert.match(helpers, /html_required/);
  assert.match(route, /frontImageDataUrl/);
  assert.doesNotMatch(route, /persist|insert|upsert|supabase/i);
});
