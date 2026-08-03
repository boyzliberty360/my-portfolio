import { motion, useReducedMotion } from "framer-motion";
import { Award, CalendarDays, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { certifications } from "../data/profile";

const [certificate] = certifications;

export default function Certifications() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="certifications" className="content-section section-shell scroll-mt-24">
      <div className="section-intro section-intro-row">
        <div><p className="eyebrow">Credentials</p><h2 className="section-title">Checked by someone other than me.</h2></div>
        <p className="section-description">Anyone can call themselves a developer. This one was awarded after an assessed programme and competition run by Nomba and DevCareer.</p>
      </div>

      <motion.article
        initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55 }}
        className="certification-card surface"
      >
        <a className="certificate-image-link" href={certificate.image} target="_blank" rel="noopener noreferrer" aria-label="Open Nomba Developer Certification in full size">
          <img src={certificate.image} alt="Nomba Certified Developer certificate awarded to Emmanuel Adejoh" width="1800" height="1200" loading="lazy" decoding="async" />
          <span>View full size <ExternalLink className="h-3.5 w-3.5" /></span>
        </a>
        <div className="certificate-copy">
          <span className="certificate-icon"><Award className="h-5 w-5" /></span>
          <p className="project-type">{certificate.issuer}</p>
          <h3>{certificate.name}</h3>
          <p>Completed the {certificate.programme}.</p>
          <dl className="credential-meta">
            <div><CalendarDays className="h-4 w-4" /><dt>Issued</dt><dd>{certificate.issued}</dd></div>
            <div><ShieldCheck className="h-4 w-4" /><dt>Credential</dt><dd>{certificate.credentialId}</dd></div>
          </dl>
          <div className="project-actions">
            <a className="button button-primary button-small" href={certificate.image} target="_blank" rel="noopener noreferrer">View certificate <ExternalLink className="h-3.5 w-3.5" /></a>
            <a className="button button-secondary button-small" href={certificate.image} download="Emmanuel-Adejoh-Nomba-Certificate-2026.png"><Download className="h-3.5 w-3.5" /> Download</a>
          </div>
        </div>
      </motion.article>
    </section>
  );
}
