import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Card({ title, description, link, imageUrl, liveUrl, language }) {
  const previewHref = liveUrl || link;
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [imageUrl]);

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(34, 211, 238, 0.3)" }}
      className="glass dark:bg-black/30 bg-white/10 p-6 rounded-xl cursor-pointer transition-all duration-300 hover:border-cyan-400/50"
    >
      <a
        href={previewHref}
        target="_blank"
        rel="noopener noreferrer"
        className="group block mb-4"
      >
        <div className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-900">
          {imageUrl && !hasImageError ? (
            <img
              src={imageUrl}
              alt={`${title} preview`}
              className="h-44 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              loading="lazy"
              onError={() => setHasImageError(true)}
            />
          ) : (
            <div className="flex h-44 w-full flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.22em] text-cyan-300">
                <span>Project Preview</span>
                <span>{language || "Web App"}</span>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-300">
                  Open the project to view its source or live build.
                </p>
              </div>
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent px-4 py-3 text-xs font-medium text-white">
            <span>{liveUrl ? "Live project preview" : "Repository preview"}</span>
            <span className="text-cyan-300">{liveUrl ? "Open site" : "Open source"}</span>
          </div>
        </div>
      </a>

      <h3 className="text-xl font-bold mb-2 text-cyan-400">{title}</h3>
      <div className="text-gray-300 dark:text-gray-200 mb-4">{description}</div>
      <div className="flex items-center gap-4">
        {liveUrl && (
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline font-medium"
          >
            Live Site {"->"}
          </a>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-300 hover:underline font-medium"
          >
            Source {"->"}
          </a>
        )}
      </div>
    </motion.div>
  );
}
