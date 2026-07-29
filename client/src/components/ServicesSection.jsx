import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
  ink: "#1C1E1F",
  paper: "#FAFAF9",
  white: "#FFFFFF",
  border: "#E7E7E5",
  blue: "#0544AB",
};

// "category" is kept only so the filter tabs still work — it is no longer
// used to color the cards. "photo" is a placeholder; replace with a real
// path (e.g. "/services/emergency-room.jpg" in client/public) once you have one.
const CATEGORIES = {
  all: "All Services",
  emergency: "Emergency & Urgent Care",
  wellness: "Wellness & Preventive Care",
  diagnostic: "Diagnostic & Specialty Care",
};

const defaultServices = [
  {
    category: "emergency",
    title: "Emergency Room",
    text: "24/7 emergency care for critical and life-threatening conditions.",
    photo: "https://picsum.photos/seed/svc-er/500/375",
  },
  {
    category: "emergency",
    title: "Trauma & Critical Care",
    text: "A rapid-response team ready for high-acuity trauma cases at any hour.",
    photo: "https://picsum.photos/seed/svc-trauma/500/375",
  },
  {
    category: "emergency",
    title: "Ambulance & Transport",
    text: "Round-the-clock ambulance dispatch for urgent patient transport.",
    photo: "https://picsum.photos/seed/svc-ambulance/500/375",
  },
  {
    category: "wellness",
    title: "Wellness & Nutrition",
    text: "Personalized nutrition and lifestyle counseling for long-term health.",
    photo: "https://picsum.photos/seed/svc-wellness/500/375",
  },
  {
    category: "wellness",
    title: "Vaccination & Immunization",
    text: "Full immunization schedules and boosters for every age group.",
    photo: "https://picsum.photos/seed/svc-vaccine/500/375",
  },
  {
    category: "wellness",
    title: "Annual Checkups",
    text: "Comprehensive physical exams designed to catch issues early.",
    photo: "https://picsum.photos/seed/svc-checkup/500/375",
  },
  {
    category: "diagnostic",
    title: "Laboratory Services",
    text: "Fast, accurate lab testing across a full range of diagnostics.",
    photo: "https://picsum.photos/seed/svc-lab/500/375",
  },
  {
    category: "diagnostic",
    title: "Imaging & Radiology",
    text: "On-site X-ray, ultrasound, and CT imaging with quick turnaround.",
    photo: "https://picsum.photos/seed/svc-imaging/500/375",
  },
  {
    category: "diagnostic",
    title: "Specialist Clinics",
    text: "Cardiology, pediatrics, OB-GYN, and other specialist consultations.",
    photo: "https://picsum.photos/seed/svc-specialist/500/375",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05 },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

export default function ServicesSection({ services = defaultServices }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  return (
    <section
      id="services"
      style={{ backgroundColor: COLORS.paper, color: COLORS.ink }}
      className="w-full"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .tc-display { font-family: 'Fraunces', serif; }
        .tc-body { font-family: 'Inter', sans-serif; }
        .tc-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; }
        .tc-tab { transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
      `}</style>

      <motion.div
        className="max-w-5xl mx-auto px-6 pt-20 pb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <p className="tc-mono text-xs uppercase mb-4" style={{ color: COLORS.blue }}>
          What We Offer
        </p>
        <h2 className="tc-display text-4xl md:text-5xl leading-tight mb-5">
          Care organized around
          <br />
          how urgently you need it.
        </h2>
        <p className="tc-body text-base md:text-lg max-w-2xl mx-auto opacity-70">
          Every service below is grouped by the kind of care it provides &mdash; so
          you always know where to start.
        </p>
      </motion.div>

      {/* Category filter tabs — kept for filtering, no longer color-coded per category */}
      <motion.div
        className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-3 pb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {Object.entries(CATEGORIES).map(([key, label]) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className="tc-tab tc-body text-sm px-5 py-2 rounded-full border font-medium"
              style={{
                backgroundColor: isActive ? COLORS.blue : "transparent",
                borderColor: COLORS.blue,
                color: isActive ? COLORS.white : COLORS.blue,
              }}
            >
              {label}
            </button>
          );
        })}
      </motion.div>

      {/* Service cards — photo on top, description below, side by side in a grid */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((service, i) => (
              <motion.div
                key={service.title}
                layout
                custom={i}
                initial="hidden"
                whileInView="visible"
                exit="exit"
                viewport={{ once: true, amount: 0.2 }}
                variants={cardVariants}
                className="rounded-xl overflow-hidden border bg-white"
                style={{ borderColor: COLORS.border }}
              >
                {/* Photo — placeholder until real service photos exist */}
                <div className="w-full aspect-[4/3]">
                  <img
                    src={service.photo}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="tc-display text-lg mb-2" style={{ color: COLORS.ink }}>
                    {service.title}
                  </h3>
                  <p className="tc-body text-sm opacity-70 leading-relaxed">
                    {service.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="tc-body text-center opacity-60 py-10">
            No services in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}
