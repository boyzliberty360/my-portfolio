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
  title: "Full-Stack Software Engineer",
  titleLong: "Full-Stack Software Engineer | React, Next.js, Node.js, Go",
  availability: "Open to full-stack and web engineering roles",
  timezone: "WAT (UTC+1)",
  timezoneNote: "UTC+1. A full working day with Europe, mornings with US East.",
  // Kept deliberately non-numeric. An invented SLA is the kind of claim that
  // gets tested on the first message.
  responseTime: "I read and reply to every message.",
  headline:
    "I build full-stack web products with React and Next.js on the front end, Node.js and Go services behind them, and the data and reliability layers that make them usable in production.",
  shortHeadline:
    "Full-stack web engineer building the interface, services, and data layer behind reliable products.",
};

// Recruiters read this before engineers do, so it leads in plain language and
// keeps the tool names an applicant tracking system will scan for.
export const resumeSummary =
  "Full-stack software engineer building React/Next.js products, Node.js/Go services, database-backed APIs, and production safeguards. Ships end-to-end features and payment workflows; also builds AI workflows with validation, provider failover, prompt-injection controls, and cost-aware routing.";

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
    title: "Full-Stack Web",
    skills: "React, Next.js, TypeScript, JavaScript, Node.js, Go, REST APIs, Tailwind CSS, responsive design, accessibility",
  },
  {
    title: "Backend and Data",
    skills: "PostgreSQL, MongoDB, Prisma, Redis, Supabase, Express.js, authentication, rate limiting, validation with Zod, API integration",
  },
  {
    title: "AI Engineering",
    skills: "Vercel AI SDK, OpenAI, Anthropic Claude, Groq, Cerebras, Llama, prompt engineering, output validation, provider failover, prompt-injection defence, data redaction",
  },
  {
    title: "Quality and Delivery",
    skills: "Docker, Vercel, Git, GitHub, Vitest, Jest, ESLint, logging, health checks, deployment workflows, environment-based configuration",
  },
];

export const resumeProjects = [
  {
    name: "Trusta",
    type: "Escrow payments",
    role: "Sole engineer",
    stack: "Next.js, Prisma, PostgreSQL, Redis, Zod",
    link: "https://trusta-pro.vercel.app/",
    github: "https://github.com/emmyade360/Trusta",
    bullets: [
      "Designed the deal state machine, payment integration, authorization rules, and append-only event log for a safe-payment platform.",
      "Made money-moving actions resilient to duplicate requests and unreliable callbacks with idempotency, signed webhooks, provider rechecks, and scheduled reconciliation.",
    ],
  },
  {
    name: "DoctorCare",
    type: "Healthcare platform",
    role: "Interface and data model",
    stack: "API integration, route-scoped data, validation",
    link: "https://doctorcare-phi.vercel.app/",
    bullets: [
      "Built patient-facing search, booking, consultation, and medical-record flows across doctors, patients, appointments, and records.",
      "Scoped records to the routes that need them and made scheduling and destructive actions explicit through validation and confirmation.",
    ],
  },
];

// Two paragraphs, on purpose. This is the last thing between a recruiter and
// the projects, so it states the position and gets out of the way.
export const aboutParagraphs = [
  "I build complete web products: React and Next.js interfaces, Node.js and Go services, database-backed APIs, and the validation and deployment work that connects them. On a feature, I care about the path from a user action to a correct state change - not just the screen.",
  "That same approach carries into AI work. I put model calls behind provider fallbacks, validate responses before they reach the UI, separate user data from instructions, and route simple tasks to cheaper models when the workflow allows it.",
];

// Three claims that have to survive a follow-up question in a technical
// interview. No percentages, no benchmarks, nothing that cannot be defended.
export const proofPoints = [
  { value: "End-to-end ownership", label: "From interface to API and data layer" },
  { value: "Payment correctness", label: "Idempotency, signed callbacks, reconciliation" },
  { value: "Team delivery", label: "Specification, review, release, and mentoring" },
];

// Tool names stay as-is because recruiters and their screening software search
// for them; the second line says what each one is actually used for here.
export const skillCategories = [
  {
    title: "Full-stack web",
    items: [
      { name: "React and Next.js", evidence: "Interfaces, routing, forms, and deployed product flows" },
      { name: "TypeScript and JavaScript", evidence: "Typed and maintainable application code" },
      { name: "Tailwind CSS", evidence: "Responsive interfaces and design tokens" },
      { name: "React Query", evidence: "Server cache, retry policy, and invalidation" },
      { name: "Accessibility", evidence: "Clear interactions across screen sizes" },
    ],
  },
  {
    title: "Backend and data",
    items: [
      { name: "Node.js and Go", evidence: "REST endpoints, service logic, and concurrent work" },
      { name: "PostgreSQL and MongoDB", evidence: "Database-backed product features" },
      { name: "Prisma and Supabase", evidence: "Schema, auth, storage, and data access" },
      { name: "Redis", evidence: "Rate limits, caching, and short-lived state" },
      { name: "Zod", evidence: "Runtime validation at trust boundaries" },
    ],
  },
  {
    title: "AI engineering",
    items: [
      { name: "Vercel AI SDK", evidence: "Provider-agnostic calls, streaming, and tool use" },
      { name: "OpenAI and Claude", evidence: "Structured output and reasoning workflows" },
      { name: "Groq and Cerebras", evidence: "Low-latency inference and fallback paths" },
      { name: "Prompt engineering", evidence: "System and user separation, output contracts" },
      { name: "Injection defence", evidence: "Input as delimited data, never as instruction" },
      { name: "Output validation", evidence: "Zod schemas at the response boundary" },
    ],
  },
  {
    title: "Quality and delivery",
    items: [
      { name: "Testing", evidence: "Vitest and Jest checks on data and money paths" },
      { name: "Git and GitHub", evidence: "Readable history and collaborative delivery" },
      { name: "Vercel and Docker", evidence: "Preview deployments and reproducible services" },
      { name: "Logging", evidence: "Structured logs, request tracing, and health checks" },
      { name: "Delivery", evidence: "Environment configuration and release workflows" },
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
    kind: "professional",
    description:
      "Own feature delivery from specification through implementation, review, and production release. Alongside delivery, mentor junior engineers and turn implicit team conventions into written guidance.",
    highlights: [
      "Own features from specification through implementation, review, and production release.",
      "Review junior engineers' work and document conventions used across the team.",
    ],
    technologies: ["React", "JavaScript", "Testing", "Code review", "Mentoring"],
    current: true,
  },
  {
    company: "Learn2Earn",
    role: "Backend Engineering Programme in Go",
    period: "Nov 2025 to Dec 2025",
    kind: "training",
    description:
      "Completed an intensive Go programme covering concurrency, HTTP service design, and predictable backend structure.",
    highlights: [
      "Practised Go concurrency patterns, HTTP service design, and predictable degradation under load.",
      "Built and tested services using idiomatic Go patterns.",
    ],
    technologies: ["Go", "Concurrency", "Service design"],
    current: false,
  },
  {
    company: "Vivaking Technologies",
    role: "Full Stack Developer",
    period: "Mar 2025 to Nov 2025",
    kind: "professional",
    description:
      "Shipped client features end to end across React interfaces, Node.js services, MongoDB, and the API contracts joining them. Also profiled frequently used request paths and reduced the work performed on each request.",
    highlights: [
      "Built React interfaces and Node.js/MongoDB services, owning the API contracts between them.",
      "Profiled frequently used request paths and reduced the work performed on each request.",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Profiling"],
    current: false,
  },
];
