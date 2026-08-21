import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { getPublishedTestimonials } from "../lib/adminTestimonials";

const LINKS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "about", label: "About" },
  { id: "certifications", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

const TESTIMONIALS_LINK = { id: "testimonials", label: "Testimonials" };

// The same dashed-gear mark as the favicon in public/engineer.svg, redrawn on
// currentColor so it picks up the accent chip in both themes. The favicon's
// trend line is dropped. At this size three elements read as noise.
function BrandMark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[1.05rem] w-[1.05rem]" aria-hidden="true">
      {/* Six teeth, not the favicon's nine: at 17px the finer dash pattern
          blurs into a plain ring and the gear reads as a circle. */}
      <circle
        cx="12" cy="12" r="8"
        stroke="currentColor" strokeWidth="3"
        strokeDasharray="5.2 3.18" strokeLinecap="butt"
      />
      <circle cx="12" cy="12" r="2.9" fill="currentColor" />
    </svg>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hasTestimonials, setHasTestimonials] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    let active = true;
    const loadTestimonials = () => getPublishedTestimonials().then((data) => {
      if (active) setHasTestimonials(data.length > 0);
    });
    loadTestimonials();
    window.addEventListener("testimonials-updated", loadTestimonials);
    return () => {
      active = false;
      window.removeEventListener("testimonials-updated", loadTestimonials);
    };
  }, []);

  const links = useMemo(
    () => (hasTestimonials
      ? [...LINKS.slice(0, 4), TESTIMONIALS_LINK, LINKS[4]]
      : LINKS),
    [hasTestimonials],
  );

  // Highlights whichever section currently owns the viewport. The top margin
  // clears the fixed nav so a section is only "active" once it is actually
  // readable, and the bottom margin keeps the last section from winning early
  // while the one above it still fills the screen.
  useEffect(() => {
    const sections = links
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveSection(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [links]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const toggleLabel = `Switch to ${isDark ? "light" : "dark"} mode`;

  return (
    <nav aria-label="Primary navigation" className="site-nav fixed top-0 z-50 w-full px-3 py-3 sm:px-5 sm:py-4">
      <div className="nav-inner mx-auto max-w-6xl rounded-2xl px-3 py-2.5 sm:px-4 lg:rounded-full lg:px-5">
        <div className="nav-layout">
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="logo-text flex min-w-0 items-center gap-2 text-base font-bold sm:text-lg"
            aria-label="Go to home"
          >
            <span className="brand-mark"><BrandMark /></span>
            <span className="truncate">Emmanuel Adejoh</span>
          </a>

          <div className="nav-desktop">
            <ul className="nav-links" aria-label="Portfolio sections">
              {links.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={activeSection === item.id ? "location" : undefined}
                    className="nav-link"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="nav-actions">
              <a className="nav-resume" href="/Resume.pdf" download="Emmanuel-Adejoh-CV.pdf">
                <Download aria-hidden="true" />
                <span>Resume</span>
              </a>
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
          </div>

          <div className="nav-mobile-actions">
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
              className="mobile-menu-button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
            >
              <span>{isOpen ? "Close" : "Menu"}</span>
              {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
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
              className="lg:hidden"
            >
              <div id="mobile-navigation" className="mobile-menu mt-3 rounded-2xl p-2.5">
                <div className="mobile-menu-heading">
                  <span>Navigate</span>
                  <span>{String(links.length).padStart(2, "0")} sections</span>
                </div>
                <ul className="mobile-nav-links">
                  {links.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        aria-current={activeSection === item.id ? "location" : undefined}
                        className="nav-link mobile-nav-link"
                        onClick={() => setIsOpen(false)}
                      >
                        <span>{item.label}</span>
                        <span aria-hidden="true">{String(links.indexOf(item) + 1).padStart(2, "0")}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  className="mobile-resume-link"
                  href="/Resume.pdf"
                  download="Emmanuel-Adejoh-CV.pdf"
                  onClick={() => setIsOpen(false)}
                >
                  <Download aria-hidden="true" /> Download resume
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
