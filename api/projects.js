import { randomUUID } from "node:crypto";
import { get, head, put } from "@vercel/blob";
import {
  createSessionToken,
  getAdminPassword,
  getBearerToken,
  isCorrectAdminPassword,
  isValidSessionToken,
  json,
} from "./_lib/adminAuth.js";

const PROJECTS_PATH = "portfolio/projects.json";
const getProjectsFile = async () => {
  const result = await get(PROJECTS_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return { projects: [], etag: null };
  }

  const projects = JSON.parse(await new Response(result.stream).text());

  if (!Array.isArray(projects)) throw new Error("Projects file must contain a JSON array");

  // get() returns a weak (W/"...") etag, but put()'s ifMatch precondition
  // requires the strong form. head() returns that.
  const { etag } = await head(result.blob.url);
  return { projects, etag };
};

const writeProjectsFile = async (projects, etag) => {
  await put(PROJECTS_PATH, `${JSON.stringify(projects, null, 2)}\n`, {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    ...(etag ? { ifMatch: etag } : {}),
  });
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

// Screenshots usually live in this repo's /public, so a root-relative path is
// valid here even though it is not a parseable absolute URL.
const cleanImage = (value) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed.slice(0, 300);
  return cleanUrl(trimmed);
};

const MAX_TECHNOLOGIES = 8;

const cleanTechnologies = (value) => {
  const list = Array.isArray(value) ? value : String(value || "").split(",");
  return list
    .map((item) => cleanText(item, 40))
    .filter(Boolean)
    .slice(0, MAX_TECHNOLOGIES);
};

const CASE_STUDY_TEXT_FIELDS = [
  "type",
  "problem",
  "solution",
  "role",
  "architecture",
  "challenge",
  "response",
];

// Every field is optional. A project with no case study renders without one,
// which is the point. Generic filler reads worse than an absent section.
const cleanCaseStudy = (value) => {
  if (!value || typeof value !== "object") return null;

  const study = {};
  for (const field of CASE_STUDY_TEXT_FIELDS) {
    const text = cleanText(value[field], 600);
    if (text) study[field] = text;
  }

  const quality = (Array.isArray(value.quality) ? value.quality : String(value.quality || "").split("\n"))
    .map((item) => cleanText(item, 120))
    .filter(Boolean)
    .slice(0, 6);
  if (quality.length) study.quality = quality;

  return Object.keys(study).length ? study : null;
};

const normalizeProject = (input, existing = {}) => ({
  id: existing.id || randomUUID(),
  name: cleanText(input.name ?? input.displayName ?? existing.name ?? existing.displayName, 100),
  description: cleanText(input.description ?? existing.description, 600),
  link: cleanUrl(
    input.link ?? input.liveUrl ?? input.html_url ?? existing.link ?? existing.liveUrl ?? existing.html_url,
  ),
  image: cleanImage(input.image ?? existing.image),
  github: cleanUrl(input.github ?? input.githubUrl ?? existing.github ?? existing.githubUrl),
  technologies: cleanTechnologies(input.technologies ?? input.stack ?? existing.technologies ?? existing.stack),
  featured: Boolean(input.featured ?? existing.featured ?? false),
  caseStudy: cleanCaseStudy(input.caseStudy ?? existing.caseStudy),
  createdAt: existing.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export default async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const { projects } = await getProjectsFile();
      return json(response, 200, { projects });
    }

    if (request.method === "POST" && request.body?.action === "login") {
      const password = getAdminPassword();
      if (!password) return json(response, 503, { error: "Admin password is not configured" });
      if (!isCorrectAdminPassword(request.body.password || "")) {
        return json(response, 401, { error: "Incorrect password" });
      }
      return json(response, 200, { token: createSessionToken() });
    }

    if (!isValidSessionToken(getBearerToken(request))) {
      return json(response, 401, { error: "Your admin session is invalid or has expired" });
    }

    const { projects, etag } = await getProjectsFile();

    if (request.method === "POST") {
      const project = normalizeProject(request.body?.project || {});
      if (!project.name) return json(response, 400, { error: "Project name is required" });
      if (!project.description) return json(response, 400, { error: "Project description is required" });
      if (!project.link) return json(response, 400, { error: "A valid project link is required" });

      const nextProjects = [project, ...projects];
      await writeProjectsFile(nextProjects, etag);
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
      await writeProjectsFile(nextProjects, etag);
      return json(response, 200, { project: updated });
    }

    if (request.method === "DELETE") {
      const id = cleanText(request.body?.id, 100);
      const project = projects.find((item) => item.id === id);
      if (!project) return json(response, 404, { error: "Project not found" });

      await writeProjectsFile(
        projects.filter((item) => item.id !== id),
        etag,
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
