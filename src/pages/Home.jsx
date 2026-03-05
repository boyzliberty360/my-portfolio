import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

export default function Home() {
  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center relative overflow-hidden px-6 md:px-20"
    >
      <motion.div
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-64 h-64 glass rounded-full bg-cyan-500/20"
      />
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 right-20 w-48 h-48 glass rounded-full bg-violet-500/20"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-32 left-1/3 w-32 h-32 glass rounded-full bg-indigo-500/15"
      />

      <div className="relative z-10 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-cyan-300 text-lg md:text-xl font-medium mb-4"
        >
          Hi, I am
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="ai-heading text-5xl md:text-7xl font-bold mb-4 dark:text-white text-slate-900"
        >
          Adejoh Emmanuel
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-2xl md:text-4xl text-cyan-300 font-semibold mb-8"
        >
          Full Stack Developer
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl dark:text-gray-300 text-slate-700 max-w-xl mb-10 leading-relaxed"
        >
          I build things that work and work well. As a full-stack developer with hands-on experience
          in React, Node.js, and Python, I specialize in turning ideas into fully realized digital
          products.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#projects"
            className="group neon-pill flex items-center gap-2 px-8 py-4 glass rounded-full text-cyan-300 font-semibold transition-all duration-300 hover:scale-105"
          >
            View My Work
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#contact"
            className="group flex items-center gap-2 px-8 py-4 glass rounded-full dark:text-white text-slate-900 font-semibold transition-all duration-300 hover:scale-105"
          >
            <Mail className="w-5 h-5" />
            Contact Me
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 glass rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-cyan-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
