"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const QUESTIONS = [
  {
    q: "Hoe snel is mijn Digitale Werknemer operationeel?",
    a: "Binnen 1 werkdag na aanmelding. Je vult je bedrijfsinfo in, wij configureren de rest. Na de inwerkfase van 3-7 dagen werkt hij volledig zelfstandig.",
  },
  {
    q: "Spreekt hij ook Nederlands?",
    a: "Ja, volledig Nederlands. Ook dialect begrijpt hij goed. Hij past zijn taalgebruik automatisch aan op die van de klant.",
  },
  {
    q: "Kan ik hem zelf bijleren?",
    a: "Ja, op twee manieren: via je dashboard (bedrijfsinfo aanvullen) of door hem direct te corrigeren via WhatsApp: 'Niet zo zeggen, zeg liever...' Hij onthoudt het voor altijd.",
  },
  {
    q: "Wat als hij iets verkeerds zegt?",
    a: "Corrigeer hem direct. Stuur een bericht met de correcte informatie en hij past zijn gedrag onmiddellijk aan. Fouten worden zelden herhaald.",
  },
  {
    q: "Kan ik hem pauzeren?",
    a: "Ja, via je dashboard met één klik. Handig tijdens vakanties of als je tijdelijk zelf wil antwoorden.",
  },
  {
    q: "Wat kost het echt?",
    a: "Alleen het maandelijkse abonnement: €149, €239 of €499 afhankelijk van je plan. Geen setup fee, geen kosten per bericht, geen verborgen kosten. Maandelijks opzegbaar.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4 bg-accent-light px-3 py-1 rounded-full">
            Veelgestelde vragen
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Alles wat je wil weten
          </h2>
        </motion.div>

        <div className="space-y-3">
          {QUESTIONS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50/60 transition-colors"
              >
                <span className="text-text-primary font-medium text-sm pr-4">{item.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-text-secondary" />
                </motion.div>
              </button>

              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-0">
                      <div className="border-t border-border pt-4">
                        <p className="text-text-secondary text-sm leading-relaxed">{item.a}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
