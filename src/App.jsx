import React from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import { ThemeProvider } from "./context/ThemeContext";

const sectionVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

export default function App() {
  return (
    <ThemeProvider>
      <div className="app-shell min-h-screen overflow-x-hidden transition-colors duration-500 dark:text-white text-slate-900">
        <Navbar />
        <motion.main
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.15 }}
          className="mt-20 space-y-20 md:space-y-24 lg:space-y-28"
        >
          <motion.div variants={sectionVariant}>
            <Home />
          </motion.div>
          <motion.div variants={sectionVariant}>
            <About />
          </motion.div>
          <motion.div variants={sectionVariant}>
            <Experience />
          </motion.div>
          <motion.div variants={sectionVariant}>
            <Projects />
          </motion.div>
          <motion.div variants={sectionVariant}>
            <Contact />
          </motion.div>
        </motion.main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
