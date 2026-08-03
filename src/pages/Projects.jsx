import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Card from "../components/Card";
import { getAdminProjects } from "../lib/adminProjects";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    const loadProjects = () => {
      getAdminProjects().then((data) => {
        if (active) {
          // Featured work leads; the rest keep the order they were published in.
          setProjects([...data].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))));
          setLoading(false);
        }
      });
    };
    loadProjects();
    window.addEventListener("admin-projects-updated", loadProjects);
    return () => {
      active = false;
      window.removeEventListener("admin-projects-updated", loadProjects);
    };
  }, []);

  return (
    <section id="projects" className="content-section section-shell scroll-mt-24">
      <div className="section-intro section-intro-row">
        <div><p className="eyebrow">Selected work</p><h2 className="section-title">Shipped, and open to inspection.</h2></div>
        <p className="section-description">Every one of these is deployed and usable right now. The case studies go past the feature list into the architecture, the failure modes, and the decisions I would have to defend in review — including the ones I got wrong first.</p>
      </div>

      {loading ? (
        <div className="project-grid" aria-busy="true" aria-label="Loading projects">
          {[1, 2].map((item) => <div className="project-skeleton surface" key={item}><span /><span /><span /></div>)}
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state surface"><p>Projects are being updated. Please check back soon.</p></div>
      ) : (
        <div className="project-grid">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Card
                title={project.name || project.displayName}
                description={project.description}
                link={project.link || project.liveUrl || project.html_url}
                image={project.image}
                technologies={project.technologies || project.stack || []}
                github={project.github || project.githubUrl}
                caseStudy={project.caseStudy}
                flagship={Boolean(project.featured)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
