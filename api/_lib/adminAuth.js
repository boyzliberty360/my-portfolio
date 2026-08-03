import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000;

export const json = (response, status, body) => {
  response.setHeader("Cache-Control", "no-store");
  return response.status(status).json(body);
};

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
};

export const getAdminPassword = () => process.env.ADMIN_PASSWORD || "";

export const isCorrectAdminPassword = (password) => safeEqual(password, getAdminPassword());

export const createSessionToken = () => {
  const payload = Buffer.from(`${Date.now() + TOKEN_TTL_MS}.${randomUUID()}`).toString("base64url");
  const signature = createHmac("sha256", getAdminPassword()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
};

export const isValidSessionToken = (token) => {
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

export const getBearerToken = (request) => {
  const authorization = request.headers.authorization || "";
  return authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
};

export const requireAdmin = (request, response) => {
  if (!isValidSessionToken(getBearerToken(request))) {
    json(response, 401, { error: "Your admin session is invalid or has expired" });
    return false;
  }
  return true;
};
