import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const links = ["About", "Projects", "Experience", "Certifications", "Testimonials", "Contact"];
  const toggleLabel = `Switch to ${isDark ? "light" : "dark"} mode`;

  return (
    <nav aria-label="Primary navigation" className="site-nav fixed top-0 z-50 w-full px-4 py-4 md:px-8">
      <div className="nav-inner mx-auto max-w-6xl rounded-2xl px-3 py-2.5 md:rounded-full md:px-5 md:py-3">
        <div className="relative flex items-center justify-between gap-4">
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="logo-text relative z-10 flex min-w-0 items-center gap-2 text-base font-bold text-slate-950 dark:text-white sm:text-lg"
            aria-label="Go to home"
          >
            <span className="brand-mark"><Sparkles className="h-4 w-4" /></span>
            <span className="truncate">Emmanuel Adejoh</span>
          </a>

          <div className="hidden md:absolute md:left-1/2 md:flex md:-translate-x-1/2 md:items-center">
            <button
              onClick={toggleTheme}
              className="theme-icon-button"
              aria-label={toggleLabel}
              aria-pressed={isDark}
              title={toggleLabel}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="hidden items-center md:flex">
            <ul className="flex items-center gap-3 text-slate-900 dark:text-white lg:gap-5">
              {links.map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="nav-link relative text-[0.78rem] font-semibold tracking-wide transition-colors duration-200 lg:text-[0.86rem]"
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
              className="theme-icon-button"
              aria-label={toggleLabel}
              aria-pressed={isDark}
              title={toggleLabel}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
              <div className="mobile-menu mt-3 rounded-2xl p-2">
                <ul className="grid gap-2">
                  {links.map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="nav-link block rounded-xl px-3.5 py-2.5 text-[15px] font-semibold text-slate-900 transition-colors dark:text-white"
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
