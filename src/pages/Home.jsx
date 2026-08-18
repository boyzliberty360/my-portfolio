import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowRight, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { profile, proofPoints } from "../data/profile";

const PROFILE_IMAGE = "/images/adejoh-emmanuel-professional.webp";
export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="home" className="hero-section section-shell scroll-mt-24">
      <div className="hero-grid">
        <div className="hero-copy">
          <div className="role-switcher" aria-label="Primary role">
            <span>Primary role</span>
            <strong>{profile.title}</strong>
          </div>

          <motion.h1
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.65 }}
            className="hero-title"
          >
            I build the full stack. <em>From interface to API.</em>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.65 }}
            className="hero-lede"
          >
            {profile.headline}
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.65 }}
            className="hero-actions"
          >
            <a className="button button-primary" href="#projects">
              View case studies <ArrowRight className="h-4 w-4" />
            </a>
            <a className="button button-secondary" href="/Resume.pdf" download="Emmanuel-Adejoh-CV.pdf">
              <Download className="h-4 w-4" /> Download resume
            </a>
            <a className="button button-ghost" href="#contact">
              Get in touch
            </a>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.65 }}
            className="hero-meta"
          >
            <span><MapPin className="h-4 w-4" /> Remote, {profile.timezone}</span>
            <a href={`mailto:${profile.email}`}><Mail className="h-4 w-4" /> {profile.email}</a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /> GitHub</a>
            {profile.linkedin ? (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /> LinkedIn</a>
            ) : null}
          </motion.div>
        </div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96, y: 18 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.8 }}
          className="hero-profile"
        >
          <div className="profile-frame">
            <div className="profile-frame-top">
              <span>EM 01</span>
              <span>Full-stack web + AI workflows</span>
            </div>
            <img
              src={PROFILE_IMAGE}
              alt="Emmanuel Adejoh in a professional suit"
              width="1000"
              height="1250"
              loading="eager"
              decoding="async"
            />
            <div className="profile-caption">
              <div>
                <p className="profile-name">Emmanuel Adejoh</p>
                <p className="profile-role">Interfaces, services, and data systems</p>
              </div>
              <a className="icon-button" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="Open Emmanuel's GitHub profile">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="profile-note">{profile.timezoneNote}</div>
        </motion.div>
      </div>

      <div className="hero-proof" aria-label="Areas of focus">
        {proofPoints.map((point) => (
          <div className="proof-item" key={point.value}>
            <strong>{point.value}</strong>
            <span>{point.label}</span>
          </div>
        ))}
        <a className="proof-link" href="#about">How I work <ArrowDownRight className="h-4 w-4" /></a>
      </div>
    </section>
  );
}
