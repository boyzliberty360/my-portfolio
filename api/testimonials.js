import { get, head, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
import { testimonialSamples } from "../src/data/testimonialSamples.js";
import {
  createSessionToken,
  getAdminPassword,
  getBearerToken,
  isCorrectAdminPassword,
  isValidSessionToken,
  json,
} from "./_lib/adminAuth.js";

const TESTIMONIALS_PATH = "portfolio/testimonials.json";

const getTestimonialsFile = async () => {
  const result = await get(TESTIMONIALS_PATH, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return { testimonials: testimonialSamples, etag: null };
  }

  const testimonials = JSON.parse(await new Response(result.stream).text());
  if (!Array.isArray(testimonials)) throw new Error("Testimonials file must contain a JSON array");
  const { etag } = await head(result.blob.url);
  return { testimonials, etag };
};

const writeTestimonialsFile = async (testimonials, etag) => {
  await put(TESTIMONIALS_PATH, `${JSON.stringify(testimonials, null, 2)}\n`, {
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

const normalizeStatus = (value) => ["pending", "approved", "rejected"].includes(value) ? value : "pending";

const normalizeTestimonial = (input, existing = {}) => ({
  id: existing.id || randomUUID(),
  quote: cleanText(input.quote ?? existing.quote, 900),
  name: cleanText(input.name ?? existing.name, 100),
  role: cleanText(input.role ?? existing.role, 100),
  company: cleanText(input.company ?? existing.company, 100),
  avatarUrl: cleanUrl(input.avatarUrl ?? existing.avatarUrl),
  sourceUrl: cleanUrl(input.sourceUrl ?? existing.sourceUrl),
  status: normalizeStatus(input.status ?? existing.status),
  isSample: Boolean(existing.isSample || input.isSample),
  featured: Boolean(input.featured ?? existing.featured),
  sortOrder: Number.isFinite(Number(input.sortOrder ?? existing.sortOrder)) ? Number(input.sortOrder ?? existing.sortOrder) : 0,
  createdAt: existing.createdAt || new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const publicTestimonials = (testimonials) => testimonials
  .filter((testimonial) => testimonial.status === "approved" && !testimonial.isSample)
  .sort((left, right) => Number(right.featured) - Number(left.featured) || left.sortOrder - right.sortOrder);

export default async function handler(request, response) {
  try {
    const token = getBearerToken(request);
    const isAdmin = Boolean(token) && isValidSessionToken(token);

    if (request.method === "GET") {
      const { testimonials } = await getTestimonialsFile();
      if (token && !isAdmin) return json(response, 401, { error: "Your admin session is invalid or has expired" });
      return json(response, 200, { testimonials: isAdmin ? testimonials : publicTestimonials(testimonials) });
    }

    if (request.method === "POST" && request.body?.action === "login") {
      const password = getAdminPassword();
      if (!password) return json(response, 503, { error: "Admin password is not configured" });
      if (!isCorrectAdminPassword(request.body.password || "")) return json(response, 401, { error: "Incorrect password" });
      return json(response, 200, { token: createSessionToken() });
    }

    if (!isAdmin) return json(response, 401, { error: "Your admin session is invalid or has expired" });

    const { testimonials, etag } = await getTestimonialsFile();

    if (request.method === "POST") {
      const testimonial = normalizeTestimonial(request.body?.testimonial || {});
      if (!testimonial.quote || !testimonial.name || !testimonial.role || !testimonial.company) {
        return json(response, 400, { error: "Quote, name, role, and company are required" });
      }
      const nextTestimonials = [testimonial, ...testimonials];
      await writeTestimonialsFile(nextTestimonials, etag);
      return json(response, 201, { testimonial });
    }

    if (request.method === "PATCH") {
      const id = cleanText(request.body?.id, 100);
      const index = testimonials.findIndex((testimonial) => testimonial.id === id);
      if (index === -1) return json(response, 404, { error: "Testimonial not found" });

      const updated = normalizeTestimonial(request.body?.patch || {}, testimonials[index]);
      if (!updated.quote || !updated.name || !updated.role || !updated.company) {
        return json(response, 400, { error: "Quote, name, role, and company are required" });
      }
      const nextTestimonials = [...testimonials];
      nextTestimonials[index] = updated;
      await writeTestimonialsFile(nextTestimonials, etag);
      return json(response, 200, { testimonial: updated });
    }

    if (request.method === "DELETE") {
      const id = cleanText(request.body?.id, 100);
      if (!testimonials.some((testimonial) => testimonial.id === id)) return json(response, 404, { error: "Testimonial not found" });
      await writeTestimonialsFile(testimonials.filter((testimonial) => testimonial.id !== id), etag);
      return json(response, 200, { success: true });
    }

    response.setHeader("Allow", "GET, POST, PATCH, DELETE");
    return json(response, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error("Testimonials API error:", error);
    return json(response, 500, { error: error.message || "Unable to update testimonials" });
  }
}
