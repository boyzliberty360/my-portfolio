import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, ExternalLink, Layers3 } from "lucide-react";
import { projectCaseStudies } from "../data/projectCaseStudies";

const slugify = (value) =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// `npm run previews` writes screenshots to this convention, so a project added
// through the admin gets a preview without anyone editing its stored record.
const conventionalPreview = (title) => {
  const slug = slugify(title);
  return slug ? `/images/projects/${slug}.webp` : null;
};

const CASE_STUDY_FIELDS = [
  { key: "problem", label: "The problem" },
  { key: "solution", label: "What it does" },
  { key: "role", label: "What I did" },
  { key: "architecture", label: "How it is built" },
  { key: "challenge", label: "The hardest part" },
  { key: "response", label: "How I solved it" },
];

export default function Card({ title, description, link, image, technologies = [], flagship = false, github, caseStudy }) {
  // Content entered in the admin wins; the checked-in map is the fallback for
  // projects written before the admin carried case-study fields. Neither one
  // present means no case study renders at all — generic filler reads worse
  // than an absent section.
  const study = caseStudy || projectCaseStudies[title] || null;
  const entries = study ? CASE_STUDY_FIELDS.filter((field) => study[field.key]) : [];
  const quality = study?.quality?.length ? study.quality : [];
  const hasCaseStudy = entries.length > 0 || quality.length > 0;

  // An explicit image wins; otherwise try the screenshot convention and fall
  // back to the placeholder if that file is not there.
  const [previewFailed, setPreviewFailed] = useState(false);
  const preview = previewFailed ? null : image || conventionalPreview(title);

  return (
    <motion.article
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className={`project-card surface ${flagship ? "project-card-featured" : ""}`}
    >
      <div className="project-visual">
        {preview ? (
          <img
            src={preview}
            alt={`Screenshot of the ${title} homepage`}
            width="900" height="563"
            loading="lazy"
            decoding="async"
            onError={() => setPreviewFailed(true)}
          />
        ) : (
          <div className="project-placeholder">
            <Layers3 className="h-6 w-6" aria-hidden="true" />
            <strong>{title}</strong>
            {study?.type ? <span>{study.type}</span> : null}
          </div>
        )}
        {flagship || hasCaseStudy ? (
          <div className="project-visual-overlay">
            <span>{flagship ? "Flagship project" : "Selected work"}</span>
            {hasCaseStudy ? <span>How I built it <ArrowUpRight className="h-3.5 w-3.5" /></span> : null}
          </div>
        ) : null}
      </div>

      <div className="project-card-body">
        <div className="project-heading-row">
          <div>
            {study?.type ? <p className="project-type">{study.type}</p> : null}
            <h3>{title}</h3>
          </div>
          {flagship ? <span className="flagship-badge">Flagship</span> : null}
        </div>
        {description ? <p className="project-summary">{description}</p> : null}
        {technologies.length ? (
          <div className="tag-list" aria-label={`${title} technologies`}>
            {technologies.slice(0, 5).map((tech) => <span key={tech}>{tech}</span>)}
          </div>
        ) : null}

        {hasCaseStudy ? (
          <details className="case-study-details">
            <summary>See how I built this <ArrowUpRight className="h-4 w-4" /></summary>
            <div className="case-study-content">
              {entries.length ? (
                <div className="case-study-grid">
                  {entries.map((field) => (
                    <div key={field.key}>
                      <span className="detail-label">{field.label}</span>
                      <p>{study[field.key]}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              {quality.length ? (
                <div className="quality-list">
                  {quality.map((item) => <span key={item}><Check className="h-3.5 w-3.5" /> {item}</span>)}
                </div>
              ) : null}
            </div>
          </details>
        ) : null}

        <div className="project-actions">
          {link ? <a className="button button-primary button-small" href={link} target="_blank" rel="noopener noreferrer">View live project <ExternalLink className="h-3.5 w-3.5" /></a> : null}
          {github ? <a className="button button-secondary button-small" href={github} target="_blank" rel="noopener noreferrer">View code <ExternalLink className="h-3.5 w-3.5" /></a> : null}
        </div>
      </div>
    </motion.article>
  );
}
