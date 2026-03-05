import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, User, Send, Github, Clock, AlertTriangle } from "lucide-react";

// Rate limiting configuration (client-side)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

// Load rate limit data from localStorage
const loadRateLimitData = () => {
  try {
    const stored = localStorage.getItem("contact-form-rate-limit");
    if (stored) {
      const data = JSON.parse(stored);
      // Clear expired data
      if (Date.now() - data.windowStart > RATE_LIMIT_WINDOW) {
        return { windowStart: Date.now(), requestCount: 0 };
      }
      return data;
    }
  } catch {
    // Ignore errors
  }
  return { windowStart: Date.now(), requestCount: 0 };
};

// Save rate limit data to localStorage
const saveRateLimitData = (data) => {
  try {
    localStorage.setItem("contact-form-rate-limit", JSON.stringify(data));
  } catch {
    // Ignore errors
  }
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [rateLimitData, setRateLimitData] = useState(loadRateLimitData);
  const [remainingRequests, setRemainingRequests] = useState(MAX_REQUESTS_PER_WINDOW);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const contactInfo = {
    name: "Emmanuel Adejoh",
    email: "orion4live@gmail.com",
    location: "Nigeria",
    github: "https://github.com/boyzliberty360",
  };

  // Update remaining requests and cooldown timer
  const updateRateLimitState = useCallback(() => {
    const data = loadRateLimitData();
    const now = Date.now();
    
    // Check if window has expired
    if (now - data.windowStart > RATE_LIMIT_WINDOW) {
      // Reset for new window
      const newData = { windowStart: now, requestCount: 0 };
      saveRateLimitData(newData);
      setRemainingRequests(MAX_REQUESTS_PER_WINDOW);
      setCooldownSeconds(0);
      setIsRateLimited(false);
    } else {
      // Calculate remaining requests
      const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - data.requestCount);
      setRemainingRequests(remaining);
      
      // Calculate cooldown
      const elapsed = now - data.windowStart;
      const remainingTime = Math.max(0, Math.ceil((RATE_LIMIT_WINDOW - elapsed) / 1000));
      setCooldownSeconds(remainingTime);
      
      // Check if rate limited
      setIsRateLimited(data.requestCount >= MAX_REQUESTS_PER_WINDOW);
    }
  }, []);

  // Update rate limit state every second when in cooldown
  useEffect(() => {
    updateRateLimitState();
    
    if (cooldownSeconds > 0 || isRateLimited) {
      const interval = setInterval(updateRateLimitState, 1000);
      return () => clearInterval(interval);
    }
  }, [cooldownSeconds, isRateLimited, updateRateLimitState]);

  // Check server rate limit and submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side rate limit check
    const data = loadRateLimitData();
    const now = Date.now();
    
    // Reset window if expired
    let currentData = data;
    if (now - data.windowStart > RATE_LIMIT_WINDOW) {
      currentData = { windowStart: now, requestCount: 0 };
    }
    
    // Check if client-side limit exceeded
    if (currentData.requestCount >= MAX_REQUESTS_PER_WINDOW) {
      const retryAfter = Math.ceil((RATE_LIMIT_WINDOW - (now - currentData.windowStart)) / 1000);
      setSubmitStatus({
        type: "error",
        message: `Too many requests. Please wait ${retryAfter} seconds before sending another message.`,
      });
      return;
    }

    setSubmitStatus({ type: "", message: "" });

    const form = e.currentTarget;
    const formData = new FormData(form);
    
    // Add Web3Forms access key
    formData.append("access_key", "31278e51-41e8-49d7-af26-c5597769e8a0");
    formData.append("subject", formData.get("subject") || "New Contact Form Submission");
    formData.append("from_name", formData.get("name"));
    formData.append("email_from", formData.get("email"));
    formData.append("to_name", "Emmanuel");
    formData.append("reply_to", formData.get("email"));

    try {
      setIsSubmitting(true);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      // Handle server-side rate limiting (429 response)
      if (response.status === 429 || result.code === "RATE_LIMIT_EXCEEDED") {
        // Update local rate limit data to reflect server rejection
        const newData = { windowStart: now, requestCount: MAX_REQUESTS_PER_WINDOW };
        saveRateLimitData(newData);
        setRateLimitData(newData);
        updateRateLimitState();
        
        setSubmitStatus({
          type: "error",
          message: "Too many requests from your IP. Please wait a moment before trying again.",
        });
        return;
      }

      if (result.success) {
        // Increment client-side request count
        const updatedData = {
          windowStart: currentData.windowStart,
          requestCount: currentData.requestCount + 1,
        };
        saveRateLimitData(updatedData);
        setRateLimitData(updatedData);
        updateRateLimitState();
        
        setSubmitStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        form.reset();
      } else {
        throw new Error(result.message || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Could not send message right now. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine button state
  const isDisabled = isSubmitting || isRateLimited || remainingRequests === 0;
  const buttonText = isSubmitting 
    ? "Sending..." 
    : isRateLimited 
      ? `Wait ${cooldownSeconds}s` 
      : "Send Message";

  return (
    <section id="contact" className="px-6 md:px-16 py-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="ai-heading text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-4">
            Contact Us Now
          </h2>
          <p className="text-lg md:text-2xl dark:text-gray-300 text-slate-600 max-w-2xl mx-auto">
            Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.form
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            onSubmit={handleSubmit}
            className="glass dark:bg-black/30 bg-white/10 p-6 md:p-8 rounded-2xl space-y-5"
          >
            <h3 className="text-3xl font-bold dark:text-white text-slate-900">Send me a message</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block mb-2 dark:text-gray-200 text-slate-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  disabled={isDisabled}
                  className="w-full p-3 rounded-lg bg-white/15 dark:bg-black/20 border border-purple-300/50 dark:border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:text-white text-slate-900 disabled:opacity-50"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 dark:text-gray-200 text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isDisabled}
                  className="w-full p-3 rounded-lg bg-white/15 dark:bg-black/20 border border-purple-300/50 dark:border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:text-white text-slate-900 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block mb-2 dark:text-gray-200 text-slate-700">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                disabled={isDisabled}
                className="w-full p-3 rounded-lg bg-white/15 dark:bg-black/20 border border-purple-300/50 dark:border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:text-white text-slate-900 disabled:opacity-50"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 dark:text-gray-200 text-slate-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                disabled={isDisabled}
                className="w-full p-3 rounded-lg bg-white/15 dark:bg-black/20 border border-purple-300/50 dark:border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:text-white text-slate-900 disabled:opacity-50"
              />
            </div>

            {/* Rate Limit Indicator */}
            <div className="flex items-center justify-between text-sm">
              <div className={`flex items-center gap-2 ${
                remainingRequests <= 1 
                  ? "text-orange-500 dark:text-orange-400" 
                  : remainingRequests <= 2 
                    ? "text-yellow-500 dark:text-yellow-400"
                    : "text-emerald-500 dark:text-emerald-400"
              }`}>
                {isRateLimited ? (
                  <>
                    <Clock size={16} />
                    <span>Cooldown: {cooldownSeconds}s</span>
                  </>
                ) : (
                  <>
                    <span>{remainingRequests}/{MAX_REQUESTS_PER_WINDOW} requests remaining</span>
                  </>
                )}
              </div>
              
              {remainingRequests <= 2 && !isRateLimited && (
                <div className="flex items-center gap-1 text-orange-500 dark:text-orange-400 text-xs">
                  <AlertTriangle size={12} />
                  <span>Limited</span>
                </div>
              )}
            </div>

            <motion.button
              whileHover={!isDisabled ? { scale: 1.01 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              type="submit"
              disabled={isDisabled}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold transition ${
                isRateLimited
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              } disabled:opacity-50`}
            >
              <Send size={16} />
              {buttonText}
            </motion.button>

            {submitStatus.message && (
              <p
                className={`text-sm ${
                  submitStatus.type === "success"
                    ? "text-emerald-500 dark:text-emerald-300"
                    : "text-red-500 dark:text-red-300"
                }`}
              >
                {submitStatus.message}
              </p>
            )}
          </motion.form>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="glass dark:bg-black/30 bg-white/10 p-6 md:p-8 rounded-2xl space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-semibold dark:text-white text-slate-900">Name</p>
                  <p className="dark:text-gray-300 text-slate-600">{contactInfo.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="font-semibold dark:text-white text-slate-900">Email</p>
                  <p className="dark:text-gray-300 text-slate-600">{contactInfo.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 text-white">
                  <Github size={20} />
                </div>
                <div>
                  <p className="font-semibold dark:text-white text-slate-900">GitHub</p>
                  <a 
                    href={contactInfo.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="dark:text-gray-300 text-slate-600 hover:text-cyan-400 transition-colors"
                  >
                    boyzliberty360
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-semibold dark:text-white text-slate-900">Location</p>
                  <p className="dark:text-gray-300 text-slate-600">{contactInfo.location}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-6 md:p-8 rounded-2xl text-white bg-gradient-to-r from-purple-500 to-blue-500"
            >
              <h4 className="text-2xl font-bold mb-3">Let's work together!</h4>
              <p className="text-white/90 leading-relaxed mb-5">
                I'm always interested in new opportunities and exciting projects. Whether you have a
                question or just want to say hi, I'll try my best to get back to you!
              </p>
              <p className="font-semibold text-white/85">Response time: Usually within 12 hours</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
