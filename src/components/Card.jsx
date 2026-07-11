import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Card({ title, description, link, imageUrl, liveUrl, language }) {
  const previewHref = liveUrl || link;
  const [failedImageUrl, setFailedImageUrl] = useState("");
  const hasImageError = failedImageUrl === imageUrl;
  const blockedIframeHosts = new Set(["www.npmjs.com", "npmjs.com"]);

  let shouldEmbedLiveUrl = false;
  if (liveUrl) {
    try {
      const hostname = new URL(liveUrl).hostname.toLowerCase();
      // Most Vercel deployments and npmjs pages deny iframe embedding.
      const likelyBlockedHost =
        hostname.endsWith(".vercel.app") || blockedIframeHosts.has(hostname);
      shouldEmbedLiveUrl = !likelyBlockedHost;
    } catch {
      shouldEmbedLiveUrl = false;
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="glass cursor-pointer rounded-2xl p-5"
      style={{ willChange: "transform" }}
    >
      <a
        href={previewHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group mb-4 block"
      >
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-black">
          {liveUrl && shouldEmbedLiveUrl ? (
            <iframe
              src={liveUrl}
              title={`${title} live preview`}
              className="h-44 w-full bg-white"
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
            />
          ) : imageUrl && !hasImageError ? (
            <img
              src={imageUrl}
              alt={`${title} preview`}
              className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
              onError={() => setFailedImageUrl(imageUrl)}
            />
          ) : (
            <div className="flex h-44 w-full flex-col justify-between bg-white p-5 dark:bg-black">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-cyan-300">
                <span>Project Preview</span>
                <span>{language || "Web App"}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {liveUrl && !shouldEmbedLiveUrl
                    ? "Live preview is blocked by the target site. Use Open site to view it."
                    : "Open the project to view its source or live build."}
                </p>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent px-4 py-3 text-xs font-medium text-white">
            <span>
              {liveUrl
                ? shouldEmbedLiveUrl
                  ? "Live project preview"
                  : "Live preview unavailable"
                : "Repository preview"}
            </span>
            <span className="text-cyan-300">{liveUrl ? "Open site ->" : "Open source ->"}</span>
          </div>
        </div>
      </a>

      <h3 className="mb-2 text-xl font-bold text-cyan-400">{title}</h3>
      <div className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-gray-200">{description}</div>

      <div className="flex items-center gap-3">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lg-btn px-4 py-1.5 text-sm font-medium text-white"
          >
            <span className="relative z-10">{"Live Site ->"}</span>
          </a>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="lg-btn px-4 py-1.5 text-sm font-medium text-white"
          >
            <span className="relative z-10">{"Source ->"}</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
