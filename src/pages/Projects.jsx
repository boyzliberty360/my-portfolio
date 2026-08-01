import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";
import { getAdminProjects } from "../lib/adminProjects";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadProjects = () => {
      getAdminProjects().then((data) => {
        if (active) {
          setProjects(data);
          setLoading(false);
        }
      });
    };

    loadProjects();
    const sync = () => loadProjects();
    window.addEventListener("admin-projects-updated", sync);
    return () => {
      active = false;
      window.removeEventListener("admin-projects-updated", sync);
    };
  }, []);

  if (loading) {
    return (
      <section id="projects" className="space-y-10 px-6 md:px-16 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="ai-heading text-4xl font-bold text-center text-cyan-300"
        >
          Projects
        </motion.h2>
        <p className="text-center dark:text-slate-500 text-slate-400 text-sm">
          Loading projects...
        </p>
      </section>
    );
  }

  return (
    <section id="projects" className="space-y-10 px-6 md:px-16 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="ai-heading text-4xl font-bold text-center text-cyan-300"
      >
        Projects
      </motion.h2>
      {projects.length === 0 ? (
        <p className="text-center dark:text-slate-500 text-slate-400 text-sm">
          No projects yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((repo) => (
            <Card
              key={repo.id}
              title={repo.name || repo.displayName}
              description={repo.description}
              link={repo.link || repo.liveUrl || repo.html_url}
              image={repo.image}
            />
          ))}
        </div>
      )}
    </section>
  );
}
