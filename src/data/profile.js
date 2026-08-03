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
  titleLong: "AI Engineer — frontend and backend",
  availability: "Open to AI Engineer roles",
  timezone: "WAT (UTC+1)",
  timezoneNote: "UTC+1 — a full working day with Europe, mornings with US East.",
  headline:
    "That means two jobs at once: designing the screens people tap and type into, and building the hidden machinery behind them that talks to the AI, catches its mistakes, and keeps everything fast and affordable.",
  shortHeadline: "I build AI apps — the part you see, and the part you don't.",
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

export const aboutParagraphs = [
  "I build apps that use artificial intelligence. On most teams that is two separate jobs — someone designs the screens, someone else builds the system underneath. I do both, which means nothing gets lost in the handover between them.",
  "Getting an AI to do something impressive once is genuinely easy. The hard part is everything after: the AI service goes down in the middle of the day, it answers with confident nonsense, someone types something into a box specifically to trick it, or a feature quietly ends up costing ten times what anyone planned for.",
  "So that is what I build for. There is always a backup when something fails, every answer gets checked before anyone sees it, anything a user types is treated as information to examine rather than orders to obey, and simple jobs go to a cheaper AI. Then I build the screens that make all of it clear to the person using it.",
];

// Short value + label pairs, written for someone with no technical background.
// Each one is still something you can defend in a technical interview.
export const proofPoints = [
  { value: "The whole thing", label: "Screens and systems both" },
  { value: "Never just breaks", label: "There is always a backup" },
  { value: "Costs stay sane", label: "Right AI for each job" },
];

export const workingPrinciples = [
  {
    title: "A demo is not a product",
    description:
      "Making an AI do something clever once, for one person, on a good day is the easy part. Making it work every time, for everyone, on a bad day is the actual job — and that is where I spend my time.",
  },
  {
    title: "I build both halves",
    description:
      "Most teams need one person for the screens and another for the system underneath. I do both. That means fewer misunderstandings, fewer meetings, and no gap where the two are supposed to meet.",
  },
  {
    title: "I say what it cannot do",
    description:
      "AI gets things wrong sometimes — that is simply how it works. I am upfront about where that can happen and build a safety net for it, rather than promising something is perfect and hoping nobody notices.",
  },
];

export const aiPractices = [
  {
    title: "People will try to trick it",
    description:
      "Anyone can type instructions into a box hoping to hijack an AI and make it ignore its rules. I build these systems to treat whatever someone types as information to look at, never as orders to follow.",
  },
  {
    title: "It never simply breaks",
    description:
      "If the AI service is slow or goes down, the app quietly switches to a second one. If that also fails, it falls back to a simpler method that always works. The person using it still gets an answer either way.",
  },
  {
    title: "I check the answer first",
    description:
      "AI can reply with something that sounds confident and is completely wrong. Before anything reaches the screen, the app checks the answer actually makes sense — and it stays clear whether a reply came from the AI or the backup.",
  },
];

// Tool names stay as-is because recruiters and their screening software search
// for them; the plain-English line says what each one actually does.
export const skillCategories = [
  {
    title: "The AI services I work with",
    items: [
      { name: "Groq", evidence: "Runs AI answers very quickly" },
      { name: "OpenAI", evidence: "The company behind ChatGPT" },
      { name: "Anthropic Claude", evidence: "A rival AI, better at careful work" },
      { name: "Vercel AI SDK", evidence: "Lets me swap between AI providers" },
      { name: "Cerebras", evidence: "My backup when the main one fails" },
      { name: "Llama 3.1 / 3.3", evidence: "A small cheap AI and a big smart one" },
    ],
  },
  {
    title: "Making AI safe and reliable",
    items: [
      { name: "Prompt engineering", evidence: "Writing clear instructions for the AI" },
      { name: "Injection defence", evidence: "Stops people hijacking the AI" },
      { name: "Answer validation", evidence: "Checks replies before anyone sees them" },
      { name: "Automatic failover", evidence: "Switches to a backup when one breaks" },
      { name: "Cost control", evidence: "Caps what each request is allowed to spend" },
      { name: "Personal data redaction", evidence: "Hides private details before sending" },
    ],
  },
  {
    title: "The part you see",
    items: [
      { name: "React", evidence: "Builds the screens and buttons" },
      { name: "Next.js", evidence: "The framework the websites run on" },
      { name: "TypeScript", evidence: "Catches mistakes before release" },
      { name: "Tailwind CSS", evidence: "Makes it look right on any screen size" },
      { name: "React Query", evidence: "Handles waiting and retrying smoothly" },
      { name: "Zustand", evidence: "Remembers what you have done on the page" },
    ],
  },
  {
    title: "The part you don't",
    items: [
      { name: "Node.js", evidence: "Runs the system behind the screens" },
      { name: "Go", evidence: "A second language for fast services" },
      { name: "PostgreSQL", evidence: "Stores information safely and reliably" },
      { name: "Redis", evidence: "Keeps things fast, stops overuse" },
      { name: "Supabase", evidence: "Storage, sign-in, and live updates" },
      { name: "Rate limiting", evidence: "Stops one person overloading the app" },
    ],
  },
  {
    title: "Quality and shipping",
    items: [
      { name: "Vitest / Jest", evidence: "Automated checks that nothing broke" },
      { name: "Zod", evidence: "Rejects bad data before it causes damage" },
      { name: "Git / GitHub", evidence: "Tracks every change and who made it" },
      { name: "Vercel", evidence: "Puts the finished work online" },
      { name: "Docker", evidence: "Makes it run the same everywhere" },
      { name: "Logging", evidence: "Shows what went wrong when it does" },
    ],
  },
];

export const services = [
  {
    title: "The system behind your app",
    desc: "The hidden part that talks to the AI: sending the request, handling it when something goes wrong, switching to a backup, and making sure the bill does not quietly get out of hand.",
  },
  {
    title: "The screens people use",
    desc: "The website or app itself — quick, clear, works properly on a phone, and honest with the person about what is happening while the AI is still thinking.",
  },
  {
    title: "Keeping it safe",
    desc: "Stopping people from tricking the AI into misbehaving, hiding personal details before they ever leave the device, and limiting how much any one person can use at a time.",
  },
  {
    title: "Keeping it fast and affordable",
    desc: "Sending easy jobs to a cheaper AI and hard ones to a smarter, pricier one — so people are not left waiting and you are not paying premium rates for simple work.",
  },
];

export const experiences = [
  {
    company: "Mercuryx",
    role: "Software Engineer & Technical Mentor",
    period: "Oct 2025 — Present",
    description:
      "I take features all the way from the first idea through building, testing, and putting them live for real users. I also teach the newer developers on the team, which is constant practice at explaining technical decisions to people who do not already know the background.",
    technologies: ["React", "JavaScript", "Testing", "Releases", "Teaching"],
    current: true,
  },
  {
    company: "Learn2Earn",
    role: "Backend Engineering Programme — Go",
    period: "Nov 2025 — Dec 2025",
    description:
      "An intensive programme in Go, a programming language built for systems that need to handle a lot of people at once. It covered how to design the behind-the-scenes half of an app so it stays fast and stable under load.",
    technologies: ["Go", "System design", "Handling scale"],
    current: false,
  },
  {
    company: "Vivaking Technologies",
    role: "Full Stack Developer",
    period: "Mar 2025 — Nov 2025",
    description:
      "I built complete features for clients — the screens people used, the system storing their information, and everything connecting the two. A lot of the work was making the parts people touched most often noticeably faster.",
    technologies: ["React", "Node.js", "MongoDB", "Performance"],
    current: false,
  },
];
