import { isIP } from "node:net";
import { lookup } from "node:dns/promises";
import { request as requestHttp } from "node:http";
import { request as requestHttps } from "node:https";
import { Readable } from "node:stream";
import type { LookupFunction } from "node:net";


export const FETCH_TIMEOUT_MS = 8_000;
const MAX_RESPONSE_BYTES = 1_000_000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_REDIRECTS = 4;
const MAX_URL_LENGTH = 2_048;
const SUPPORTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

type AddressResolver = (hostname: string) => Promise<string[]>;
type ResourceFetcher = (url: URL, init: RequestInit) => Promise<Response>;

type ImportedProductMetadata = {
  sourceUrl: string;
  title: string;
  description: string;
  images: string[];
  frontImageDataUrl: string | null;
};

export class ProductImportError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
function normalizeHostname(hostname: string) {
  return hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "").toLowerCase();
}

function ipv4ToNumber(address: string) {
  const octets = address.split(".").map(Number);
  if (
    octets.length !== 4 ||
    octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)
  ) {
    return null;
  }
  return (
    ((octets[0] * 0x1000000 + octets[1] * 0x10000 + octets[2] * 0x100 + octets[3]) >>>
      0)
  );
}

function inIpv4Cidr(value: number, base: number, prefix: number) {
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  return (value & mask) === (base & mask);
}

const BLOCKED_IPV4_RANGES: Array<[number, number]> = [
  [0x00000000, 8],
  [0x0a000000, 8],
  [0x64400000, 10],
  [0x7f000000, 8],
  [0xa9fe0000, 16],
  [0xac100000, 12],
  [0xc0000000, 24],
  [0xc0000200, 24],
  [0xc0586300, 24],
  [0xc0a80000, 16],
  [0xc6120000, 15],
  [0xc6336400, 24],
  [0xcb007100, 24],
  [0xe0000000, 4],
  [0xf0000000, 4],
];

function expandIpv6(address: string) {
  const normalized = address.toLowerCase().split("%")[0];
  const halves = normalized.split("::");
  if (halves.length > 2) return null;

  const parseHalf = (half: string) => {
    if (!half) return [] as number[];
    const parts = half.split(":");
    const words: number[] = [];
    for (const part of parts) {
      if (part.includes(".")) {
        const ipv4 = ipv4ToNumber(part);
        if (ipv4 === null) return null;
        words.push((ipv4 >>> 16) & 0xffff, ipv4 & 0xffff);
        continue;
      }
      if (!/^[0-9a-f]{1,4}$/.test(part)) return null;
      words.push(Number.parseInt(part, 16));
    }
    return words;
  };

  const left = parseHalf(halves[0]);
  const right = parseHalf(halves[1] ?? "");
  if (!left || !right) return null;
  const missing = 8 - left.length - right.length;
  if ((halves.length === 1 && missing !== 0) || missing < 0) return null;
  return [...left, ...Array.from({ length: missing }, () => 0), ...right];
}

export function isBlockedIpAddress(address: string) {
  const normalized = normalizeHostname(address);
  const family = isIP(normalized);
  if (family === 4) {
    const value = ipv4ToNumber(normalized);
    return (
      value === null ||
      BLOCKED_IPV4_RANGES.some(([base, prefix]) => inIpv4Cidr(value, base, prefix))
    );
  }
  if (family !== 6) return true;

  const words = expandIpv6(normalized);
  if (!words) return true;
  const [first, second] = words;

  if (words.every((word) => word === 0) || words.slice(0, 7).every((word) => word === 0)) {
    return true;
  }
  if ((first & 0xfe00) === 0xfc00) return true; // Unique-local fc00::/7.
  if ((first & 0xffc0) === 0xfe80) return true; // Link-local fe80::/10.
  if ((first & 0xff00) === 0xff00) return true; // Multicast ff00::/8.
  if (first === 0x0064 && second === 0xff9b) return true; // NAT64 prefixes.
  if (first === 0x0100 && second === 0) return true; // Discard-only 100::/64.
  if (first === 0x2002) return true; // 6to4 can conceal an IPv4 target.
  if (first === 0x2001) {
    if (second === 0 || second === 2 || second === 0x0db8) return true;
    if ((second & 0xfff0) === 0x0010 || (second & 0xfff0) === 0x0020) return true;
  }

  const isIpv4Mapped =
    words.slice(0, 5).every((word) => word === 0) && words[5] === 0xffff;
  const isIpv4Compatible = words.slice(0, 6).every((word) => word === 0);
  if (isIpv4Mapped || isIpv4Compatible) {
    const embedded = ((words[6] << 16) | words[7]) >>> 0;
    return BLOCKED_IPV4_RANGES.some(([base, prefix]) =>
      inIpv4Cidr(embedded, base, prefix)
    );
  }

  return false;
}

