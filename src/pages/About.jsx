import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Download, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";
import { aiPractices, aboutParagraphs, profile, services, skillCategories, workingPrinciples } from "../data/profile";

function SectionIntro({ eyebrow, title, children }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      {children ? <p className="section-description">{children}</p> : null}
    </div>
  );
}

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="about" className="content-section section-shell scroll-mt-24">
      <SectionIntro eyebrow="What I do" title="Making AI work once is easy. Keeping it working is the job." />

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
            <a className="text-link" href="#contact">Get in touch <ArrowUpRight className="h-4 w-4" /></a>
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

      <div className="principles-grid">
        {workingPrinciples.map((principle, index) => (
          <motion.article
            key={principle.title}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
            className="principle-card"
          >
            <span className="principle-number">0{index + 1}</span>
            <h3>{principle.title}</h3>
            <p>{principle.description}</p>
          </motion.article>
        ))}
      </div>

      <div className="subsection-heading">
        <div><p className="eyebrow">Safety nets</p><h3>Three things I always build in</h3></div>
        <p>Plugging an app into an AI takes an afternoon. These are the protections that decide whether it still works six months later, and every project of mine has all three.</p>
      </div>
      <div className="principles-grid">
        {aiPractices.map((practice, index) => (
          <motion.article
            key={practice.title}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
            className="principle-card"
          >
            <span className="principle-number"><Sparkles className="h-3.5 w-3.5" /></span>
            <h3>{practice.title}</h3>
            <p>{practice.description}</p>
          </motion.article>
        ))}
      </div>

      <div className="subsection-heading">
        <div><p className="eyebrow">What I can take on</p><h3>Four things I handle for a team</h3></div>
        <p>I can build an AI feature from the screen a person sees all the way down to the system underneath — so it does not need splitting between two people who then have to keep each other in sync.</p>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <motion.article
            key={service.title}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: index * 0.07 }}
            className="service-card surface"
          >
            <span className="service-check"><Check className="h-4 w-4" /></span>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </motion.article>
        ))}
      </div>

      <div className="subsection-heading skills-heading">
        <div><p className="eyebrow">Toolkit</p><h3>The tools I use, in plain English</h3></div>
        <p>These names mean a lot to other engineers and very little to anyone else, so each one has a line saying what it actually does.</p>
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
    </section>
  );
}
