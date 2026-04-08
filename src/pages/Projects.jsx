import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "../components/Card";

const GITHUB_USERNAME =
  import.meta.env.VITE_GITHUB_USERNAME?.trim() || "emmyade360";
const buildGithubPreview = (repoName) =>
  `https://opengraph.githubassets.com/1/${GITHUB_USERNAME}/${repoName}`;
const buildSitePreview = (url) =>
  `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1200`;

const PROJECT_CATALOG = {
  "construction-hub": {
    id: "fallback-construction-hub",
    displayName: "Construction Hub",
    name: "construction-hub",
    description:
      "A construction materials commerce platform with category-led browsing, cart, checkout, and admin operations.",
    language: "JavaScript",
    html_url: null,
    homepage: "https://constructionhub.vercel.app",
    default_branch: "HEAD",
    imageUrl: buildSitePreview("https://constructionhub.vercel.app"),
    liveUrl: "https://constructionhub.vercel.app",
  },
  "dualedge-fx": {
    id: "fallback-dualedge-fx",
    displayName: "DualEdge FX",
    name: "dualedge-fx",
    description:
      "A polished forex and market-intelligence experience focused on performance, trust, and high-conversion landing flows.",
    language: "JavaScript",
    html_url: `https://github.com/${GITHUB_USERNAME}/dualedge-fx`,
    homepage: import.meta.env.VITE_DUALEDGE_FX_LIVE_URL?.trim() || "",
    default_branch: "HEAD",
    imageUrl: buildGithubPreview("dualedge-fx"),
    liveUrl: import.meta.env.VITE_DUALEDGE_FX_LIVE_URL?.trim() || null,
  },
  "spend-lens": {
    id: "fallback-spend-lens",
    displayName: "Spend Lens",
    name: "spend-lens",
    description:
      "A finance-focused application for tracking spending patterns, monitoring categories, and improving budgeting visibility.",
    language: "JavaScript",
    html_url: `https://github.com/${GITHUB_USERNAME}/spend-lens`,
    homepage: "",
    default_branch: "HEAD",
    imageUrl: buildGithubPreview("spend-lens"),
    liveUrl: null,
  },
  rejob: {
    id: "fallback-rejob",
    displayName: "ReJob",
    name: "rejob",
    description:
      "An online open source job listing site for employers to list job and for job seekers to apply for jobs with their documents",
    language: "JavaScript",
    html_url: `https://github.com/${GITHUB_USERNAME}/rejob`,
    homepage: "",
    default_branch: "HEAD",
    imageUrl: buildGithubPreview("rejob"),
    liveUrl: null,
  },
  hauntr: {
    id: "fallback-hauntr",
    displayName: "Hauntr",
    name: "hauntr",
    description: "A haunted experience project from my GitHub",
    language: "JavaScript",
    html_url: `https://github.com/${GITHUB_USERNAME}/hauntr`,
    homepage: "",
    default_branch: "HEAD",
    imageUrl: buildGithubPreview("hauntr"),
    liveUrl: null,
  },
};

const DEFAULT_FEATURED_REPOS = [
  "construction-hub",
  "dualedge-fx",
  "spend-lens",
  "rejob",
  "hauntr",
];

const FEATURED_REPOS = (
  import.meta.env.VITE_FEATURED_REPOS || DEFAULT_FEATURED_REPOS.join(",")
)
  .split(",")
  .map((repo) => repo.trim().toLowerCase())
  .filter(Boolean);

const FALLBACK_REPOS = FEATURED_REPOS.map(
  (repoName) =>
    PROJECT_CATALOG[repoName] || {
      id: `fallback-${repoName}`,
      displayName: repoName
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      name: repoName,
      description: "A featured project from my GitHub portfolio.",
      language: "JavaScript",
      html_url: `https://github.com/${GITHUB_USERNAME}/${repoName}`,
      homepage: "",
      default_branch: "HEAD",
      imageUrl: buildGithubPreview(repoName),
      liveUrl: null,
    }
);

