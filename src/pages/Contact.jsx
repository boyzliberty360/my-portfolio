import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Clock, FileText, Github, Linkedin, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { profile } from "../data/profile";

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

const loadRateLimitData = () => {
  try {
    const stored = localStorage.getItem("contact-form-rate-limit");
    if (stored) {
      const data = JSON.parse(stored);
      if (Date.now() - data.windowStart <= RATE_LIMIT_WINDOW) return data;
    }
  } catch {
    // Local storage is optional; the form still works without it.
  }
  return { windowStart: Date.now(), requestCount: 0 };
};

const saveRateLimitData = (data) => {
  try { localStorage.setItem("contact-form-rate-limit", JSON.stringify(data)); } catch { /* optional */ }
};

export default function Contact() {
  const prefersReducedMotion = useReducedMotion();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [remainingRequests, setRemainingRequests] = useState(MAX_REQUESTS_PER_WINDOW);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const updateRateLimitState = useCallback(() => {
    const data = loadRateLimitData();
    const elapsed = Date.now() - data.windowStart;
    if (elapsed > RATE_LIMIT_WINDOW) {
      const reset = { windowStart: Date.now(), requestCount: 0 };
      saveRateLimitData(reset);
      setRemainingRequests(MAX_REQUESTS_PER_WINDOW);
      setCooldownSeconds(0);
      setIsRateLimited(false);
      return;
    }
    setRemainingRequests(Math.max(0, MAX_REQUESTS_PER_WINDOW - data.requestCount));
    setCooldownSeconds(Math.max(0, Math.ceil((RATE_LIMIT_WINDOW - elapsed) / 1000)));
    setIsRateLimited(data.requestCount >= MAX_REQUESTS_PER_WINDOW);
  }, []);

  useEffect(() => {
    updateRateLimitState();
    const interval = setInterval(updateRateLimitState, 1000);
    return () => clearInterval(interval);
  }, [updateRateLimitState]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = loadRateLimitData();
    if (data.requestCount >= MAX_REQUESTS_PER_WINDOW) {
      setSubmitStatus({ type: "error", message: `Please wait ${cooldownSeconds || 60} seconds before sending another message.` });
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;
    setSubmitStatus({ type: "", message: "" });
    setShowFallback(false);

    if (!accessKey) {
      setSubmitStatus({ type: "error", message: "The contact form is not configured yet." });
      setShowFallback(true);
      return;
    }

    formData.append("access_key", accessKey);
    formData.append("subject", formData.get("subject") || "New portfolio contact");
    formData.append("from_name", formData.get("name"));
    formData.append("email_from", formData.get("email"));
    formData.append("to_name", "Emmanuel");
    formData.append("reply_to", formData.get("email"));

    try {
      setIsSubmitting(true);
      const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to send message");
      const updated = { windowStart: data.windowStart, requestCount: data.requestCount + 1 };
      saveRateLimitData(updated);
      updateRateLimitState();
      setSubmitStatus({ type: "success", message: "Message sent successfully. I will get back to you soon." });
      form.reset();
    } catch {
      setSubmitStatus({ type: "error", message: "The form service is unavailable right now." });
      setShowFallback(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = isSubmitting || isRateLimited || remainingRequests === 0;
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Role opportunity")}`;
  const whatsapp = `https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(
    `Hi Emmanuel, I found your portfolio and I'd like to talk about an AI engineering role.`,
  )}`;

  return (
    <section id="contact" className="content-section section-shell scroll-mt-24">
      <div className="contact-header">
        <div><p className="eyebrow">Get in touch</p><h2 className="section-title">{profile.availability}.</h2></div>
        <p className="section-description">
          Hiring, or want to dig into something on this page? Tell me what you are building and where it is hard. {profile.responseTime}
        </p>
      </div>

      <div className="contact-layout">
        <motion.form
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="contact-form surface"
        >
          <div className="form-heading"><span className="form-step">01</span><div><h3>Send a message</h3><p>A job opening, a problem you are stuck on, or just a question — all welcome.</p></div></div>
          <div className="form-grid">
            <label><span>Name</span><input name="name" type="text" autoComplete="name" required disabled={isDisabled} /></label>
            <label><span>Email</span><input name="email" type="email" autoComplete="email" required disabled={isDisabled} /></label>
          </div>
          <label><span>Subject <small>Optional</small></span><input name="subject" type="text" autoComplete="off" disabled={isDisabled} /></label>
          <label><span>Message</span><textarea name="message" rows="6" required disabled={isDisabled} /></label>
          {isRateLimited ? <p className="form-note form-note-warning"><Clock className="h-4 w-4" /> Cooldown: {cooldownSeconds}s</p> : null}
          <button className="button button-primary button-submit" type="submit" disabled={isDisabled}><Send className="h-4 w-4" />{isSubmitting ? "Sending…" : isRateLimited ? `Wait ${cooldownSeconds}s` : "Send message"}</button>
          {submitStatus.message ? <p className={`form-status ${submitStatus.type}`} aria-live="polite">{submitStatus.message}</p> : null}
          {showFallback ? <a className="text-link" href={mailto}>Open your email app instead <ArrowUpRight className="h-4 w-4" /></a> : null}
        </motion.form>

        <motion.aside
          initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="contact-aside"
        >
          <div className="contact-card surface"><span className="form-step">02</span><h3>Prefer a direct line?</h3><p>WhatsApp is the fastest way to reach me. My resume is a click away, and the code behind everything here is public on GitHub.</p>
            <div className="direct-links">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /><span><small>WhatsApp</small>{profile.phone}</span><ArrowUpRight className="h-4 w-4" /></a>
              <a href={mailto}><Mail className="h-4 w-4" /><span><small>Email</small>{profile.email}</span><ArrowUpRight className="h-4 w-4" /></a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer"><Github className="h-4 w-4" /><span><small>GitHub</small>@{profile.githubHandle}</span><ArrowUpRight className="h-4 w-4" /></a>
              {profile.linkedin ? (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin className="h-4 w-4" /><span><small>LinkedIn</small>{profile.linkedinHandle || "Profile"}</span><ArrowUpRight className="h-4 w-4" /></a>
              ) : null}
              <a href="/Resume.pdf" download="Emmanuel-Adejoh-CV.pdf"><FileText className="h-4 w-4" /><span><small>Resume</small>PDF download</span><ArrowUpRight className="h-4 w-4" /></a>
            </div>
          </div>
          <div className="contact-location"><MapPin className="h-4 w-4" /><span>{profile.timezoneNote}</span></div>
        </motion.aside>
      </div>
    </section>
  );
}
