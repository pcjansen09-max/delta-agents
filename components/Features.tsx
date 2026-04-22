"use client";

import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "💬",
    title: "WhatsApp 24/7",
    description: "Beantwoordt klantberichten direct, ook midden in de nacht en in het weekend.",
  },
  {
    icon: "📅",
    title: "Afspraken inplannen",
    description: "Koppel je agenda en laat de werknemer automatisch afspraken inboeken.",
  },
  {
    icon: "📋",
    title: "Offertes & facturen",
    description: "Genereert professionele offertes op basis van jouw tarieven en verstuurt ze direct.",
  },
  {
    icon: "🧠",
    title: "Zelflerend geheugen",
    description: "Onthoudt klantvoorkeurenpn en eerdere gesprekken voor persoonlijk contact.",
  },
  {
    icon: "🔗",
    title: "Koppelingen",
    description: "Werkt samen met WhatsApp, Google Calendar, boekhoudpakketten en meer.",
  },
  {
    icon: "📊",
    title: "Dashboard & inzichten",
    description: "Bekijk alle activiteiten, gesprekken en prestaties in één overzicht.",
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-accent text-sm font-semibold uppercase tracking-widest mb-4 bg-accent-light px-3 py-1 rounded-full">
            Wat hij doet
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-text-primary mb-4">
            Alles wat een goede werknemer doet
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Alleen dan 24/7, zonder ziekmelding en voor een vast maandbedrag.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="card-hover p-6"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-text-primary text-base mb-2">{f.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
