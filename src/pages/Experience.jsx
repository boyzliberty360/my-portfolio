import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Briefcase, Calendar } from "lucide-react";
import { experiences } from "../data/profile";

export default function Experience() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="experience" className="content-section section-shell scroll-mt-24">
      <div className="section-intro section-intro-row">
        <div><p className="eyebrow">Experience</p><h2 className="section-title">Where I have worked.</h2></div>
        <p className="section-description">Building and releasing software for real users, deepening the behind-the-scenes side, and teaching other developers along the way.</p>
      </div>

      <div className="experience-list">
        {experiences.map((experience, index) => (
          <motion.article
            key={`${experience.company}-${experience.role}`}
            initial={prefersReducedMotion ? false : { opacity: 0, x: -14 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="experience-item"
          >
            <div className="experience-marker" aria-hidden="true"><Briefcase className="h-4 w-4" /></div>
            <div className="experience-content surface">
              <div className="experience-topline">
                <div><p className="experience-company">{experience.company}{experience.current ? <span className="current-badge">Current</span> : null}</p><h3>{experience.role}</h3></div>
                <span className="experience-period"><Calendar className="h-3.5 w-3.5" /> {experience.period}</span>
              </div>
              <p className="experience-description">{experience.description}</p>
              <div className="tag-list">
                {(experience.technologies || []).map((technology) => <span key={technology}>{technology}</span>)}
              </div>
              <a className="text-link experience-link" href="#contact">Ask me about this role <ArrowUpRight className="h-4 w-4" /></a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
