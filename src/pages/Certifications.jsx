import { motion, useReducedMotion } from "framer-motion";
import { Award, CalendarDays, Download, ExternalLink, ShieldCheck } from "lucide-react";

const CERTIFICATE_IMAGE = "/certifications/nomba-developer-certification-2026.png";

export default function Certifications() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="certifications" className="scroll-mt-24 px-6 py-20 md:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-500 dark:text-cyan-300">
            Professional growth
          </p>
          <h2 className="ai-heading text-4xl font-bold text-slate-900 dark:text-white">
            Certifications
          </h2>
          <p className="mt-4 text-base text-slate-600 dark:text-slate-300 md:text-lg">
            Industry-recognized training and achievements that support my work as a software developer.
          </p>
        </motion.div>

        <motion.article
          initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="glass overflow-hidden rounded-[2rem] p-3 sm:p-5 lg:p-6"
        >
          <div className="grid items-center gap-6 lg:grid-cols-[1.45fr_0.55fr] lg:gap-8">
            <a
              href={CERTIFICATE_IMAGE}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-[1.4rem] border border-slate-200 bg-slate-950 shadow-2xl dark:border-white/10"
              aria-label="Open the Nomba Developer Certification in full size"
            >
              <img
                src={CERTIFICATE_IMAGE}
                alt="Nomba Certified Developer certificate awarded to Emmanuel Adejoh"
                width="1800"
                height="1200"
                loading="lazy"
                decoding="async"
                className="aspect-[3/2] h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.015]"
              />
              <span className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/75 px-3 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                <ExternalLink className="h-3.5 w-3.5" />
                Full size
              </span>
            </a>

            <div className="px-2 pb-3 sm:px-3 lg:px-0 lg:pb-0 lg:pr-2">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-500 ring-1 ring-amber-400/25 dark:text-amber-300">
                <Award className="h-6 w-6" />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">
                Nomba × DevCareer
              </p>
              <h3 className="mt-3 text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                Certified Nomba Developer
              </h3>
              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                Completed the Nomba Developer Certification through the Nomba × DevCareer Hackathon 2026.
              </p>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <CalendarDays className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
                  <div>
                    <dt className="sr-only">Issue date</dt>
                    <dd>Issued July 1, 2026</dd>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-300" />
                  <div>
                    <dt className="sr-only">Credential ID</dt>
                    <dd>Credential ID: NMB-2026-XX6Z9S</dd>
                  </div>
                </div>
              </dl>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={CERTIFICATE_IMAGE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lg-btn inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white"
                >
                  <ExternalLink className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">View certificate</span>
                </a>
                <a
                  href={CERTIFICATE_IMAGE}
                  download="Emmanuel-Adejoh-Nomba-Certificate-2026.png"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-cyan-500 hover:text-cyan-600 dark:border-white/20 dark:text-white dark:hover:border-cyan-300 dark:hover:text-cyan-300"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
