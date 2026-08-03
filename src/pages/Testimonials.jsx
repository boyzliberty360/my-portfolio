import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle, Quote, Send } from "lucide-react";
import { getPublishedTestimonials, submitPublicTestimonial } from "../lib/adminTestimonials";

const initials = (name) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
const EMPTY_REVIEW = { quote: "", name: "", role: "", company: "", contactEmail: "" };

function TestimonialCard({ testimonial, index }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.figure
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="testimonial-card surface"
    >
      <Quote className="testimonial-quote-icon" aria-hidden="true" />
      <blockquote>{testimonial.quote}</blockquote>
      <figcaption>
        {testimonial.avatarUrl ? (
          <img src={testimonial.avatarUrl} alt="" width="40" height="40" loading="lazy" />
        ) : (
          <span className="testimonial-avatar" aria-hidden="true">{initials(testimonial.name)}</span>
        )}
        <span className="testimonial-author"><strong>{testimonial.name}</strong><small>{testimonial.role}, {testimonial.company}</small></span>
        {testimonial.sourceUrl ? <a href={testimonial.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${testimonial.name}'s testimonial source`}><ArrowUpRight className="h-4 w-4" /></a> : null}
      </figcaption>
    </motion.figure>
  );
}

export default function Testimonials() {
  const prefersReducedMotion = useReducedMotion();
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState(EMPTY_REVIEW);
  const [submitting, setSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({ type: "", message: "" });

  useEffect(() => {
    let active = true;
    const load = () => getPublishedTestimonials().then((data) => { if (active) setTestimonials(data); });
    load();
    window.addEventListener("testimonials-updated", load);
    return () => { active = false; window.removeEventListener("testimonials-updated", load); };
  }, []);

  return (
    <section id="testimonials" className="content-section section-shell scroll-mt-24">
      <div className="section-intro section-intro-row">
        <div><p className="eyebrow">References</p><h2 className="section-title">What it is like to work with me.</h2></div>
        <p className="section-description">From people who have actually worked with me. Every quote is from a real colleague, and nothing appears here without being checked first.</p>
      </div>
      {testimonials.length ? <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />)}
      </div> : <p className="testimonial-empty">No public testimonials yet. Be the first to leave a review.</p>}

      <motion.form
        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        onSubmit={async (event) => {
          event.preventDefault();
          if (submitting) return;
          setSubmitting(true);
          setSubmitState({ type: "", message: "" });
          try {
            const website = event.currentTarget.elements.website?.value || "";
            await submitPublicTestimonial(form, website);
            setForm(EMPTY_REVIEW);
            setSubmitState({ type: "success", message: "Thank you. Your review has been received and is waiting for approval." });
          } catch (error) {
            setSubmitState({ type: "error", message: error.message || "We could not submit your review right now." });
          } finally {
            setSubmitting(false);
          }
        }}
        className="review-form surface"
      >
        <div className="review-form-heading"><span className="form-step">Leave a note</span><div><h3>Worked with Emmanuel?</h3><p>Share a short, honest note. It will be reviewed before it appears publicly.</p></div></div>
        <input className="review-honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" />
        <label><span>Your review</span><textarea required maxLength={900} rows={4} value={form.quote} onChange={(event) => setForm({ ...form, quote: event.target.value })} placeholder="What was it like working together?" /></label>
        <div className="review-form-grid">
          <label><span>Name</span><input required maxLength={100} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Your name" /></label>
          <label><span>Role</span><input required maxLength={100} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="Your role" /></label>
          <label><span>Company or context</span><input required maxLength={100} value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="Company or collaboration" /></label>
          <label><span>Email <small>Private verification</small></span><input required type="email" maxLength={160} value={form.contactEmail} onChange={(event) => setForm({ ...form, contactEmail: event.target.value })} placeholder="you@example.com" /></label>
        </div>
        <div className="review-form-footer"><p className="review-privacy">Your email is only used for verification and is never shown on the portfolio.</p><button className="button button-primary button-small" type="submit" disabled={submitting}>{submitting ? "Sending" : "Submit review"} {submitting ? null : <Send className="h-3.5 w-3.5" />}</button></div>
        {submitState.message ? <p className={`review-status ${submitState.type}`} aria-live="polite">{submitState.type === "success" ? <CheckCircle className="h-4 w-4" /> : null}{submitState.message}</p> : null}
      </motion.form>
    </section>
  );
}
