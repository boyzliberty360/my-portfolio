import { motion } from "framer-motion";
import { ArrowRight, Mail, Github } from "lucide-react";

const PROFILE_IMAGE = "https://github.com/boyzliberty360.png?size=512";

export default function Home() {
  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden px-6 pb-16 pt-12 md:px-12 lg:px-20"
    >
      <motion.div
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-3rem] top-20 h-40 w-40 rounded-full bg-cyan-500/15 blur-2xl md:left-10 md:h-64 md:w-64"
      />
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-2rem] top-32 h-36 w-36 rounded-full bg-violet-500/15 blur-2xl md:right-20 md:h-48 md:w-48"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-1/3 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl md:h-32 md:w-32"
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-base font-medium text-cyan-300 sm:text-lg md:text-xl"
          >
            Hi, I am
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="ai-heading mb-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl md:text-6xl xl:text-7xl"
          >
            Adejoh Emmanuel
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6 text-xl font-semibold text-cyan-300 sm:text-2xl md:text-3xl xl:text-4xl"
          >
            Full Stack Developer
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-10 max-w-2xl text-base leading-relaxed text-slate-700 dark:text-gray-300 sm:text-lg md:text-xl"
          >
            I build things that work and work well. As a full-stack developer with hands-on experience
            in React, Node.js, and Go (Golang), I specialize in turning ideas into fully realized digital
            products.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col gap-4 sm:flex-row sm:flex-wrap"
          >
            <a
              href="#projects"
              className="group neon-pill flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-cyan-300 transition-all duration-300 hover:scale-105 glass"
            >
              View My Work
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href="#contact"
              className="group flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-slate-900 transition-all duration-300 hover:scale-105 dark:text-white glass"
            >
              <Mail className="h-5 w-5" />
              Contact Me
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40, y: 20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mx-auto w-full max-w-sm"
        >
          <div className="glass overflow-hidden rounded-[2rem] border border-cyan-400/20 p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">
              <img
                src={PROFILE_IMAGE}
                alt="Adejoh Emmanuel profile"
                className="h-[20rem] w-full object-cover sm:h-[24rem] md:h-[28rem]"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-transparent p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">GitHub Profile</p>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg font-semibold text-white">boyzliberty360</p>
                    <p className="text-sm text-slate-300">Frontend, backend, product-focused builds</p>
                  </div>
                  <a
                    href="https://github.com/boyzliberty360"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950"
                    aria-label="Open GitHub profile"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="glass flex h-10 w-6 justify-center rounded-full pt-2"
        >
          <div className="h-2 w-1 rounded-full bg-cyan-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
