import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Eye, EyeOff, ExternalLink,
  ArrowLeft, Save, Globe, CheckCircle, LogOut, LoaderCircle,
  MessageSquareQuote, XCircle, Clock, RotateCcw,
} from "lucide-react";
import {
  authenticateAdmin,
  getAdminProjects,
  saveAdminProject,
  deleteAdminProject,
} from "../lib/adminProjects";
import {
  deleteAdminTestimonial,
  getAdminTestimonials,
  saveAdminTestimonial,
  updateAdminTestimonial,
} from "../lib/adminTestimonials";
import { testimonialSamples } from "../data/testimonialSamples";

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
  image: "",
  github: "",
  technologies: "",
  featured: false,
  type: "",
  problem: "",
  solution: "",
  role: "",
  architecture: "",
  challenge: "",
  response: "",
  quality: "",
  tradeoffs: "",
  snippetLabel: "",
  snippetLanguage: "",
  snippetCode: "",
  lessons: "",
  next: "",
};

const toLines = (value) => value.split("\n").map((line) => line.trim()).filter(Boolean);

// Trade-offs are the one structured field here. A row is
// "decision | chose | rejected | because"; anything with fewer parts still
// renders, the card just omits the pieces that are missing.
const parseTradeoffs = (value) =>
  toLines(value)
    .map((line) => {
      const [decision = "", chose = "", rejected = "", because = ""] = line.split("|").map((part) => part.trim());
      return { decision, chose, rejected, because };
    })
    .filter((tradeoff) => tradeoff.decision || tradeoff.chose);

