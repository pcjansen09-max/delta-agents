"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-28 px-6" style={{ background: "#1A1A2E" }}>
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="font-display text-4xl md:text-5xl xl:text-[56px] text-white leading-[1.15] mb-6">
            Klaar om nooit meer een klant te missen?
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Start vandaag. In één week actief. Maandelijks opzegbaar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/login"
              className="group inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-xl transition-all text-base"
              style={{ background: "#E8B84B", color: "#1A1A2E" }}
            >
              Start gratis vandaag
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 transition-colors text-base"
            >
              Neem contact op
            </a>
          </div>

          <p className="mt-8 text-gray-500 text-sm">
            Geen creditcard nodig · GDPR-compliant · Nederlands support
          </p>
        </motion.div>
      </div>
    </section>
  );
}
