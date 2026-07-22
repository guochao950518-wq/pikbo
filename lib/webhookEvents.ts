import { promises as fs } from "fs";
import path from "path";

type EventClaim = {
  duplicate: boolean;
  release: () => Promise<void>;
};

function supabaseConfig() {
  return {
    url: process.env.SUPABASE_URL?.replace(/\/$/, "") ?? "",
    key: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  };
}

async function claimInSupabase(
  provider: string,
  eventId: string
): Promise<EventClaim | null> {
  const { url, key } = supabaseConfig();
  if (!url || !key) return null;
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
  const response = await fetch(
    `${url}/rest/v1/rpc/pikbo_claim_webhook_event`,
    {
      method: "POST",
      headers,
      cache: "no-store",
      body: JSON.stringify({
        p_event_id: eventId,
        p_provider: provider,
        p_request_id: eventId,
      }),
    }
  );
  if (!response.ok) {
    throw new Error(`Could not claim ${provider} webhook (${response.status})`);
  }
  const claimed = (await response.json()) === true;
  return {
    duplicate: !claimed,
    release: claimed
      ? async () => {
          const released = await fetch(
            `${url}/rest/v1/pikbo_webhook_events?id=eq.${encodeURIComponent(eventId)}&provider=eq.${encodeURIComponent(provider)}`,
            { method: "DELETE", headers, cache: "no-store" }
          );
          if (!released.ok) {
            throw new Error(
              `Could not release ${provider} webhook claim (${released.status})`
            );
          }
        }
      : async () => undefined,
  };
}

function safeEventId(provider: string, eventId: string) {
  return `${provider}-${eventId}`.replace(/[^a-zA-Z0-9_-]/g, "_");
}

/**
 * Atomically claims a webhook event in the local durable-data fallback.
 * A Supabase-backed deployment should point PIKBO_DATA_DIR at persistent disk
 * until the production store adapter is enabled.
 */
export async function claimWebhookEvent(
  provider: string,
  eventId: string
): Promise<EventClaim> {
  const durableClaim = await claimInSupabase(provider, eventId);
  if (durableClaim) return durableClaim;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "Durable webhook idempotency is not configured; Supabase is required in production"
    );
  }
  const dir = path.join(
    process.env.PIKBO_DATA_DIR || path.join(process.cwd(), "data"),
    "webhook-events"
  );
  await fs.mkdir(dir, { recursive: true });
  const file = path.join(dir, `${safeEventId(provider, eventId)}.json`);

  try {
    const handle = await fs.open(file, "wx");
    await handle.writeFile(
      JSON.stringify({ provider, eventId, claimedAt: new Date().toISOString() })
    );
    await handle.close();
    return {
      duplicate: false,
      release: async () => {
        await fs.unlink(file).catch(() => undefined);
      },
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EEXIST") {
      return { duplicate: true, release: async () => undefined };
    }
    throw error;
  }
}
