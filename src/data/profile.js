export const profile = {
  name: "Emmanuel Adejoh",
  firstName: "Emmanuel",
  email: "adejorion@gmail.com",
  phone: "+2349020151614",
  // wa.me wants the number with no plus sign or separators.
  whatsapp: "2349020151614",
  location: "Nigeria",
  github: "https://github.com/emmyade360",
  githubHandle: "emmyade360",
  // Drop a URL in and the link appears in the hero, footer, contact panel, and
  // structured data. Left empty, every reference to it stays hidden.
  linkedin: "",
  linkedinHandle: "",
  siteUrl: "https://emmyade.vercel.app/",
  title: "AI Engineer",
  titleLong: "AI Engineer, frontend and backend",
  availability: "Open to frontend, backend, and AI engineering roles",
  timezone: "WAT (UTC+1)",
  timezoneNote: "UTC+1. A full working day with Europe, mornings with US East.",
  // Kept deliberately non-numeric. An invented SLA is the kind of claim that
  // gets tested on the first message.
  responseTime: "I read and reply to every message.",
  headline:
    "React and Next.js interfaces on top of Node and Go services. The work that decides whether a feature survives sits between them: schema-validated model output, tiered provider failover, prompt-injection boundaries, and routing by cost rather than by default.",
  shortHeadline:
    "LLM features built for production, from the interface down to the service layer and the reliability work between them.",
};

// Recruiters read this before engineers do, so it leads in plain language and
// keeps the tool names an applicant tracking system will scan for.
export const resumeSummary =
  "AI Engineer and full-stack developer who builds complete AI-powered applications: the interfaces people use and the backend systems that make them reliable. Experienced with React, Next.js, TypeScript, Node.js, Go, PostgreSQL, Redis, REST APIs, and AI services including Groq, OpenAI, Anthropic Claude, and Cerebras. Focused on resilient AI workflows, answer validation, prompt-injection defence, data privacy, rate limiting, cost-aware model selection, accessible interfaces, and production-ready delivery. Brings transferable cloud and deployment foundations for AWS-oriented frontend, backend, and AI engineering teams.";

export const certifications = [
  {
    name: "Certified Nomba Developer",
    issuer: "Nomba x DevCareer",
    programme: "Nomba Developer Certification and Hackathon 2026",
    issued: "July 1, 2026",
    credentialId: "NMB-2026-XX6Z9S",
    image: "/certifications/nomba-developer-certification-2026.png",
  },
];

export const resumeSkillGroups = [
  {
    title: "AI Engineering",
    skills: "AI application development, prompt engineering, Vercel AI SDK, OpenAI, Anthropic Claude, Groq, Cerebras, Llama, answer validation, prompt-injection defence, AI failover, cost-aware model routing, data redaction",
  },
  {
    title: "Frontend Engineering",
    skills: "React, Next.js, TypeScript, JavaScript, Tailwind CSS, React Query, Zustand, responsive design, accessibility, performance optimization, Framer Motion",
  },
  {
    title: "Backend Engineering",
    skills: "Node.js, Go, REST APIs, Express.js, PostgreSQL, MongoDB, Redis, Supabase, authentication, rate limiting, validation with Zod",
  },
  {
    title: "Cloud, DevOps, and Quality",
    skills: "Docker, Vercel, Git, GitHub, Vitest, Jest, ESLint, logging, health checks, deployment workflows, API integration, environment-based configuration, AWS-ready foundations",
  },
];

// Two paragraphs, on purpose. This is the last thing between a recruiter and
// the projects, so it states the position and gets out of the way.
export const aboutParagraphs = [
  "I build the whole path of an AI feature: the React interface, the service that calls the model, and the reliability layer between them. Most teams split that across two people, and the failure modes get lost in the handover.",
  "Wiring a model into an app takes an afternoon; production is everything after. Provider calls sit behind a fallback chain, responses are parsed against a schema before they reach a component, user input is passed as delimited data and never concatenated into instructions, and cheap models handle the work that does not need an expensive one.",
];

// Three claims that have to survive a follow-up question in a technical
// interview. No percentages, no benchmarks, nothing that cannot be defended.
export const proofPoints = [
  { value: "Validated output", label: "Schema-checked before it renders" },
  { value: "Tiered failover", label: "Degrades in steps, never dies" },
  { value: "Interface to data layer", label: "One person owns the whole path" },
];

