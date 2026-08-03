import fs from "node:fs";
import path from "node:path";
import { certifications, experiences, profile, resumeSkillGroups, resumeSummary } from "../src/data/profile.js";

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN_X = 48;
const MARGIN_TOP = 54;
const MARGIN_BOTTOM = 52;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const COLORS = {
  ink: [0.08, 0.12, 0.12],
  muted: [0.30, 0.37, 0.35],
  accent: [0.02, 0.36, 0.32],
  accentLight: [0.88, 0.94, 0.92],
  line: [0.78, 0.83, 0.81],
  softLine: [0.90, 0.93, 0.92],
};

const outputPath = path.resolve("public", "Resume.pdf");
const pages = [];
let currentPage = [];
let y = PAGE_HEIGHT - MARGIN_TOP;

// The content stream is written as latin1 with Helvetica in StandardEncoding,
// so any multi-byte character would both render as mojibake and desync the
// declared stream length. Fold typographic punctuation down to ASCII first.
const ASCII_SUBSTITUTIONS = [
  [/[—–]/g, "-"],
  [/[‘’‛]/g, "'"],
  [/[“”]/g, '"'],
  [/…/g, "..."],
  [/·/g, "-"],
  [/ /g, " "],
];

function toAscii(value) {
  let text = String(value);
  for (const [pattern, replacement] of ASCII_SUBSTITUTIONS) {
    text = text.replace(pattern, replacement);
  }
  // Anything still outside printable ASCII would corrupt the stream.
  return text.replace(/[^\x20-\x7E]/g, "");
}

function escapePdfText(value) {
  return toAscii(value).replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}

function drawText(text, x, yPos, font = "F1", size = 11, color = COLORS.ink) {
  currentPage.push(`BT ${color[0]} ${color[1]} ${color[2]} rg /${font} ${size} Tf 1 0 0 1 ${x} ${yPos} Tm (${escapePdfText(text)}) Tj ET`);
}

function drawLine(x1, y1, x2, y2, width = 1, rgb = COLORS.line) {
  currentPage.push(`${width} w ${rgb[0]} ${rgb[1]} ${rgb[2]} RG ${x1} ${y1} m ${x2} ${y2} l S`);
}

function drawFilledRect(x, yPos, width, height, rgb) {
  currentPage.push(`${rgb[0]} ${rgb[1]} ${rgb[2]} rg ${x} ${yPos} ${width} ${height} re f`);
}

function startPage() {
  currentPage = [];
  y = PAGE_HEIGHT - MARGIN_TOP;
}

function wrapText(text, size, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  const maxChars = Math.max(20, Math.floor(maxWidth / (size * 0.52)));

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars) {
      line = candidate;
    } else {
      if (line) {
        lines.push(line);
      }
      line = word;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}

function pushPage() {
  pages.push(currentPage);
  startPage();
}

function requireSpace(heightNeeded) {
  if (y - heightNeeded < MARGIN_BOTTOM) {
    pushPage();
  }
}

function addWrappedBlock(text, options = {}) {
  const {
    font = "F1",
    size = 11,
    x = MARGIN_X,
    width = PAGE_WIDTH - MARGIN_X * 2,
    lineHeight = size + 4,
    gapAfter = 8,
  } = options;
  const lines = wrapText(text, size, width);
  requireSpace(lines.length * lineHeight + gapAfter);
  for (const line of lines) {
    drawText(line, x, y, font, size);
    y -= lineHeight;
  }
  y -= gapAfter;
}

function addSectionHeading(text) {
  requireSpace(34);
  drawFilledRect(MARGIN_X, y - 6, CONTENT_WIDTH, 22, COLORS.accentLight);
  drawFilledRect(MARGIN_X, y - 4, 4, 17, COLORS.accent);
  drawText(text.toUpperCase(), MARGIN_X + 12, y, "F2", 12, COLORS.accent);
  y -= 8;
  drawLine(MARGIN_X, y, MARGIN_X + CONTENT_WIDTH, y, 0.65, COLORS.line);
  y -= 17;
}

function addLabelledParagraph(label, value, size = 10, gapAfter = 6) {
  addWrappedBlock(`${label}: ${value}`, {
    font: "F1",
    size,
    lineHeight: size + 4,
    gapAfter,
  });
}

function addBulletList(items, options = {}) {
  const { size = 10, gapAfter = 4 } = options;
  for (const item of items) {
    addWrappedBlock(`- ${item}`, {
      font: "F1",
      size,
      lineHeight: size + 4,
      gapAfter,
    });
  }
}

