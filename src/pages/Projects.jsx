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
        <div><p className="eyebrow">Selected work</p><h2 className="section-title">Full-stack products with the decisions left visible.</h2></div>
        <p className="section-description">These projects show the work behind the interface: state changes, data boundaries, payment safety, validation, and the trade-offs that make a product easier to trust.</p>
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
                recruiterProof={project.recruiterProof}
                flagship={Boolean(project.featured)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
