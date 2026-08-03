import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Quote, ArrowUpRight } from "lucide-react";
import { getPublishedTestimonials } from "../lib/adminTestimonials";

const initials = (name) => name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

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
      <blockquote>“{testimonial.quote}”</blockquote>
      <figcaption>
        {testimonial.avatarUrl ? (
          <img src={testimonial.avatarUrl} alt="" width="40" height="40" loading="lazy" />
        ) : (
          <span className="testimonial-avatar" aria-hidden="true">{initials(testimonial.name)}</span>
        )}
        <span className="testimonial-author"><strong>{testimonial.name}</strong><small>{testimonial.role} · {testimonial.company}</small></span>
        {testimonial.sourceUrl ? <a href={testimonial.sourceUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${testimonial.name}'s testimonial source`}><ArrowUpRight className="h-4 w-4" /></a> : null}
      </figcaption>
    </motion.figure>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    let active = true;
    const load = () => getPublishedTestimonials().then((data) => { if (active) setTestimonials(data); });
    load();
    window.addEventListener("testimonials-updated", load);
    return () => { active = false; window.removeEventListener("testimonials-updated", load); };
  }, []);

  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="content-section section-shell scroll-mt-24">
      <div className="section-intro section-intro-row">
        <div><p className="eyebrow">References</p><h2 className="section-title">What it is like to work with me.</h2></div>
        <p className="section-description">From people who have actually worked with me. Every quote is from a real colleague, and nothing appears here without being checked first.</p>
      </div>
      <div className="testimonial-grid">
        {testimonials.map((testimonial, index) => <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />)}
      </div>
    </section>
  );
}
