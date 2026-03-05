import React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, User, Send, Github } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });

  const contactInfo = {
    name: "Emmanuel Adejoh",
    email: "orion4live@gmail.com",
    location: "Nigeria",
    github: "https://github.com/boyzliberty360",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      if (result.success) {
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
                  className="w-full p-3 rounded-lg bg-white/15 dark:bg-black/20 border border-purple-300/50 dark:border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:text-white text-slate-900"
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
                  className="w-full p-3 rounded-lg bg-white/15 dark:bg-black/20 border border-purple-300/50 dark:border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:text-white text-slate-900"
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
                className="w-full p-3 rounded-lg bg-white/15 dark:bg-black/20 border border-purple-300/50 dark:border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:text-white text-slate-900"
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
                className="w-full p-3 rounded-lg bg-white/15 dark:bg-black/20 border border-purple-300/50 dark:border-purple-400/30 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:text-white text-slate-900"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition disabled:opacity-50"
            >
              <Send size={16} />
              {isSubmitting ? "Sending..." : "Send Message"}
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
