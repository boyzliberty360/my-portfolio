import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";

export default function Projects() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    const username = "boyzliberty360";
    const imageMarkdownRegex = /!\[[^\]]*\]\(([^)]+)\)/;
    const imageHtmlRegex = /<img[^>]+src=["']([^"']+)["']/i;

    const toAbsoluteImageUrl = (url, repo) => {
      if (!url) return null;
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      const cleaned = url.replace(/^\.?\//, "");
      return `https://raw.githubusercontent.com/${username}/${repo.name}/${repo.default_branch}/${cleaned}`;
    };

    const extractReadmeImage = (content, repo) => {
      const markdownMatch = content.match(imageMarkdownRegex);
      if (markdownMatch?.[1]) return toAbsoluteImageUrl(markdownMatch[1], repo);
      const htmlMatch = content.match(imageHtmlRegex);
      if (htmlMatch?.[1]) return toAbsoluteImageUrl(htmlMatch[1], repo);
      return null;
    };

    const normalizeUrl = (url) => {
      if (!url) return null;
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      return `https://${url}`;
    };

    const buildScreenshotUrl = (url) => {
      const normalized = normalizeUrl(url);
      if (!normalized) return null;
      return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(normalized)}?w=1200`;
    };

    const fetchRepoImage = async (repo) => {
      const liveUrl = normalizeUrl(repo.homepage?.trim());
      if (liveUrl) {
        return buildScreenshotUrl(liveUrl);
      }

      try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`);
        if (!res.ok) return `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
        const readme = await res.json();
        if (!readme?.content) return `https://opengraph.githubassets.com/1/${username}/${repo.name}`;

        const decoded = atob(readme.content.replace(/\n/g, ""));
        return (
          extractReadmeImage(decoded, repo) ||
          `https://opengraph.githubassets.com/1/${username}/${repo.name}`
        );
      } catch {
        return `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
      }
    };

    const loadRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await res.json();
        const filtered = data.filter((repo) => repo.name.toLowerCase() === "rejob");
        const withImages = await Promise.all(
          filtered.map(async (repo) => ({
            ...repo,
            imageUrl: await fetchRepoImage(repo),
            liveUrl: normalizeUrl(repo.homepage?.trim()) || null,
          }))
        );
        setRepos(withImages);
      } catch (err) {
        // Silent fail - repos will just be empty
      }
    };

    loadRepos();
  }, []);

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
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {repos.map((repo) => (
          <Card
            key={repo.id}
            title={repo.name}
            description={
              <>
                <p>{repo.description || "An online open source job listing site for employers to list job and for job seekers to apply for jobs with their documents"}</p>
                {repo.language && (
                  <p className="mt-2 text-gray-400 dark:text-gray-500 text-sm">
                    Language: {repo.language}
                  </p>
                )}
              </>
            }
            link={repo.html_url}
            imageUrl={repo.imageUrl}
            liveUrl={repo.liveUrl}
          />
        ))}
      </div>
    </section>
  );
}