function isBlockedHostname(hostname: string) {
  const normalized = normalizeHostname(hostname);
  if (!normalized) return true;
  if (isIP(normalized)) return isBlockedIpAddress(normalized);
  return [
    "localhost",
    ".localhost",
    ".local",
    ".internal",
    ".home",
    ".lan",
    ".test",
    ".invalid",
    ".example",
    ".onion",
  ].some((suffix) => normalized === suffix.replace(/^\./, "") || normalized.endsWith(suffix));
}

async function resolveHostnameAddresses(hostname: string) {
  const results = await lookup(hostname, { all: true, verbatim: true });
  return results.map((result) => result.address);
}

async function resolveSafeTarget(
  input: string,
  resolveAddresses: AddressResolver = resolveHostnameAddresses
) {
  if (!input || input.length > MAX_URL_LENGTH) {
    throw new ProductImportError("invalid_url", "Enter a valid product URL", 400);
  }

  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new ProductImportError("invalid_url", "Enter a valid product URL", 400);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ProductImportError("invalid_url", "Only HTTP(S) product URLs are allowed", 400);
  }
  if (url.username || url.password) {
    throw new ProductImportError("unsafe_url", "URLs with credentials are not allowed", 400);
  }

  const hostname = normalizeHostname(url.hostname);
  if (isBlockedHostname(hostname)) {
    throw new ProductImportError("unsafe_url", "Private or reserved hosts are not allowed", 400);
  }

  let addresses = [hostname];
  if (!isIP(hostname)) {
    try {
      addresses = await resolveAddresses(hostname);
    } catch {
      throw new ProductImportError("unreachable_host", "The product host could not be resolved", 422);
    }
    if (!addresses.length || addresses.some(isBlockedIpAddress)) {
      throw new ProductImportError("unsafe_url", "Private or reserved hosts are not allowed", 400);
    }
  }

  url.hash = "";
  return { url, address: addresses[0], family: isIP(addresses[0]) as 4 | 6 };
}

export async function assertSafeImportUrl(
  input: string,
  resolveAddresses: AddressResolver = resolveHostnameAddresses
) {
  return (await resolveSafeTarget(input, resolveAddresses)).url;
}

async function fetchPinnedResource(
  input: URL,
  init: RequestInit,
  resolveAddresses: AddressResolver = resolveHostnameAddresses
) {
  const target = await resolveSafeTarget(input.toString(), resolveAddresses);
  const requestResource = target.url.protocol === "https:" ? requestHttps : requestHttp;
  const lookupPinnedAddress: LookupFunction = (_hostname, _options, callback) => {
    callback(null, target.address, target.family);
  };

  return new Promise<Response>((resolve, reject) => {
    const request = requestResource(
      target.url,
      {
        headers: {
          ...Object.fromEntries(new Headers(init.headers).entries()),
          "accept-encoding": "identity",
        },
        lookup: lookupPinnedAddress,
        method: "GET",
        signal: init.signal ?? undefined,
      },
      (incoming) => {
        const headers = new Headers();
        for (const [name, value] of Object.entries(incoming.headers)) {
          if (Array.isArray(value)) {
            for (const item of value) headers.append(name, item);
          } else if (value !== undefined) {
            headers.set(name, value);
          }
        }
        const status = incoming.statusCode ?? 502;
        const hasBody = status !== 204 && status !== 304;
        const body = hasBody
          ? (Readable.toWeb(incoming) as ReadableStream<Uint8Array>)
          : null;
        resolve(
          new Response(body, {
            headers,
            status,
            statusText: incoming.statusMessage,
          })
        );
      }
    );
    request.once("error", reject);
    request.end();
  });
}

