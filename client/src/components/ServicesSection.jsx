import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Siren,
  Activity,
  HeartPulse,
  Leaf,
  Syringe,
  Stethoscope,
  FlaskConical,
  ScanLine,
  Users,
} from "lucide-react";

// Kept synced with Tailwind and using translucent background to blend with the page
const COLORS = {
  ink: "#1A2E2E", 
  paper: "transparent",
  white: "rgba(255, 255, 255, 0.95)",
  border: "rgba(255, 255, 255, 0.7)", 
  green: "#10B981",
  blue: "#0544AB",
  red: "#E63946",
};

const CATEGORIES = {
  all: { label: "All Services", color: COLORS.ink },
  emergency: { label: "Emergency & Urgent Care", color: COLORS.red },
  wellness: { label: "Wellness & Preventive Care", color: COLORS.green },
  diagnostic: { label: "Diagnostic & Specialty Care", color: COLORS.blue },
};

const defaultServices = [
  {
    category: "emergency",
    icon: Siren,
    title: "Emergency Room",
    text: "24/7 emergency care for critical and life-threatening conditions.",
  },
  {
    category: "emergency",
    icon: Activity,
    title: "Trauma & Critical Care",
    text: "A rapid-response team ready for high-acuity trauma cases at any hour.",
  },
  {
    category: "emergency",
    icon: HeartPulse,
    title: "Ambulance & Transport",
    text: "Round-the-clock ambulance dispatch for urgent patient transport.",
  },
  {
    category: "wellness",
    icon: Leaf,
    title: "Wellness & Nutrition",
    text: "Personalized nutrition and lifestyle counseling for long-term health.",
  },
  {
    category: "wellness",
    icon: Syringe,
    title: "Vaccination & Immunization",
    text: "Full immunization schedules and boosters for every age group.",
  },
  {
    category: "wellness",
    icon: Stethoscope,
    title: "Annual Checkups",
    text: "Comprehensive physical exams designed to catch issues early.",
  },
  {
    category: "diagnostic",
    icon: FlaskConical,
    title: "Laboratory Services",
    text: "Fast, accurate lab testing across a full range of diagnostics.",
  },
  {
    category: "diagnostic",
    icon: ScanLine,
    title: "Imaging & Radiology",
    text: "On-site X-ray, ultrasound, and CT imaging with quick turnaround.",
  },
  {
    category: "diagnostic",
    icon: Users,
    title: "Specialist Clinics",
    text: "Cardiology, pediatrics, OB-GYN, and other specialist consultations.",
  },
];

// Each card fades up on scroll; the "custom" index (i) staggers the delay
// so cards animate in one after another instead of all at once.
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
      style={{ color: COLORS.ink }}
      // Kept relative z-10 so the global cream overlay doesn't blur the text
      className="relative z-10 w-full scroll-mt-24 py-10"
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
        <h2 className="tc-display text-4xl md:text-5xl leading-tight mb-5 text-primary">
          Care organized around
          <br />
          how urgently you need it.
        </h2>
        <p className="tc-body text-base md:text-lg max-w-2xl mx-auto text-ink/90">
          Every service below is grouped by the kind of care it provides &mdash; so
          you always know where to start.
        </p>
      </motion.div>

      {/* Category filter tabs */}
      <motion.div
        className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-3 pb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className="tc-tab tc-body text-sm px-5 py-2 rounded-full border font-medium shadow-sm hover:scale-105 transform duration-200"
              style={{
                backgroundColor: isActive ? cat.color : COLORS.white,
                borderColor: cat.color,
                color: isActive ? "#FFFFFF" : cat.color,
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </motion.div>

      {/* Service cards */}
      <div className="max-w-5xl mx-auto px-6 pb-20 min-h-[400px]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* AnimatePresence lets cards animate OUT (not just disappear)
              when the filter changes and they no longer match. */}
          <AnimatePresence mode="popLayout">
            {filtered.map((service, i) => {
              const Icon = service.icon;
              const color = CATEGORIES[service.category].color;
              return (
                <motion.div
                  key={service.title}
                  layout
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                  className="p-6 rounded-xl border backdrop-blur-md shadow-sm"
                  style={{ backgroundColor: COLORS.white, borderColor: COLORS.border, borderLeft: `4px solid ${color}` }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${color}1A` }}
                  >
                    <Icon size={20} color={color} strokeWidth={1.75} />
                  </div>
                  <p
                    className="tc-mono text-[10px] uppercase mb-2"
                    style={{ color }}
                  >
                    {CATEGORIES[service.category].label}
                  </p>
                  <h4 className="tc-display text-lg mb-1.5 font-semibold text-primary">{service.title}</h4>
                  <p className="tc-body text-sm text-ink/80 leading-relaxed">
                    {service.text}
                  </p>
                </motion.div>
              );
            })}
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
