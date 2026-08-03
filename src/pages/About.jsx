import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, BookOpen, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { aboutParagraphs, currentlyLearning, profile, skillCategories } from "../data/profile";

function SectionIntro({ eyebrow, title, children }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {children ? <p className="section-description">{children}</p> : null}
    </div>
  );
}

// Deliberately short. This section exists to establish credibility in a few
// seconds and hand the reader straight to the projects — the principles,
// practices, and services grids that used to live here all restated what the
// two paragraphs below and the case studies already say.
export default function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" className="content-section section-shell scroll-mt-24">
      <SectionIntro eyebrow="What I do" title="Getting a model to answer is easy. Keeping it correct under load is the job." />

      <div className="about-layout">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: -18 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="about-story surface"
        >
          <div className="story-label">01 / Approach</div>
          <div className="story-copy">
            {aboutParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <div className="story-footer">
            <div className="contact-mini">
              <span className="mini-avatar">EA</span>
              <div><strong>{profile.name}</strong><span>{profile.shortHeadline}</span></div>
            </div>
            <a className="text-link" href="#projects">See the work <ArrowUpRight className="h-4 w-4" /></a>
          </div>
        </motion.div>

        <motion.aside
          initial={prefersReducedMotion ? false : { opacity: 0, x: 18 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="about-aside"
        >
          <div className="info-list surface">
            <div className="info-row"><MapPin className="h-4 w-4" /><span>Working</span><strong>Remote · {profile.timezone}</strong></div>
            <div className="info-row"><Mail className="h-4 w-4" /><span>Email</span><a href={`mailto:${profile.email}`}>{profile.email}</a></div>
            <div className="info-row"><Github className="h-4 w-4" /><span>Code</span><a href={profile.github} target="_blank" rel="noopener noreferrer">@{profile.githubHandle}</a></div>
            {profile.linkedin ? (
              <div className="info-row"><Linkedin className="h-4 w-4" /><span>LinkedIn</span><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">{profile.linkedinHandle || "Profile"}</a></div>
            ) : null}
          </div>
          <a className="button button-primary button-wide" href="/Resume.pdf" download="Emmanuel-Adejoh-CV.pdf">
            <Download className="h-4 w-4" /> Download my resume
          </a>
        </motion.aside>
      </div>

      <div className="subsection-heading skills-heading">
        <div><p className="eyebrow">Toolkit</p><h3>What I use, and what I use it for</h3></div>
        <p>Each name carries what it actually does in the systems I have shipped.</p>
      </div>
      <div className="skills-grid">
        {skillCategories.map((category) => (
          <div className="skill-group surface" key={category.title}>
            <h3>{category.title}</h3>
            <div className="skill-list">
              {category.items.map((skill) => (
                <div className="skill-row" key={skill.name}>
                  <strong>{skill.name}</strong>
                  <span>{skill.evidence}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="learning-strip">
        <p className="eyebrow"><BookOpen className="h-3.5 w-3.5" /> Currently learning</p>
        <div className="learning-tags">
          {currentlyLearning.map((item) => (
            <span key={item.name} title={item.note}>{item.name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
