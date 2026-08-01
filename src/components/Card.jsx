import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function Card({ title, description, link, image }) {
  return (
    <motion.article
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 280, damping: 22 }}
      className="glass rounded-2xl p-5"
      style={{ willChange: "transform" }}
    >
      <div className="group relative mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-black">
        {image ? (
          <img
            src={image}
            alt={`${title} website preview`}
            className="h-44 w-full object-cover object-top"
            loading="lazy"
            decoding="async"
          />
        ) : link ? (
          <iframe
            src={link}
            title={`${title} website preview`}
            className="pointer-events-none h-44 w-full bg-white"
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
          />
        ) : (
          <div className="flex h-44 items-center justify-center px-5 text-center text-sm text-slate-500 dark:text-slate-400">
            Project preview unavailable
          </div>
        )}

        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-slate-950/95 via-slate-950/15 to-transparent px-4 py-3 text-xs font-medium text-white"
            aria-label={`Open ${title}`}
          >
            <span>Live project preview</span>
            <span className="inline-flex items-center gap-1 text-cyan-300">
              Open project <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </a>
        )}
      </div>

      <h3 className="mb-2 text-xl font-bold text-cyan-400">{title}</h3>
      <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-gray-200">
        {description}
      </p>

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="lg-btn inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white"
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            View project <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </a>
      )}
    </motion.article>
  );
}
