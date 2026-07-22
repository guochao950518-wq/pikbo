import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

const MAX_SOURCE_BYTES = 100 * 1024 * 1024;

export function watermarkWorkerConfigured() {
  return Boolean(process.env.FFMPEG_PATH);
}

function runFfmpeg(binary: string, args: string[], timeoutMs = 120_000) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(binary, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr = `${stderr}${String(chunk)}`.slice(-8_000);
    });
    const timeout = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("Watermark worker timed out"));
    }, timeoutMs);
    child.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once("close", (code) => {
      clearTimeout(timeout);
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg watermark failed (${code}): ${stderr}`));
    });
  });
}

/**
 * Burns the free-tier mark into the actual MP4 bytes. The caller is responsible
 * for saving the returned buffer in private object storage and exposing only a
 * signed delivery URL. No client-provided text reaches the ffmpeg filter.
 */
export async function burnFreeTierWatermark(sourceUrl: string): Promise<Buffer> {
  const binary = process.env.FFMPEG_PATH;
  if (!binary) throw new Error("FFMPEG_PATH is required for free-tier delivery");

  const response = await fetch(sourceUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`Could not fetch generated video (${response.status})`);
  const declaredSize = Number(response.headers.get("content-length") || 0);
  if (declaredSize > MAX_SOURCE_BYTES) throw new Error("Generated video exceeds watermark limit");
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.byteLength > MAX_SOURCE_BYTES) throw new Error("Generated video exceeds watermark limit");

  const temp = await fs.mkdtemp(path.join(os.tmpdir(), "pikbo-watermark-"));
  const input = path.join(temp, "source.mp4");
  const output = path.join(temp, "watermarked.mp4");
  try {
    await fs.writeFile(input, bytes);
    await runFfmpeg(binary, [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      input,
      "-vf",
      "drawtext=text='PIKBO  FREE PREVIEW':fontcolor=white@0.92:fontsize=h/28:box=1:boxcolor=black@0.38:boxborderw=12:x=w-tw-24:y=h-th-24",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "22",
      "-c:a",
      "aac",
      "-movflags",
      "+faststart",
      output,
    ]);
    return await fs.readFile(output);
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
}
