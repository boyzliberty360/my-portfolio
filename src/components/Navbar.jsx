import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Cpu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const links = ["Home", "Projects", "About", "Experience", "Contact"];
  const toggleLabel = isDark ? "Dark mode" : "Light mode";

  return (
    <nav className="fixed top-0 z-50 w-full px-3 py-2.5 md:px-8 md:py-3">
      <div className="glass mx-auto max-w-6xl rounded-[1.1rem] px-3 py-2 md:rounded-full md:px-5 md:py-2.5">
        <div className="relative flex items-center justify-between gap-4">
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="logo-text relative z-10 flex min-w-0 items-center gap-1.5 text-base font-bold text-cyan-300 sm:text-lg md:text-xl"
            aria-label="Go to home"
          >
            <Cpu className="h-4.5 w-4.5 shrink-0" />
            <span className="truncate">MyPortfolio</span>
          </a>

          <div className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:items-center">
            <button
              onClick={toggleTheme}
              className="theme-toggle theme-toggle-desktop group relative inline-flex h-10 w-[8.5rem] items-center rounded-full p-1 text-xs font-semibold"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              aria-pressed={isDark}
              title={toggleLabel}
            >
              <span className="theme-toggle-thumb" />
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center gap-1.5 transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-950"
                }`}
              >
                <Sun className="h-3 w-3" />
                Light
              </span>
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center gap-1.5 transition-colors ${
                  isDark ? "text-cyan-100" : "text-slate-500"
                }`}
              >
                <Moon className="h-3 w-3" />
                Dark
              </span>
            </button>
          </div>

          <div className="hidden items-center md:flex">
            <ul className="flex items-center gap-5 text-slate-900 dark:text-white">
              {links.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="relative text-[0.86rem] font-semibold tracking-wide transition-colors duration-200 hover:text-cyan-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="theme-toggle theme-toggle-mobile relative inline-flex h-8.5 w-[6.4rem] items-center rounded-full p-1 text-[10px] font-semibold"
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              aria-pressed={isDark}
              title={toggleLabel}
            >
              <span className="theme-toggle-thumb" />
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center gap-1 transition-colors ${
                  isDark ? "text-slate-400" : "text-slate-950"
                }`}
              >
                <Sun className="h-2.5 w-2.5" />
                <span>Day</span>
              </span>
              <span
                className={`relative z-10 flex w-1/2 items-center justify-center gap-1 transition-colors ${
                  isDark ? "text-cyan-100" : "text-slate-500"
                }`}
              >
                <Moon className="h-2.5 w-2.5" />
                <span>Night</span>
              </span>
            </button>

            <button
              className="mobile-icon-btn dark:text-white text-slate-900"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label="Toggle mobile menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="md:hidden"
            >
              <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-black">
                <ul className="grid gap-2">
                  {links.map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="block rounded-xl px-3.5 py-2.5 text-[15px] font-semibold text-slate-900 transition-colors hover:bg-slate-100 hover:text-cyan-300 dark:text-white dark:hover:bg-white/10"
                        onClick={() => setIsOpen(false)}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