// The public card only renders a case study when there is real content for it,
// so every one of these fields is optional.
const buildCaseStudy = (form) => {
  const code = form.snippetCode.trim();
  const study = {
    type: form.type.trim(),
    problem: form.problem.trim(),
    solution: form.solution.trim(),
    role: form.role.trim(),
    architecture: form.architecture.trim(),
    challenge: form.challenge.trim(),
    response: form.response.trim(),
    quality: toLines(form.quality),
    tradeoffs: parseTradeoffs(form.tradeoffs),
    lessons: toLines(form.lessons),
    next: toLines(form.next),
    // Without code there is nothing to show, so the whole snippet is dropped
    // rather than rendering an empty labelled block.
    snippet: code
      ? { label: form.snippetLabel.trim(), language: form.snippetLanguage.trim(), code }
      : null,
  };

  const hasContent = Object.values(study).some((value) => (Array.isArray(value) ? value.length : value));
  return hasContent ? study : null;
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

const EMPTY_TESTIMONIAL_FORM = {
  quote: "",
  name: "",
  role: "",
  company: "",
  avatarUrl: "",
  sourceUrl: "",
};

function TestimonialCard({ testimonial, onStatus, onDelete }) {
  const statusStyles = {
    pending: "border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-300",
    approved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300",
    rejected: "border-red-400/30 bg-red-400/10 text-red-600 dark:text-red-300",
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="admin-testimonial-card glass rounded-xl border border-white/15 p-5"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MessageSquareQuote size={16} className="text-cyan-400" />
          <span className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${statusStyles[testimonial.status] || statusStyles.pending}`}>
            {testimonial.status}
          </span>
          {testimonial.isSample ? <span className="rounded-full border border-slate-300 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:border-white/15 dark:text-slate-400">Sample</span> : null}
        </div>
        <button onClick={() => onDelete(testimonial.id)} className="rounded p-1 text-red-400 transition-colors hover:bg-red-400/10 hover:text-red-300" title="Delete testimonial" aria-label={`Delete testimonial from ${testimonial.name}`}>
          <Trash2 size={16} />
        </button>
      </div>

      <blockquote className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">“{testimonial.quote}”</blockquote>
      <div className="mt-4 border-t border-slate-200 pt-3 dark:border-white/10">
        <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{testimonial.role} · {testimonial.company}</p>
        {testimonial.contactEmail ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Private verification: {testimonial.contactEmail}</p> : null}
        {testimonial.sourceUrl ? <a href={testimonial.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-500 hover:underline"><ExternalLink size={11} /> View source</a> : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {testimonial.status !== "approved" ? <button onClick={() => onStatus(testimonial.id, "approved")} className="admin-action admin-action-approve"><CheckCircle size={14} /> Approve</button> : null}
        {testimonial.status !== "rejected" ? <button onClick={() => onStatus(testimonial.id, "rejected")} className="admin-action admin-action-reject"><XCircle size={14} /> Reject</button> : null}
        {testimonial.status !== "pending" ? <button onClick={() => onStatus(testimonial.id, "pending")} className="admin-action"><RotateCcw size={14} /> Return to pending</button> : null}
      </div>
    </motion.article>
  );
}

export default function Admin() {
  const initialToken = sessionStorage.getItem("admin-session") || "";
  const [authToken, setAuthToken] = useState(initialToken);
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(Boolean(initialToken));
  const [testimonialsLoading, setTestimonialsLoading] = useState(Boolean(initialToken));
  const [form, setForm] = useState(EMPTY_FORM);
  const [testimonialForm, setTestimonialForm] = useState(EMPTY_TESTIMONIAL_FORM);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testimonialSaving, setTestimonialSaving] = useState(false);
  const [testimonialSaved, setTestimonialSaved] = useState(false);
  const [actionError, setActionError] = useState("");

  const refresh = async () => {
    setLoading(true);
    const data = await getAdminProjects();
    setProjects(data);
    setLoading(false);
  };

  const refreshTestimonials = async () => {
    setTestimonialsLoading(true);
    const data = await getAdminTestimonials(authToken);
    setTestimonials(data);
    setTestimonialsLoading(false);
  };

  useEffect(() => {
    if (!authToken) return undefined;

    let cancelled = false;
    Promise.all([getAdminProjects(), getAdminTestimonials(authToken)]).then(([projectData, testimonialData]) => {
      if (!cancelled) {
        setProjects(projectData);
        setTestimonials(testimonialData);
        setLoading(false);
        setTestimonialsLoading(false);
      }
    }).catch((error) => {
      if (!cancelled) {
        if (error.status === 401) clearSession();
        else setActionError(error.message || "Unable to load admin content");
        setLoading(false);
        setTestimonialsLoading(false);
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
      image: form.image.trim(),
      github: normalizeUrl(form.github),
      technologies: form.technologies.split(",").map((item) => item.trim()).filter(Boolean),
      featured: form.featured,
      caseStudy: buildCaseStudy(form),
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

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!testimonialForm.quote.trim() || !testimonialForm.name.trim() || !testimonialForm.role.trim() || !testimonialForm.company.trim() || testimonialSaving) return;

    setTestimonialSaving(true);
    setActionError("");
    try {
      await saveAdminTestimonial({ ...testimonialForm, status: "pending", isSample: false }, authToken);
      await refreshTestimonials();
      setTestimonialForm(EMPTY_TESTIMONIAL_FORM);
      setTestimonialSaved(true);
      setTimeout(() => setTestimonialSaved(false), 2500);
    } catch (error) {
      handleRequestError(error);
    } finally {
      setTestimonialSaving(false);
    }
  };

  const handleTestimonialStatus = async (id, status) => {
    setActionError("");
    try {
      await updateAdminTestimonial(id, { status }, authToken);
      await refreshTestimonials();
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleTestimonialDelete = async (id) => {
    setActionError("");
    try {
      await deleteAdminTestimonial(id, authToken);
      await refreshTestimonials();
    } catch (error) {
      handleRequestError(error);
    }
  };

  const loadSampleTestimonials = async () => {
    if (testimonialSaving || testimonials.some((testimonial) => testimonial.isSample)) return;
    setTestimonialSaving(true);
    setActionError("");
    try {
      for (const sample of testimonialSamples) {
        await saveAdminTestimonial(sample, authToken);
      }
      await refreshTestimonials();
    } catch (error) {
      handleRequestError(error);
    } finally {
      setTestimonialSaving(false);
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
              Content Admin
            </h1>
            <p className="mt-0.5 text-sm dark:text-slate-400 text-slate-500">
              Manage portfolio content and review what appears publicly.
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

        <div className="admin-tabs mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Content type">
          <button type="button" role="tab" aria-selected={activeTab === "projects"} onClick={() => setActiveTab("projects")} className={`admin-tab ${activeTab === "projects" ? "admin-tab-active" : ""}`}>
            <Globe size={15} /> Projects <span>{projects.length}</span>
          </button>
          <button type="button" role="tab" aria-selected={activeTab === "testimonials"} onClick={() => setActiveTab("testimonials")} className={`admin-tab ${activeTab === "testimonials" ? "admin-tab-active" : ""}`}>
            <MessageSquareQuote size={15} /> Testimonials <span>{testimonials.length}</span>
          </button>
        </div>

        {activeTab === "projects" ? (
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

              <div>
                <label className={labelClass}>Preview Image</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="/images/projects/my-project.webp"
                  className={inputClass}
                />
                <p className="mt-1.5 text-[11px] dark:text-slate-500 text-slate-400">
                  A screenshot in <code>public/images/projects/</code>, or a full https URL. Without one the card shows a plain placeholder.
                </p>
              </div>

              <div>
                <label className={labelClass}>GitHub Repository</label>
                <input
                  type="url"
                  value={form.github}
                  onChange={(e) => setForm({ ...form, github: e.target.value })}
                  placeholder="https://github.com/emmyade360/my-project"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Tech Stack</label>
                <input
                  value={form.technologies}
                  onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                  placeholder="Next.js, PostgreSQL, Groq, Redis"
                  className={inputClass}
                />
                <p className="mt-1.5 text-[11px] dark:text-slate-500 text-slate-400">
                  Comma separated, up to 8. The card shows the first 5.
                </p>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 text-sm dark:text-slate-300 text-slate-600">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="h-4 w-4 accent-cyan-400"
                />
                Feature this project — highlights the card and sorts it first
              </label>

              <details className="admin-case-study rounded-xl border border-slate-200 dark:border-white/10">
                <summary className="cursor-pointer px-4 py-3 text-sm font-semibold dark:text-white text-slate-900">
                  Case study <span className="font-normal dark:text-slate-500 text-slate-400">— optional, all fields</span>
                </summary>
                <div className="space-y-4 border-t border-slate-200 px-4 py-4 dark:border-white/10">
                  <div>
                    <label className={labelClass}>Project Type</label>
                    <input
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      placeholder="AI product · Fintech platform · Realtime system"
                      className={inputClass}
                    />
                  </div>
                  {[
                    { key: "problem", label: "The Problem", placeholder: "What was broken or missing, and for whom?" },
                    { key: "solution", label: "The Solution", placeholder: "What you built and what it changed." },
                    { key: "role", label: "My Role", placeholder: "What you personally owned." },
                    { key: "architecture", label: "Architecture", placeholder: "Stack, data flow, and the decisions behind them." },
                    { key: "challenge", label: "Hardest Problem", placeholder: "The genuinely difficult part — be specific and technical." },
                    { key: "response", label: "How I Solved It", placeholder: "The approach, the trade-off, and why." },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className={labelClass}>{field.label}</label>
                      <textarea
                        rows={3}
                        value={form[field.key]}
                        onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  ))}
                  <div>
                    <label className={labelClass}>Trade-offs</label>
                    <textarea
                      rows={4}
                      value={form.tradeoffs}
                      onChange={(e) => setForm({ ...form, tradeoffs: e.target.value })}
                      placeholder={"One per line: decision | chose | rejected | because\nTrusting the webhook payload | Requery the provider status API | Acting on the webhook body | A webhook is attacker-reachable input"}
                      className={`${inputClass} resize-none`}
                    />
                    <p className="mt-1 text-xs dark:text-slate-500 text-slate-400">
                      Pipe-separated. The strongest signal on the card — say what you rejected and why.
                    </p>
                  </div>
                  <div>
                    <label className={labelClass}>Code Snippet</label>
                    <input
                      value={form.snippetLabel}
                      onChange={(e) => setForm({ ...form, snippetLabel: e.target.value })}
                      placeholder="Caption — e.g. The transition map every write is asserted against"
                      className={inputClass}
                    />
                    <input
                      value={form.snippetLanguage}
                      onChange={(e) => setForm({ ...form, snippetLanguage: e.target.value })}
                      placeholder="Language — typescript, go, sql"
                      className={`${inputClass} mt-2`}
                    />
                    <textarea
                      rows={6}
                      value={form.snippetCode}
                      onChange={(e) => setForm({ ...form, snippetCode: e.target.value })}
                      placeholder="Real code from the project. Short and load-bearing beats long and representative."
                      className={`${inputClass} mt-2 font-mono text-xs`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Engineering Highlights</label>
                    <textarea
                      rows={3}
                      value={form.quality}
                      onChange={(e) => setForm({ ...form, quality: e.target.value })}
                      placeholder={"One per line, up to 6\nIdempotency keys prevent double charges\nHMAC signature verification on every webhook"}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>What I Took From It</label>
                    <textarea
                      rows={3}
                      value={form.lessons}
                      onChange={(e) => setForm({ ...form, lessons: e.target.value })}
                      placeholder={"One per line. What you would do differently, and what the bug taught you."}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>What I Would Do Next</label>
                    <textarea
                      rows={3}
                      value={form.next}
                      onChange={(e) => setForm({ ...form, next: e.target.value })}
                      placeholder={"One per line. Known gaps and the improvement you would make first."}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>
              </details>

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
        ) : (
          <div className="grid gap-8 items-start lg:grid-cols-[1fr_1.1fr]">
            <div className="glass dark:bg-black/30 bg-white/60 rounded-2xl border border-white/15 p-6 lg:sticky lg:top-8">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold dark:text-white text-slate-900">
                <MessageSquareQuote size={18} className="text-cyan-400" /> Add Testimonial
              </h2>
              <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">New testimonials enter as pending and stay hidden until you approve them.</p>

              <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                {actionError && <p role="alert" className="rounded-xl border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-500 dark:text-red-300">{actionError}</p>}
                <div>
                  <label className={labelClass}>Testimonial *</label>
                  <textarea required rows={5} value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} placeholder="What did they say about working with you?" className={`${inputClass} resize-none`} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><label className={labelClass}>Person’s name *</label><input required value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} placeholder="Ada Example" className={inputClass} /></div>
                  <div><label className={labelClass}>Role *</label><input required value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} placeholder="Product Designer" className={inputClass} /></div>
                </div>
                <div><label className={labelClass}>Company / context *</label><input required value={testimonialForm.company} onChange={(e) => setTestimonialForm({ ...testimonialForm, company: e.target.value })} placeholder="Company or collaboration context" className={inputClass} /></div>
                <div><label className={labelClass}>Avatar URL <span className="normal-case">(optional)</span></label><input type="url" value={testimonialForm.avatarUrl} onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })} placeholder="https://..." className={inputClass} /></div>
                <div><label className={labelClass}>Source URL <span className="normal-case">(optional)</span></label><input type="url" value={testimonialForm.sourceUrl} onChange={(e) => setTestimonialForm({ ...testimonialForm, sourceUrl: e.target.value })} placeholder="LinkedIn or verification link" className={inputClass} /></div>
                <button type="submit" disabled={testimonialSaving} className="lg-btn flex w-full items-center justify-center gap-2 py-3 font-medium text-white">
                  <span className="relative z-10 flex items-center gap-2">{testimonialSaving ? <><LoaderCircle size={16} className="animate-spin" /> Saving...</> : testimonialSaved ? <><CheckCircle size={16} /> Saved as pending</> : <><Save size={16} /> Add for review</>}</span>
                </button>
              </form>
              <button type="button" onClick={loadSampleTestimonials} disabled={testimonialSaving || testimonials.some((testimonial) => testimonial.isSample)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-cyan-400 hover:text-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/15 dark:text-slate-400">
                <Clock size={14} /> {testimonials.some((testimonial) => testimonial.isSample) ? "Sample drafts loaded" : "Load 3 sample drafts"}
              </button>
            </div>

            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold dark:text-white text-slate-900">Review Testimonials <span className="text-base font-normal text-cyan-400">({testimonials.length})</span></h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Only approved testimonials show on the homepage.</p>
              </div>
              {testimonialsLoading ? (
                <div className="glass rounded-2xl border border-white/15 p-10 text-center text-slate-400">Loading testimonials...</div>
              ) : testimonials.length === 0 ? (
                <div className="glass rounded-2xl border border-white/15 p-10 text-center text-slate-400">No testimonials yet. Add one for review.</div>
              ) : (
                <AnimatePresence mode="popLayout">
                  <div className="space-y-4">
                    {testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} onStatus={handleTestimonialStatus} onDelete={handleTestimonialDelete} />)}
                  </div>
                </AnimatePresence>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