function decodeHtmlEntities(value: string) {
  const named: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    hellip: "…",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
    let point: number | null = null;
    if (code.startsWith("#x") || code.startsWith("#X")) {
      point = Number.parseInt(code.slice(2), 16);
    } else if (code.startsWith("#")) {
      point = Number.parseInt(code.slice(1), 10);
    }
    if (point !== null) {
      return Number.isInteger(point) && point >= 0 && point <= 0x10ffff
        ? String.fromCodePoint(point)
        : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function cleanText(value: string, maxLength: number) {
  return decodeHtmlEntities(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function parseAttributes(tag: string) {
  const attributes = new Map<string, string>();
  const pattern = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  for (const match of tag.matchAll(pattern)) {
    attributes.set(match[1].toLowerCase(), decodeHtmlEntities(match[2] ?? match[3] ?? match[4]));
  }
  return attributes;
}

function uniqueSafeImageUrls(values: string[], pageUrl: URL) {
  const images: string[] = [];
  for (const value of values) {
    try {
      const image = new URL(value, pageUrl);
      const hostname = normalizeHostname(image.hostname);
      if (
        (image.protocol !== "http:" && image.protocol !== "https:") ||
        image.username ||
        image.password ||
        isBlockedHostname(hostname)
      ) {
        continue;
      }
      image.hash = "";
      const normalized = image.toString();
      if (!images.includes(normalized)) images.push(normalized);
    } catch {
      // Ignore malformed metadata URLs while preserving the rest of the product metadata.
    }
  }
  return images.slice(0, 12);
}

export function parseProductMetadata(html: string, pageUrl: URL): ImportedProductMetadata {
  const metadata = new Map<string, string[]>();
  for (const match of html.matchAll(/<meta\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi)) {
    const attributes = parseAttributes(match[0]);
    const key = (attributes.get("property") ?? attributes.get("name") ?? "").toLowerCase();
    const content = attributes.get("content")?.trim();
    if (!key || !content) continue;
    metadata.set(key, [...(metadata.get(key) ?? []), content]);
  }

  const titleTag = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const title = cleanText(metadata.get("og:title")?.[0] ?? titleTag, 200) || pageUrl.hostname;
  const description = cleanText(
    metadata.get("og:description")?.[0] ?? metadata.get("description")?.[0] ?? "",
    1_000
  );
  const imageValues = [
    ...(metadata.get("og:image") ?? []),
    ...(metadata.get("og:image:url") ?? []),
    ...(metadata.get("og:image:secure_url") ?? []),
    ...(metadata.get("twitter:image") ?? []),
    ...(metadata.get("twitter:image:src") ?? []),
  ];

  return {
    sourceUrl: pageUrl.toString(),
    title,
    description,
    images: uniqueSafeImageUrls(imageValues, pageUrl),
    frontImageDataUrl: null,
  };
}

function responseMediaType(response: Response) {
  return response.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() ?? "";
}

async function readLimitedBytes(response: Response, maxBytes: number) {
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new ProductImportError("image_too_large", "Product image is larger than 10 MB", 413);
  }
  if (!response.body) return new Uint8Array();

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      throw new ProductImportError("image_too_large", "Product image is larger than 10 MB", 413);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function hasExpectedImageSignature(bytes: Uint8Array, contentType: string) {
  if (contentType === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (contentType === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return signature.every((byte, index) => bytes[index] === byte);
  }
  if (contentType === "image/webp") {
    return (
      bytes.length >= 12 &&
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
    );
  }
  if (contentType === "image/avif") {
    if (bytes.length < 12 || String.fromCharCode(...bytes.slice(4, 8)) !== "ftyp") return false;
    const brands = String.fromCharCode(...bytes.slice(8, Math.min(bytes.length, 64)));
    return brands.includes("avif") || brands.includes("avis");
  }
  return false;
}

export async function fetchFrontImageDataUrl(
  input: string,
  signal: AbortSignal,
  resolveAddresses: AddressResolver = resolveHostnameAddresses,
  fetchImage: ResourceFetcher = (url, init) =>
    fetchPinnedResource(url, init, resolveAddresses)
) {
  let currentUrl = await assertSafeImportUrl(input, resolveAddresses);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetchImage(currentUrl, {
      cache: "no-store",
      headers: {
        accept: "image/avif,image/webp,image/png,image/jpeg",
        "user-agent": "PIKBO product image importer/1.0",
      },
      redirect: "manual",
      signal,
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      await response.body?.cancel();
      if (!location) {
        throw new ProductImportError("invalid_image_redirect", "Product image returned an invalid redirect", 422);
      }
      if (redirectCount === MAX_REDIRECTS) {
        throw new ProductImportError("too_many_image_redirects", "Product image redirected too many times", 422);
      }
      let redirectUrl: URL;
      try {
        redirectUrl = new URL(location, currentUrl);
      } catch {
        throw new ProductImportError("invalid_image_redirect", "Product image returned an invalid redirect", 422);
      }
      currentUrl = await assertSafeImportUrl(redirectUrl.toString(), resolveAddresses);
      continue;
    }

    if (!response.ok) {
      await response.body?.cancel();
      throw new ProductImportError(
        "image_upstream_error",
        `Product image returned HTTP ${response.status}`,
        422
      );
    }
    const contentType = responseMediaType(response);
    if (!SUPPORTED_IMAGE_TYPES.has(contentType)) {
      await response.body?.cancel();
      throw new ProductImportError(
        "unsupported_image_type",
        "Product image must be JPEG, PNG, WebP, or AVIF",
        415
      );
    }
    const bytes = await readLimitedBytes(response, MAX_IMAGE_BYTES);
    if (!hasExpectedImageSignature(bytes, contentType)) {
      throw new ProductImportError(
        "invalid_image",
        "Product image content does not match its declared type",
        422
      );
    }
    return `data:${contentType};base64,${Buffer.from(bytes).toString("base64")}`;
  }

  throw new ProductImportError("too_many_image_redirects", "Product image redirected too many times", 422);
}

async function readLimitedHtml(response: Response) {
  const declaredLength = Number(response.headers.get("content-length") ?? 0);
  if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) {
    throw new ProductImportError("response_too_large", "Product page is too large to import", 413);
  }
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let html = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new ProductImportError("response_too_large", "Product page is too large to import", 413);
    }
    html += decoder.decode(value, { stream: true });
  }
  return html + decoder.decode();
}

export async function fetchProductPage(initialUrl: URL, signal: AbortSignal) {
  let currentUrl = initialUrl;
  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetchPinnedResource(currentUrl, {
      cache: "no-store",
      headers: {
        accept: "text/html,application/xhtml+xml;q=0.9",
        "user-agent": "PIKBO product metadata importer/1.0",
      },
      redirect: "manual",
      signal,
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      await response.body?.cancel();
      if (!location) {
        throw new ProductImportError("invalid_redirect", "Product page returned an invalid redirect", 422);
      }
      if (redirectCount === MAX_REDIRECTS) {
        throw new ProductImportError("too_many_redirects", "Product page redirected too many times", 422);
      }
      let redirectUrl: URL;
      try {
        redirectUrl = new URL(location, currentUrl);
      } catch {
        throw new ProductImportError("invalid_redirect", "Product page returned an invalid redirect", 422);
      }
      currentUrl = await assertSafeImportUrl(redirectUrl.toString());
      continue;
    }

    if (!response.ok) {
      await response.body?.cancel();
      throw new ProductImportError(
        "upstream_error",
        `Product page returned HTTP ${response.status}`,
        422
      );
    }
    const contentType = responseMediaType(response);
    if (contentType !== "text/html" && contentType !== "application/xhtml+xml") {
      await response.body?.cancel();
      throw new ProductImportError("html_required", "The URL must return an HTML product page", 415);
    }
    return { html: await readLimitedHtml(response), finalUrl: currentUrl };
  }

  throw new ProductImportError("too_many_redirects", "Product page redirected too many times", 422);
}