function buildResumePages() {
  startPage();

  drawFilledRect(0, PAGE_HEIGHT - 10, PAGE_WIDTH, 10, COLORS.accent);

  drawText(profile.name, MARGIN_X, y, "F2", 22, COLORS.ink);
  y -= 30;
  drawText("AI Engineer | Frontend Engineer | Backend Engineer", MARGIN_X, y, "F1", 13, COLORS.accent);
  y -= 22;
  drawText(`${profile.email} | ${profile.phone} | ${profile.location}`, MARGIN_X, y, "F1", 10, COLORS.muted);
  y -= 15;
  drawText(`github.com/${profile.githubHandle} | ${profile.siteUrl}`, MARGIN_X, y, "F1", 10, COLORS.muted);
  y -= 13;
  drawLine(MARGIN_X, y, MARGIN_X + CONTENT_WIDTH, y, 1.1, COLORS.accent);
  y -= 20;

  addSectionHeading("Professional Summary");
  addWrappedBlock(resumeSummary, { size: 11, lineHeight: 16, gapAfter: 10 });

  addSectionHeading("Technical Skills");
  for (const category of resumeSkillGroups) {
    addLabelledParagraph(category.title, category.skills);
  }

  addSectionHeading("Certifications");
  for (const certification of certifications) {
    addLabelledParagraph(
      certification.name,
      `${certification.issuer}; ${certification.programme}; Issued ${certification.issued}; Credential ID ${certification.credentialId}`,
      10,
      8,
    );
  }

  addSectionHeading("AI Engineering");
  addBulletList([
    "Implemented AI application workflows with Groq, OpenAI, Anthropic Claude, Cerebras, and the Vercel AI SDK",
    "Designed provider failover and deterministic fallback paths for degraded or unavailable AI services",
    "Added output validation, prompt-injection controls, personal-data redaction, and request rate limiting",
    "Applied cost-aware model routing so simple tasks use efficient models and complex tasks receive more capable models",
  ]);

  requireSpace(130);
  addSectionHeading("AWS-Ready Cloud Foundations");
  addBulletList([
    "Cloud-ready application foundations: Dockerized Node.js and Go services, stateless REST APIs, environment-based configuration, and health checks",
    "Transferable AWS service patterns across compute, RDS/PostgreSQL, ElastiCache/Redis, S3-style object storage, and CloudWatch-oriented logging",
    "Security-minded delivery with validation, least-privilege thinking, rate limiting, secrets separation, and observable failure paths",
  ]);

  addSectionHeading("Product Engineering");
  addBulletList([
    "Built responsive React and Next.js interfaces that work clearly across phones, tablets, and desktop screens",
    "Implemented Node.js and Go services with PostgreSQL, MongoDB, Redis, Supabase, and REST API integrations",
    "Added automated checks, structured logging, validation, and deployment workflows to improve release confidence",
    "Communicated technical decisions clearly across remote collaboration and supported junior developer growth",
  ]);

  addSectionHeading("Experience");
  for (const item of experiences) {
    requireSpace(96);
    drawFilledRect(MARGIN_X, y - 6, CONTENT_WIDTH, 22, COLORS.accentLight);
    drawText(`${item.role} | ${item.company}`, MARGIN_X, y, "F2", 11, COLORS.ink);
    y -= 16;
    drawText(item.period, MARGIN_X, y, "F1", 10, COLORS.accent);
    y -= 16;
    addWrappedBlock(item.description, { size: 10, lineHeight: 14, gapAfter: 6 });
    // Bullets live on the record in profile.js, not here. Keying them off the
    // company name meant the resume kept its own copy of the story and drifted
    // out of voice with the site the moment either one was edited.
    if (item.highlights?.length) {
      addBulletList(item.highlights, { size: 10, gapAfter: 4 });
    }
    y -= 4;
    if (item !== experiences[experiences.length - 1]) {
      drawLine(MARGIN_X, y, MARGIN_X + CONTENT_WIDTH, y, 0.6, COLORS.softLine);
      y -= 12;
    } else {
      y -= 6;
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
}

function buildPdf(objects) {
  const header = "%PDF-1.4\n";
  let body = "";
  const offsets = [0];

  for (let i = 0; i < objects.length; i += 1) {
    offsets.push(header.length + body.length);
    body += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = header.length + body.length;
  let xref = `xref\n0 ${objects.length + 1}\n`;
  xref += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i += 1) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return `${header}${body}${xref}${trailer}`;
}

buildResumePages();

const pageObjectIds = [];
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [] /Count 0 >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
];

for (const pageCommands of pages) {
  const content = `${pageCommands.join("\n")}\n`;
  const pageObjectId = objects.length + 1;
  const contentObjectId = objects.length + 2;
  pageObjectIds.push(pageObjectId);

  objects.push(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObjectId} 0 R >>`
  );
  objects.push(`<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}endstream`);
}

objects[1] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, buildPdf(objects), "binary");

console.log(`Generated ${outputPath}`);
