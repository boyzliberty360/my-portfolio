import React from "react";
import { motion } from "framer-motion";

export default function Card({ title, description, link, imageUrl, liveUrl }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(34, 211, 238, 0.3)" }}
      className="glass dark:bg-black/30 bg-white/10 p-6 rounded-xl cursor-pointer transition-all duration-300 hover:border-cyan-400/50"
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={`${title} preview`}
          className="w-full h-44 object-cover rounded-lg mb-4 border border-white/10"
          loading="lazy"
        />
      )}
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
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-300 hover:underline font-medium"
        >
          Source {"->"}
        </a>
      </div>
    </motion.div>
  );
}
