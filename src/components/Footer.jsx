import { profile } from "../data/profile";
import { Clock, Github, Linkedin, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer mt-16">
      <div className="footer-silhouette">
        <div className="footer-glow footer-glow-one" aria-hidden="true" />
        <div className="footer-glow footer-glow-two" aria-hidden="true" />
        <div className="section-shell footer-content">
          <div className="footer-cta">
            <p className="footer-kicker">{profile.availability}</p>
            <h2>Need a full-stack engineer?<br /><em>Let's talk about the product.</em></h2>
          </div>

          <div className="footer-links-area">
            <div className="footer-identity">
              <div>
                <p>{profile.name}</p>
                <span>{profile.shortHeadline}</span>
                <span className="footer-meta">
                  <span><MapPin className="h-3.5 w-3.5" /> Remote from {profile.location}, {profile.timezone}</span>
                  <span><Clock className="h-3.5 w-3.5" /> {profile.responseTime}</span>
                </span>
              </div>
              <div className="footer-socials" aria-label="Social links">
                <a href={`mailto:${profile.email}`} aria-label="Email Emmanuel" title="Email Emmanuel"><Mail className="h-4 w-4" /></a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="Open Emmanuel's GitHub" title="GitHub"><Github className="h-4 w-4" /></a>
                {profile.linkedin ? <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Open Emmanuel's LinkedIn" title="LinkedIn"><Linkedin className="h-4 w-4" /></a> : null}
              </div>
            </div>
            <nav aria-label="Footer navigation" className="footer-nav">
              <a className="footer-link" href="#about">About</a>
              <a className="footer-link" href="#projects">Projects</a>
              <a className="footer-link" href="#experience">Experience</a>
              <a className="footer-link" href="#contact">Contact</a>
              <a className="footer-link" href="/Resume.pdf" download="Emmanuel-Adejoh-CV.pdf">Resume</a>
              <a className="footer-link" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              {profile.linkedin ? (
                <a className="footer-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              ) : null}
            </nav>
          </div>

          <div className="footer-bottom">
            <span>Built with React, Vite, and Framer Motion</span>
            <span>© {new Date().getFullYear()} {profile.name}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
