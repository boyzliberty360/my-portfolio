/**
 * Captures a screenshot of every project's live URL into public/images/projects/
 * and writes the path back onto the project record.
 *
 * Static screenshots replaced live <iframe> embeds: many sites refuse to be
 * framed at all (X-Frame-Options / frame-ancestors), and framing a full
 * third-party app on the homepage is expensive for the visitor.
 *
 * Requires Chromium and ImageMagick on PATH. Both are checked up front.
 *
 * Projects usually live in Vercel Blob rather than in the committed JSON, so by
 * default this reads the running site's public GET /api/projects and captures
 * whatever is actually published. Files are named by the same slug rule
 * Card.jsx uses, so a captured screenshot is picked up with no record editing.
 *
 *   npm run previews                       # live list via http://localhost:5173
 *   npm run previews -- --from=https://your-site.vercel.app
 *   npm run previews -- --save             # also store the path on each record
 *   npm run previews -- --local            # only public/data/projects.json
 *   npm run previews -- --force            # recapture even if one exists
 *   npm run previews -- --url=https://example.com --name=Example
 *
 * --save needs ADMIN_PASSWORD (read from .env) and makes the preview survive a
 * project being renamed, which would otherwise break the slug lookup.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const run = promisify(execFile);

const PROJECTS_FILE = path.resolve("public", "data", "projects.json");
const OUTPUT_DIR = path.resolve("public", "images", "projects");
const PUBLIC_PREFIX = "/images/projects";
const DEFAULT_ORIGIN = "http://localhost:5173";

const VIEWPORT = { width: 1280, height: 800 };
const OUTPUT_WIDTH = 900;
const WEBP_QUALITY = 82;
// Give client-rendered pages time to paint before the shutter.
const SETTLE_MS = 3500;
const NAVIGATION_TIMEOUT_MS = 60_000;

const CHROMIUM_CANDIDATES = ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable"];
const MAGICK_CANDIDATES = ["magick", "convert"];

const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(`--${name}`);
const getArg = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.split("=").slice(1).join("=");

async function firstAvailable(candidates, label) {
  for (const candidate of candidates) {
    try {
      await run("which", [candidate]);
      return candidate;
    } catch {
      // Try the next one.
    }
  }
  throw new Error(
    `${label} not found. Looked for: ${candidates.join(", ")}.\n` +
      `Install one of them, or add preview images manually in ${PUBLIC_PREFIX}/.`,
  );
}

// Reads ADMIN_PASSWORD out of .env without adding a dotenv dependency.
async function readAdminPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD.trim();
  try {
    const env = await fs.readFile(path.resolve(".env"), "utf8");
    for (const line of env.split("\n")) {
      const match = line.match(/^\s*ADMIN_PASSWORD\s*=\s*(.*)$/);
      if (match) return match[1].trim().replace(/^["']|["']$/g, "");
    }
  } catch {
    // No .env locally; fall through to the error below.
  }
  return null;
}

async function saveImagePaths(endpoint, updates) {
  const password = await readAdminPassword();
  if (!password) throw new Error("ADMIN_PASSWORD not found in the environment or .env");

  const login = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "login", password }),
  });
  if (!login.ok) throw new Error(`admin login failed (${login.status})`);
  const { token } = await login.json();

  for (const { id, name, image } of updates) {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, patch: { image } }),
    });
    console.log(`  ${response.ok ? "saved" : `FAILED (${response.status})`}  ${name}`);
  }
}

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "project";

async function capture(chromium, magick, { url, slug }) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "preview-"));
  const rawShot = path.join(tempDir, "shot.png");
  const target = path.join(OUTPUT_DIR, `${slug}.webp`);

  try {
    await run(
      chromium,
      [
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        "--force-color-profile=srgb",
        `--virtual-time-budget=${SETTLE_MS}`,
        `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
        `--screenshot=${rawShot}`,
        url,
      ],
      { timeout: NAVIGATION_TIMEOUT_MS },
    );

    // Chromium exits 0 even when a page fails to load, so verify real output.
    const { size } = await fs.stat(rawShot);
    if (size < 1024) throw new Error("screenshot came back empty");

    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await run(magick, [rawShot, "-resize", `${OUTPUT_WIDTH}x`, "-quality", String(WEBP_QUALITY), target]);

    const { size: finalSize } = await fs.stat(target);
    return { path: `${PUBLIC_PREFIX}/${slug}.webp`, bytes: finalSize };
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

async function main() {
  const chromium = await firstAvailable(CHROMIUM_CANDIDATES, "Chromium");
  const magick = await firstAvailable(MAGICK_CANDIDATES, "ImageMagick");

  const singleUrl = getArg("url");
  let projects;
  let writeBack = false;
  let source;

  if (singleUrl) {
    projects = [{ name: getArg("name") || singleUrl, link: singleUrl }];
    source = "command line";
  } else if (hasFlag("local")) {
    projects = JSON.parse(await fs.readFile(PROJECTS_FILE, "utf8"));
    writeBack = true;
    source = path.relative(process.cwd(), PROJECTS_FILE);
  } else {
    // The published list is what visitors see, and its GET route needs no auth.
    const origin = (getArg("from") || DEFAULT_ORIGIN).replace(/\/+$/, "");
    const endpoint = `${origin}/api/projects`;
    let response;
    try {
      response = await fetch(endpoint, { headers: { accept: "application/json" } });
    } catch (error) {
      throw new Error(
        `Could not reach ${endpoint} (${error.message}).\n` +
          `Start the site with "npm run dev", pass --from=https://your-deployment,\n` +
          `or use --local to read ${path.relative(process.cwd(), PROJECTS_FILE)} instead.`,
      );
    }
    if (!response.ok) throw new Error(`${endpoint} returned ${response.status}`);
    const body = await response.json();
    projects = Array.isArray(body.projects) ? body.projects : [];
    source = endpoint;
  }

  console.log(`Source: ${source}\n`);

  const force = hasFlag("force");
  const updates = [];
  let captured = 0;
  let skipped = 0;
  let failed = 0;

  for (const project of projects) {
    const url = project.link || project.liveUrl || project.html_url;
    const name = project.name || project.displayName || "project";

    if (!url) {
      console.log(`- ${name}: no live URL, skipping`);
      skipped += 1;
      continue;
    }
    const slug = slugify(name);

    if (!force) {
      // Either an explicit image on the record, or a screenshot already sitting
      // at the conventional path, means there is nothing to do.
      const existing = await fs
        .stat(path.join(OUTPUT_DIR, `${slug}.webp`))
        .then(() => `${PUBLIC_PREFIX}/${slug}.webp`)
        .catch(() => project.image || null);

      if (existing) {
        // Still queue a --save: the file can exist while the record does not
        // yet point at it, which is exactly the state --save is meant to fix.
        if (project.id && project.image !== existing) {
          updates.push({ id: project.id, name, image: existing });
        }
        project.image = existing;
        console.log(`- ${name}: already has ${existing}, skipping capture (--force to redo)`);
        skipped += 1;
        continue;
      }
    }
    process.stdout.write(`- ${name}: capturing ${url} ... `);
    try {
      const result = await capture(chromium, magick, { url, slug });
      project.image = result.path;
      if (project.id) updates.push({ id: project.id, name, image: result.path });
      captured += 1;
      console.log(`ok (${Math.round(result.bytes / 1024)} KB) -> ${result.path}`);
    } catch (error) {
      failed += 1;
      console.log(`FAILED (${error.message.split("\n")[0]})`);
    }
  }

  if (writeBack && (captured > 0 || updates.length)) {
    await fs.writeFile(PROJECTS_FILE, `${JSON.stringify(projects, null, 2)}\n`);
    console.log(`\nUpdated ${path.relative(process.cwd(), PROJECTS_FILE)}`);
  }

  if (hasFlag("save") && updates.length) {
    console.log("\nSaving image paths onto the project records:");
    await saveImagePaths(source, updates);
  }

  console.log(`\nCaptured ${captured}, skipped ${skipped}, failed ${failed}.`);
  if (captured > 0 && !writeBack) {
    console.log(
      "\nThese files live in public/images/projects/ and are only served once they are\n" +
        "committed and deployed. Until then they appear locally but not in production.",
    );
    if (!hasFlag("save")) {
      console.log("Re-run with --save to also store each path on its project record.");
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
