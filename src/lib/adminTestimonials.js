import { testimonialSamples } from "../data/testimonialSamples";

const TESTIMONIALS_API = "/api/testimonials";
const STATIC_TESTIMONIALS = "/data/testimonials.json";

const parseResponse = async (response) => {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body.error || "Unable to complete the request");
    error.status = response.status;
    throw error;
  }
  return body;
};

const request = async (options = {}) => {
  const response = await fetch(TESTIMONIALS_API, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  return parseResponse(response);
};

const dispatchUpdate = () => window.dispatchEvent(new Event("testimonials-updated"));

export const getPublishedTestimonials = async () => {
  try {
    const { testimonials } = await request({ cache: "no-store" });
    return Array.isArray(testimonials) ? testimonials : [];
  } catch {
    const response = await fetch(STATIC_TESTIMONIALS, { cache: "no-store" });
    if (!response.ok) return [];
    const testimonials = await response.json().catch(() => []);
    return Array.isArray(testimonials) ? testimonials : [];
  }
};

export const getAdminTestimonials = async (token) => {
  try {
    const { testimonials } = await request({ cache: "no-store", headers: { Authorization: `Bearer ${token}` } });
    return Array.isArray(testimonials) ? testimonials : [];
  } catch (error) {
    if (error.status === 401) throw error;
    return testimonialSamples;
  }
};

export const saveAdminTestimonial = async (testimonial, token) => {
  await request({ method: "POST", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ testimonial }) });
  dispatchUpdate();
};

export const updateAdminTestimonial = async (id, patch, token) => {
  await request({ method: "PATCH", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, patch }) });
  dispatchUpdate();
};

export const deleteAdminTestimonial = async (id, token) => {
  await request({ method: "DELETE", headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ id }) });
  dispatchUpdate();
};