// Tool names stay as-is because recruiters and their screening software search
// for them; the second line says what each one is actually used for here.
export const skillCategories = [
  {
    title: "Models and inference",
    items: [
      { name: "Groq", evidence: "Low-latency inference, primary streaming path" },
      { name: "OpenAI", evidence: "GPT models, structured output mode" },
      { name: "Anthropic Claude", evidence: "Long-context and higher-reasoning work" },
      { name: "Vercel AI SDK", evidence: "Provider-agnostic calls, streaming, tool use" },
      { name: "Cerebras", evidence: "Second provider in the fallback chain" },
      { name: "Llama 3.1 and 3.3", evidence: "Open weights, cheap tier for routine tasks" },
    ],
  },
  {
    title: "AI reliability",
    items: [
      { name: "Prompt engineering", evidence: "System and user separation, output contracts" },
      { name: "Injection defence", evidence: "Input as delimited data, never as instruction" },
      { name: "Output validation", evidence: "Zod schemas at the response boundary" },
      { name: "Provider failover", evidence: "Timeout budgets, tiered degradation" },
      { name: "Cost control", evidence: "Token ceilings, task-based model routing" },
      { name: "PII redaction", evidence: "Identifiers scrubbed before any egress" },
    ],
  },
  {
    title: "Frontend",
    items: [
      { name: "React", evidence: "Hooks, streamed UI, controlled forms" },
      { name: "Next.js", evidence: "App Router, route handlers, streaming responses" },
      { name: "TypeScript", evidence: "Typed API contracts end to end" },
      { name: "Tailwind CSS", evidence: "Design tokens, responsive and dark mode" },
      { name: "React Query", evidence: "Server cache, retry policy, invalidation" },
      { name: "Zustand", evidence: "Client state without provider trees" },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node.js", evidence: "REST and streaming endpoints, background jobs" },
      { name: "Go", evidence: "Concurrent services, typed handlers" },
      { name: "PostgreSQL", evidence: "Schema design, transactions, migrations" },
      { name: "Redis", evidence: "Sliding-window rate limits, response cache" },
      { name: "Supabase", evidence: "Postgres, auth, storage, realtime" },
      { name: "Rate limiting", evidence: "Per-user and per-IP windows" },
    ],
  },
  {
    title: "Quality and delivery",
    items: [
      { name: "Vitest and Jest", evidence: "Coverage on the paths that handle money and data" },
      { name: "Zod", evidence: "Runtime validation at every trust boundary" },
      { name: "Git and GitHub", evidence: "Reviewed branches, readable history" },
      { name: "Vercel", evidence: "Preview deploys, serverless functions, blob storage" },
      { name: "Docker", evidence: "Reproducible local and CI environments" },
      { name: "Logging", evidence: "Structured logs, request tracing, health checks" },
    ],
  },
];

// Deliberately does not overlap anything claimed in skillCategories above.
// claiming a tool and listing it as unlearned in the same page reads as noise.
export const currentlyLearning = [
  {
    name: "React Server Components",
    note: "Moving fetching and secrets off the client in the App Router",
  },
  {
    name: "Testing Library",
    note: "Behaviour-level tests for async and streamed interfaces",
  },
  {
    name: "LLM evaluation",
    note: "Regression suites for prompt changes instead of eyeballing output",
  },
  {
    name: "AWS",
    note: "Mapping what I deploy on Vercel onto managed infrastructure",
  },
];

export const experiences = [
  {
    company: "Mercuryx",
    role: "Software Engineer & Technical Mentor",
    period: "Oct 2025 to Present",
    description:
      "I take features from specification through implementation, review, and release to production users. I also mentor the junior engineers on the team, which means defending design decisions out loud and turning implicit conventions into written ones.",
    highlights: [
      "Own features from specification through implementation, review, and production release.",
      "Mentor junior engineers, review their work, and write down conventions the team had only kept in its head.",
    ],
    technologies: ["React", "JavaScript", "Testing", "Code review", "Mentoring"],
    current: true,
  },
  {
    company: "Learn2Earn",
    role: "Backend Engineering Programme in Go",
    period: "Nov 2025 to Dec 2025",
    description:
      "An intensive Go programme covering concurrency, HTTP service design, and the structure of a backend that stays predictable as load rises rather than degrading unpredictably.",
    highlights: [
      "Concurrency patterns, HTTP service design, and structuring a backend that degrades predictably under load.",
      "Built and tested services against the patterns Go is designed around rather than porting JavaScript habits across.",
    ],
    technologies: ["Go", "Concurrency", "Service design"],
    current: false,
  },
  {
    company: "Vivaking Technologies",
    role: "Full Stack Developer",
    period: "Mar 2025 to Nov 2025",
    description:
      "I shipped client features end to end: React interfaces, Node and MongoDB services, and the API contracts joining them. A recurring part of the work was profiling the paths users hit most often and cutting the work done on them.",
    highlights: [
      "Delivered React interfaces, Node and MongoDB services, and the API contracts joining them.",
      "Profiled the paths users hit most often and cut the work done on each request.",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Profiling"],
    current: false,
  },
];
