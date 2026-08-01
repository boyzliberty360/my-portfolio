const PROJECTS_API = "/api/projects";
const STATIC_PROJECTS = "/data/projects.json";

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
  const response = await fetch(PROJECTS_API, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  return parseResponse(response);
};

const dispatchUpdate = () => {
  window.dispatchEvent(new Event("admin-projects-updated"));
};

export const authenticateAdmin = async (password) => {
  const { token } = await request({
    method: "POST",
    body: JSON.stringify({ action: "login", password }),
  });
  return token;
};

export const getAdminProjects = async () => {
  try {
    const { projects } = await request({ cache: "no-store" });
    return projects;
  } catch (error) {
    console.warn("Projects API unavailable; using the deployed project list.", error);
    const response = await fetch(STATIC_PROJECTS, { cache: "no-store" });
    if (!response.ok) return [];
    const projects = await response.json().catch(() => []);
    return Array.isArray(projects) ? projects : [];
  }
};

export const saveAdminProject = async (project, token) => {
  await request({
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ project }),
  });
  dispatchUpdate();
  return true;
};

export const deleteAdminProject = async (id, token) => {
  await request({
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id }),
  });
  dispatchUpdate();
  return true;
};

export const updateAdminProject = async (id, patch, token) => {
  await request({
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ id, patch }),
  });
  dispatchUpdate();
  return true;
};
