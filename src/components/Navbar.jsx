import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun, Menu, X, Cpu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const links = ["Home", "About", "Experience", "Projects", "Contact"];

  return (
    <nav className="fixed w-full top-0 z-50 glass py-4 px-6 md:px-10 flex items-center justify-between">
      <a
        href="#home"
        onClick={() => setIsOpen(false)}
        className="logo-text text-xl md:text-2xl font-bold text-cyan-300 flex items-center gap-2"
        aria-label="Go to home"
      >
        <Cpu className="w-5 h-5" />
        <span className="hidden sm:inline">MyPortfolio</span>
      </a>

      {/* Desktop: Nav links and centered theme toggle */}
      <div className="hidden md:flex items-center">
        <ul className="flex items-center gap-7 dark:text-white text-slate-900">
          {links.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="relative font-semibold tracking-wide hover:text-cyan-300 transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={toggleTheme}
          className="absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-cyan-300"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Mobile: Theme toggle and burger menu */}
      <div className="flex md:hidden items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full glass flex items-center justify-center text-cyan-300"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </motion.button>

        <button
          className="dark:text-white text-slate-900"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isOpen && (
        <motion.ul
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full glass flex flex-col items-center gap-4 py-6 dark:text-white text-slate-900 md:hidden"
        >
          {links.map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="font-semibold text-lg hover:text-cyan-300 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item}
              </a>
            </li>
          ))}
        </motion.ul>
      )}
    </nav>
  );
}
