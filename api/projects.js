import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const PROJECTS_PATH = process.env.PROJECTS_FILE_PATH || "public/data/projects.json";
const BRANCH = process.env.PROJECTS_GITHUB_BRANCH || "main";
const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

const json = (response, status, body) => {
  response.setHeader("Cache-Control", "no-store");
  return response.status(status).json(body);
};

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

const getAdminPassword = () => process.env.ADMIN_PASSWORD || "";

const createSessionToken = () => {
  const password = getAdminPassword();
  const payload = Buffer.from(`${Date.now() + TOKEN_TTL_MS}.${randomUUID()}`).toString("base64url");
  const signature = createHmac("sha256", password).update(payload).digest("base64url");
  return `${payload}.${signature}`;
};

const isValidSessionToken = (token) => {
  const password = getAdminPassword();
  if (!password || !token) return false;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return false;

  const expected = createHmac("sha256", password).update(payload).digest("base64url");
  if (!safeEqual(signature, expected)) return false;

  try {
    const [expiresAt] = Buffer.from(payload, "base64url").toString("utf8").split(".");
    return Number(expiresAt) > Date.now();
  } catch {
    return false;
  }
};

const getRepository = () => {
  const owner = process.env.PROJECTS_GITHUB_OWNER || process.env.VERCEL_GIT_REPO_OWNER || "emmyade360";
  const name = process.env.PROJECTS_GITHUB_REPO || process.env.VERCEL_GIT_REPO_SLUG || "my-portfolio";
  return { owner, name };
};

const githubHeaders = () => {
  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "my-portfolio-projects-api",
  };

  if (process.env.GITHUB_PROJECTS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_PROJECTS_TOKEN}`;
  }

  return headers;
};

const getProjectsFile = async () => {
  const { owner, name } = getRepository();
  const url = `https://api.github.com/repos/${owner}/${name}/contents/${PROJECTS_PATH}?ref=${encodeURIComponent(BRANCH)}`;
  const response = await fetch(url, { headers: githubHeaders(), cache: "no-store" });

  if (response.status === 404) return { projects: [], sha: null };
  if (!response.ok) throw new Error(`GitHub read failed (${response.status})`);

  const file = await response.json();
  const decoded = Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8");
  const projects = JSON.parse(decoded);

  if (!Array.isArray(projects)) throw new Error("Projects file must contain a JSON array");
  return { projects, sha: file.sha };
};

const writeProjectsFile = async (projects, sha, message) => {
  const token = process.env.GITHUB_PROJECTS_TOKEN;
  if (!token) throw new Error("GITHUB_PROJECTS_TOKEN is not configured");

  const { owner, name } = getRepository();
  const url = `https://api.github.com/repos/${owner}/${name}/contents/${PROJECTS_PATH}`;
  const body = {
    message,
    branch: BRANCH,
    content: Buffer.from(`${JSON.stringify(projects, null, 2)}\n`).toString("base64"),
  };

  if (sha) body.sha = sha;

  const response = await fetch(url, {
    method: "PUT",
    headers: { ...githubHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const details = await response.json().catch(() => ({}));
    throw new Error(details.message || `GitHub write failed (${response.status})`);
  }
};

const cleanText = (value, maxLength) => String(value || "").trim().slice(0, maxLength);

const cleanUrl = (value) => {
  if (!value) return null;
  try {
    const url = new URL(String(value));
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};

const normalizeProject = (input, existing = {}) => ({
  id: existing.id || randomUUID(),
  name: cleanText(input.name ?? input.displayName ?? existing.name ?? existing.displayName, 100),
  description: cleanText(input.description ?? existing.description, 600),
  link: cleanUrl(
    input.link ?? input.liveUrl ?? input.html_url ?? existing.link ?? existing.liveUrl ?? existing.html_url,
  ),
  createdAt: existing.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const getBearerToken = (request) => {
  const authorization = request.headers.authorization || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
};

export default async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const { projects } = await getProjectsFile();
      return json(response, 200, { projects });
    }

    if (request.method === "POST" && request.body?.action === "login") {
      const password = getAdminPassword();
      if (!password) return json(response, 503, { error: "Admin password is not configured" });
      if (!safeEqual(request.body.password || "", password)) {
        return json(response, 401, { error: "Incorrect password" });
      }
      return json(response, 200, { token: createSessionToken() });
    }

    if (!isValidSessionToken(getBearerToken(request))) {
      return json(response, 401, { error: "Your admin session is invalid or has expired" });
    }

    const { projects, sha } = await getProjectsFile();

    if (request.method === "POST") {
      const project = normalizeProject(request.body?.project || {});
      if (!project.name) return json(response, 400, { error: "Project name is required" });
      if (!project.description) return json(response, 400, { error: "Project description is required" });
      if (!project.link) return json(response, 400, { error: "A valid project link is required" });

      const nextProjects = [project, ...projects];
      await writeProjectsFile(nextProjects, sha, `Add portfolio project: ${project.name}`);
      return json(response, 201, { project });
    }

    if (request.method === "PATCH") {
      const id = cleanText(request.body?.id, 100);
      const index = projects.findIndex((project) => project.id === id);
      if (index === -1) return json(response, 404, { error: "Project not found" });

      const updated = normalizeProject(request.body?.patch || {}, projects[index]);
      if (!updated.name) return json(response, 400, { error: "Project name is required" });
      if (!updated.description) return json(response, 400, { error: "Project description is required" });
      if (!updated.link) return json(response, 400, { error: "A valid project link is required" });

      const nextProjects = [...projects];
      nextProjects[index] = updated;
      await writeProjectsFile(nextProjects, sha, `Update portfolio project: ${updated.name}`);
      return json(response, 200, { project: updated });
    }

    if (request.method === "DELETE") {
      const id = cleanText(request.body?.id, 100);
      const project = projects.find((item) => item.id === id);
      if (!project) return json(response, 404, { error: "Project not found" });

      await writeProjectsFile(
        projects.filter((item) => item.id !== id),
        sha,
        `Remove portfolio project: ${project.name || project.displayName}`,
      );
      return json(response, 200, { success: true });
    }

    response.setHeader("Allow", "GET, POST, PATCH, DELETE");
    return json(response, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error("Projects API error:", error);
    return json(response, 500, { error: error.message || "Unable to update projects" });
  }
}
