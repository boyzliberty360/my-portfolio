import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";

const GITHUB_USERNAME = "boyzliberty360";
const FALLBACK_REPOS = [
  {
    id: "fallback-rejob",
    name: "rejob",
    description:
      "An online open source job listing site for employers to list job and for job seekers to apply for jobs with their documents",
    language: "JavaScript",
    html_url: `https://github.com/${GITHUB_USERNAME}/rejob`,
    homepage: "",
    default_branch: "HEAD",
  },
  {
    id: "fallback-hauntr",
    name: "hauntr",
    description: "A haunted experience project from my GitHub",
    language: "JavaScript",
    html_url: `https://github.com/${GITHUB_USERNAME}/hauntr`,
    homepage: "",
    default_branch: "HEAD",
  },
];

export default function Projects() {
  const [repos, setRepos] = useState(FALLBACK_REPOS);

  useEffect(() => {
    const username = GITHUB_USERNAME;
    const imageMarkdownRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const imageHtmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const iconHintRegex = /(icon|logo|favicon)/i;
    const featuredRepos = ["rejob", "hauntr"];

    const toAbsoluteImageUrl = (url, repo) => {
      if (!url) return null;
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      const cleaned = url.replace(/^\.?\//, "");
      const branch = repo.default_branch || "HEAD";
      return `https://raw.githubusercontent.com/${username}/${repo.name}/${branch}/${cleaned}`;
    };

    const extractReadmeImage = (content, repo) => {
      const markdownMatches = Array.from(content.matchAll(imageMarkdownRegex)).map(
        (match) => ({ alt: match[1], url: match[2] })
      );
      if (markdownMatches.length > 0) {
        const preferred = markdownMatches.find(
          (match) => iconHintRegex.test(match.alt) || iconHintRegex.test(match.url)
        );
        const picked = preferred || markdownMatches[0];
        return toAbsoluteImageUrl(picked.url, repo);
      }

      const htmlMatches = Array.from(content.matchAll(imageHtmlRegex)).map((match) => {
        const tag = match[0];
        const srcMatch = tag.match(/src=["']([^"']+)["']/i);
        const altMatch = tag.match(/alt=["']([^"']+)["']/i);
        return { alt: altMatch?.[1] || "", url: srcMatch?.[1] || "" };
      });
      if (htmlMatches.length > 0) {
        const preferred = htmlMatches.find(
          (match) => iconHintRegex.test(match.alt) || iconHintRegex.test(match.url)
        );
        const picked = preferred || htmlMatches[0];
        return toAbsoluteImageUrl(picked.url, repo);
      }

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

    const buildRawUrl = (path, repo) => {
      const branch = repo.default_branch || "HEAD";
      return `https://raw.githubusercontent.com/${username}/${repo.name}/${branch}/${path}`;
    };

    const toRawFromHtmlUrl = (htmlUrl) => {
      if (!htmlUrl) return null;
      return htmlUrl
        .replace("https://github.com/", "https://raw.githubusercontent.com/")
        .replace("/blob/", "/");
    };

    const searchRepoIcon = async (repo) => {
      const baseQuery = `repo:${username}/${repo.name}`;
      const queries = [
        `${baseQuery} filename:icon extension:png`,
        `${baseQuery} filename:icon extension:svg`,
        `${baseQuery} filename:icon extension:jpg`,
        `${baseQuery} filename:logo extension:png`,
        `${baseQuery} filename:logo extension:svg`,
        `${baseQuery} filename:logo extension:jpg`,
        `${baseQuery} filename:favicon extension:png`,
        `${baseQuery} filename:favicon extension:ico`,
      ];

      for (const query of queries) {
        try {
          const res = await fetch(
            `https://api.github.com/search/code?q=${encodeURIComponent(query)}`
          );
          if (!res.ok) continue;
          const data = await res.json();
          const first = data?.items?.[0];
          const rawUrl = toRawFromHtmlUrl(first?.html_url);
          if (rawUrl) return rawUrl;
        } catch {
          // ignore and continue
        }
      }
      return null;
    };

    const fetchRepoIcon = async (repo) => {
      const iconCandidates = [
        "icon.png",
        "icon.jpg",
        "icon.jpeg",
        "icon.svg",
        "icon.webp",
        "logo.png",
        "logo.jpg",
        "logo.jpeg",
        "logo.svg",
        "logo.webp",
        "favicon.ico",
        "favicon.png",
        "public/icon.png",
        "public/icon.jpg",
        "public/icon.jpeg",
        "public/icon.svg",
        "public/icon.webp",
        "public/logo.png",
        "public/logo.jpg",
        "public/logo.jpeg",
        "public/logo.svg",
        "public/logo.webp",
        "public/favicon.ico",
        "public/favicon.png",
        "src/assets/icon.png",
        "src/assets/icon.jpg",
        "src/assets/icon.jpeg",
        "src/assets/icon.svg",
        "src/assets/icon.webp",
        "src/assets/logo.png",
        "src/assets/logo.jpg",
        "src/assets/logo.jpeg",
        "src/assets/logo.svg",
        "src/assets/logo.webp",
      ];

      for (const candidate of iconCandidates) {
        const url = buildRawUrl(candidate, repo);
        try {
          const res = await fetch(url, { method: "HEAD" });
          if (res.ok) return url;
        } catch {
          // ignore and continue
        }
      }
      return null;
    };

    const fetchRepoImage = async (repo) => {
      const liveUrl = normalizeUrl(repo.homepage?.trim());
      if (liveUrl) return buildScreenshotUrl(liveUrl);

      try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`);
        if (!res.ok) return `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
        const readme = await res.json();
        if (!readme?.content) return `https://opengraph.githubassets.com/1/${username}/${repo.name}`;

        const decoded = atob(readme.content.replace(/\n/g, ""));
        const readmeImage = extractReadmeImage(decoded, repo);
        if (readmeImage) return readmeImage;

        if (repo.name.toLowerCase() === "hauntr") {
          const iconUrl = await fetchRepoIcon(repo);
          if (iconUrl) return iconUrl;
          const searchedIcon = await searchRepoIcon(repo);
          if (searchedIcon) return searchedIcon;
        }

        return `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
      } catch {
        return `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
      }
    };

    const loadRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos`);
        const data = await res.json();
        if (!Array.isArray(data)) {
          setRepos(FALLBACK_REPOS);
          return;
        }
        const filtered = data.filter((repo) =>
          featuredRepos.includes(repo.name.toLowerCase())
        );
        const sorted = featuredRepos
          .map((name) => filtered.find((repo) => repo.name.toLowerCase() === name))
          .filter(Boolean);
        if (sorted.length === 0) {
          setRepos(FALLBACK_REPOS);
          return;
        }
        const withImages = await Promise.all(
          sorted.map(async (repo) => ({
            ...repo,
            imageUrl: await fetchRepoImage(repo),
            liveUrl: normalizeUrl(repo.homepage?.trim()) || null,
          }))
        );
        setRepos(withImages);
      } catch (err) {
        setRepos(FALLBACK_REPOS);
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