export default function Projects() {
  const [repos, setRepos] = useState(FALLBACK_REPOS);

  useEffect(() => {
    const username = GITHUB_USERNAME;
    const imageMarkdownRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const imageHtmlRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gi;
    const htmlLinkRegex = /<a[^>]+href=["'](https?:\/\/[^"']+)["'][^>]*>(.*?)<\/a>/gi;
    const bareUrlRegex = /https?:\/\/[^\s)<>"]+/gi;
    const liveUrlHintRegex = /(live|demo|preview|app|website|site|vercel|netlify|render)/i;
    const preferredDomainRegex = /(vercel\.app|netlify\.app|web\.app|firebaseapp\.com|onrender\.com|pages\.dev|github\.io)/i;
    const iconHintRegex = /(icon|logo|favicon)/i;
    const featuredRepos = FEATURED_REPOS;
    let isMounted = true;

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

    const extractReadmeHomepage = (content) => {
      const markdownLinks = Array.from(content.matchAll(markdownLinkRegex)).map((match) => ({
        label: match[1],
        url: match[2],
      }));
      const htmlLinks = Array.from(content.matchAll(htmlLinkRegex)).map((match) => ({
        label: match[2] || "",
        url: match[1],
      }));
      const bareUrls = Array.from(content.matchAll(bareUrlRegex)).map((match) => ({
        label: "",
        url: match[0],
      }));

      const candidates = [...markdownLinks, ...htmlLinks, ...bareUrls]
        .map((item) => ({
          ...item,
          url: normalizeUrl(item.url),
        }))
        .filter((item) => item.url && !item.url.includes("github.com"));

      if (candidates.length === 0) return null;

      const preferredByDomain = candidates.find((item) => preferredDomainRegex.test(item.url));
      if (preferredByDomain) return preferredByDomain.url;

      const preferredByHint = candidates.find(
        (item) => liveUrlHintRegex.test(item.label) || liveUrlHintRegex.test(item.url)
      );
      if (preferredByHint) return preferredByHint.url;

      return candidates[0].url;
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

    const fetchRepoMetadata = async (repo) => {
      const configuredLiveUrl = normalizeUrl(repo.homepage?.trim());
      if (configuredLiveUrl) {
        return {
          liveUrl: configuredLiveUrl,
          imageUrl: buildScreenshotUrl(configuredLiveUrl),
        };
      }

      try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`);
        if (!res.ok) {
          return {
            liveUrl: null,
            imageUrl: buildGithubPreview(repo.name),
          };
        }
        const readme = await res.json();
        if (!readme?.content) {
          return {
            liveUrl: null,
            imageUrl: buildGithubPreview(repo.name),
          };
        }

        const decoded = atob(readme.content.replace(/\n/g, ""));
        const readmeHomepage = extractReadmeHomepage(decoded);
        if (readmeHomepage) {
          return {
            liveUrl: readmeHomepage,
            imageUrl: buildScreenshotUrl(readmeHomepage),
          };
        }

        const readmeImage = extractReadmeImage(decoded, repo);
        if (readmeImage) {
          return {
            liveUrl: null,
            imageUrl: readmeImage,
          };
        }

        if (repo.name.toLowerCase() === "hauntr") {
          const iconUrl = await fetchRepoIcon(repo);
          if (iconUrl) {
            return {
              liveUrl: null,
              imageUrl: iconUrl,
            };
          }
          const searchedIcon = await searchRepoIcon(repo);
          if (searchedIcon) {
            return {
              liveUrl: null,
              imageUrl: searchedIcon,
            };
          }
        }

        return {
          liveUrl: null,
          imageUrl: buildGithubPreview(repo.name),
        };
      } catch {
        return {
          liveUrl: null,
          imageUrl: buildGithubPreview(repo.name),
        };
      }
    };

    const fetchRepoByName = async (repoName) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!res.ok) return null;
        const repo = await res.json();
        if (!repo?.name) return null;
        return repo;
      } catch {
        return null;
      }
    };

    const loadRepos = async () => {
      try {
        const fetchedRepos = await Promise.all(
          featuredRepos.map(async (repoName) => {
            const repo = await fetchRepoByName(repoName);
            const fallbackRepo = FALLBACK_REPOS.find(
              (item) => item.name.toLowerCase() === repoName
            );

            return {
              ...(fallbackRepo || {}),
              ...(repo || {}),
            };
          })
        );

        const sorted = fetchedRepos.filter(Boolean);

        const withImages = await Promise.all(
          sorted.map(async (repo) => {
            const metadata = await fetchRepoMetadata(repo);
            return {
              ...repo,
              imageUrl: metadata.imageUrl,
              liveUrl: metadata.liveUrl,
            };
          })
        );

        if (!isMounted) return;

        setRepos(
          featuredRepos.map((repoName) => {
            const fetchedRepo = withImages.find((repo) => repo.name.toLowerCase() === repoName);
            const fallbackRepo = FALLBACK_REPOS.find((repo) => repo.name.toLowerCase() === repoName);

            return {
              ...(fallbackRepo || {}),
              ...(fetchedRepo || {}),
            };
          })
        );
      } catch (err) {
        if (!isMounted) return;
        setRepos((currentRepos) => currentRepos.length > 0 ? currentRepos : FALLBACK_REPOS);
      }
    };

    loadRepos();

    return () => {
      isMounted = false;
    };
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
            title={repo.displayName || repo.name}
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
            language={repo.language}
          />
        ))}
      </div>
    </section>
  );
}
