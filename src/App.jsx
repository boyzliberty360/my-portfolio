import React from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Certifications from "./pages/Certifications";
import Testimonials from "./pages/Testimonials";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import { ThemeProvider } from "./context/ThemeContext";

const sectionVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

function Portfolio() {
  return (
    <div className="app-shell min-h-screen overflow-x-hidden transition-colors duration-500 dark:text-white text-slate-900">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <motion.main
        id="main-content"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.1 }}
        className="space-y-8 md:space-y-12"
      >
        <motion.div variants={sectionVariant}><Home /></motion.div>
        <motion.div variants={sectionVariant}><About /></motion.div>
        <motion.div variants={sectionVariant}><Projects /></motion.div>
        <motion.div variants={sectionVariant}><Experience /></motion.div>
        <motion.div variants={sectionVariant}><Certifications /></motion.div>
        <motion.div variants={sectionVariant}><Testimonials /></motion.div>
        <motion.div variants={sectionVariant}><Contact /></motion.div>
      </motion.main>
      <Footer />
    </div>
  );
}

export default function App() {
  const isAdmin = window.location.pathname === "/admin";

  return (
    <ThemeProvider>
      {isAdmin ? <Admin /> : <Portfolio />}
    </ThemeProvider>
  );
}
