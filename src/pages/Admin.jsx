import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Eye, EyeOff, ExternalLink,
  ArrowLeft, Save, Globe, CheckCircle, LogOut, LoaderCircle,
} from "lucide-react";
import {
  authenticateAdmin,
  getAdminProjects,
  saveAdminProject,
  deleteAdminProject,
} from "../lib/adminProjects";

const normalizeUrl = (raw) => {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
};

const EMPTY_FORM = {
  name: "",
  description: "",
  link: "",
};

function PasswordGate({ onAuth }) {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!password || submitting) return;

    setSubmitting(true);
    setError("");
    try {
      const token = await authenticateAdmin(password);
      sessionStorage.setItem("admin-session", token);
      onAuth(token);
    } catch (requestError) {
      setError(requestError.message || "Unable to log in");
      setPassword("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass dark:bg-black/30 bg-white/60 rounded-2xl p-8 w-full max-w-sm border border-white/20"
      >
        <h1 className="ai-heading text-2xl font-bold mb-2 text-cyan-400">Admin</h1>
        <p className="text-sm dark:text-gray-400 text-slate-500 mb-6">Enter your password to manage projects.</p>

        <div className="relative mb-3">
          <input
            type={showPw ? "text" : "password"}
            name="admin-password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            autoFocus
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="lg-input w-full px-4 py-3 pr-11 rounded-lg dark:text-white text-slate-900"
          />
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <AnimatePresence>
          {Boolean(error) && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-red-400 text-sm mb-3"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={submit}
          disabled={submitting || !password}
          className="lg-btn w-full py-3 text-white font-medium"
        >
          <span className="relative z-10 inline-flex items-center justify-center gap-2">
            {submitting && <LoaderCircle size={16} className="animate-spin" />}
            {submitting ? "Signing in..." : "Login"}
          </span>
        </button>
      </motion.div>
    </div>
  );
}

function LivePreview({ link }) {
  const normalizedUrl = useMemo(() => normalizeUrl(link), [link]);
  if (!normalizedUrl) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-black">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
        <span className="max-w-[80%] truncate text-xs text-slate-500 dark:text-slate-400">{normalizedUrl}</span>
        <CheckCircle size={12} className="text-cyan-400" />
      </div>
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        <iframe
          key={normalizedUrl}
          src={normalizedUrl}
          title="Site preview"
          className="absolute inset-0 h-full w-full bg-white"
          loading="lazy"
          referrerPolicy="no-referrer"
          sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent px-3 py-2">
          <p className="text-[11px] text-slate-200">
            If the site blocks embedding, use the live link below to open it in a new tab.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onDelete }) {
  const name = project.name || project.displayName;
  const link = project.link || project.liveUrl || project.html_url;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="glass dark:bg-black/30 bg-white/60 rounded-xl border border-white/15 overflow-hidden"
    >
      <div className="p-4 flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold dark:text-white text-slate-900 truncate">{name}</p>
          {project.description && (
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1 line-clamp-2">{project.description}</p>
          )}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center gap-1 text-xs text-cyan-400 hover:underline"
            >
              <ExternalLink size={11} /> Open project
            </a>
          )}
        </div>
        <button
          onClick={() => onDelete(project.id)}
          className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0 p-1 rounded hover:bg-red-400/10"
          title="Delete project"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Admin() {
  const initialToken = sessionStorage.getItem("admin-session") || "";
  const [authToken, setAuthToken] = useState(initialToken);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(Boolean(initialToken));
  const [form, setForm] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");

  const refresh = async () => {
    setLoading(true);
    const data = await getAdminProjects();
    setProjects(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!authToken) return undefined;

    let cancelled = false;
    getAdminProjects().then((data) => {
      if (!cancelled) {
        setProjects(data);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [authToken]);

  const clearSession = () => {
    sessionStorage.removeItem("admin-session");
    setAuthToken("");
    setProjects([]);
    setActionError("");
  };

  const handleRequestError = (error) => {
    if (error.status === 401) {
      clearSession();
      return;
    }
    setActionError(error.message || "Unable to update projects");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.link.trim() || saving) return;

    setSaving(true);
    setActionError("");

    const project = {
      name: form.name.trim(),
      description: form.description.trim(),
      link: normalizeUrl(form.link),
    };

    try {
      await saveAdminProject(project, authToken);
      await refresh();
      setForm(EMPTY_FORM);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setActionError("");
    try {
      await deleteAdminProject(id, authToken);
      await refresh();
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleAuth = (token) => {
    setLoading(true);
    setAuthToken(token);
  };

  if (!authToken) {
    return <PasswordGate onAuth={handleAuth} />;
  }

  const inputClass =
    "lg-input w-full px-4 py-2.5 rounded-lg dark:text-white text-slate-900 text-sm";

  const labelClass =
    "text-xs font-medium dark:text-gray-400 text-slate-500 uppercase tracking-wide mb-1.5 block";

  return (
    <div className="min-h-screen bg-white py-10 px-6 dark:bg-black md:px-14">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex flex-wrap items-center gap-6">
          <a
            href="/#projects"
            className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft size={15} /> Back to portfolio
          </a>
          <div>
            <h1 className="ai-heading text-3xl font-bold dark:text-white text-slate-900">
              Projects Admin
            </h1>
            <p className="mt-0.5 text-sm dark:text-slate-400 text-slate-500">
              Projects added here appear live on the portfolio.
            </p>
          </div>
          <button
            type="button"
            onClick={clearSession}
            className="ml-auto inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-red-400 hover:text-red-500 dark:border-white/15 dark:text-slate-300 dark:hover:border-red-400 dark:hover:text-red-400"
          >
            <LogOut size={15} /> Log out
          </button>
        </div>

        <div className="grid gap-8 items-start lg:grid-cols-[1fr_1.1fr]">
          <div className="glass dark:bg-black/30 bg-white/60 rounded-2xl border border-white/15 p-6 lg:sticky lg:top-8">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold dark:text-white text-slate-900">
              <Plus size={18} className="text-cyan-400" /> Add Project
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {actionError && (
                <p role="alert" className="rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-500 dark:text-red-300">
                  {actionError}
                </p>
              )}
              <div>
                <label className={labelClass}>Project Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="My Awesome Project"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What does this project do?"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>
                  <span className="inline-flex items-center gap-1.5">
                    <Globe size={12} className="text-cyan-400" /> Project Link *
                  </span>
                </label>
                <input
                  required
                  type="url"
                  value={form.link}
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  placeholder="https://myproject.vercel.app"
                  className={inputClass}
                />
              </div>

              <LivePreview link={form.link} />

              <button
                type="submit"
                disabled={saving}
                className="lg-btn flex w-full items-center justify-center gap-2 py-3 font-medium text-white"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {saving ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" /> Publishing...
                    </>
                  ) : saved ? (
                    <>
                      <CheckCircle size={16} /> Saved!
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Add to Portfolio
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold dark:text-white text-slate-900">
              Saved Projects{" "}
              <span className="text-base font-normal text-cyan-400">({projects.length})</span>
            </h2>

            {loading ? (
              <div className="glass dark:bg-black/30 bg-white/60 rounded-2xl border border-white/15 p-10 text-center dark:text-slate-500 text-slate-400">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="glass dark:bg-black/30 bg-white/60 rounded-2xl border border-white/15 p-10 text-center dark:text-slate-500 text-slate-400">
                No projects yet. Add one with the form.
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="space-y-4">
                  {projects.map((p) => (
                    <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
