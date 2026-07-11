import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { experiences } from "../data/profile";

export default function Experience() {
  return (
    <section id="experience" className="px-6 md:px-16 py-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold dark:text-white text-slate-900 mb-4">
            Experience
          </h2>
          <p className="text-lg md:text-xl dark:text-gray-300 text-slate-600 max-w-2xl mx-auto">
            My professional journey in tech
          </p>
        </motion.div>

        <div className="space-y-6">
          {experiences.map((exp, index) => (
            <div key={index} className="relative">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass dark:bg-black/30 bg-white/10 p-6 md:p-8 rounded-2xl hover:scale-[1.02] transition-transform duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-lg bg-blue-600 p-2 text-white dark:bg-cyan-500 dark:text-black">
                        <Briefcase size={20} />
                      </div>
                      <h3 className="text-xl font-bold dark:text-white text-slate-900">
                        {exp.role}
                      </h3>
                    </div>
                    <p className="text-cyan-400 font-semibold text-lg mb-2">{exp.company}</p>
                    <p className="dark:text-gray-300 text-slate-600 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm dark:text-gray-400 text-slate-500">
                    <Calendar size={16} />
                    <span>{exp.period}</span>
                  </div>
                </div>
              </motion.div>

              {index < experiences.length - 1 ? (
                <div className="flex justify-center py-3" aria-hidden="true">
                  <div className="h-12 w-1 rounded-full bg-blue-600 dark:bg-cyan-300" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
