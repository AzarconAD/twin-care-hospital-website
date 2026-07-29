import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";

const COLORS = {
  ink: "#1C1E1F",
  paper: "#FAFAF9",
  white: "#FFFFFF",
  border: "#E7E7E5",
  green: "#10B981",
  blue: "#0544AB",
  red: "#E63946",
};

const CATEGORIES = {
  all: { label: "All Doctors", color: COLORS.ink },
  emergency: { label: "Emergency & Urgent Care", color: COLORS.red },
  wellness: { label: "Wellness & Preventive Care", color: COLORS.green },
  diagnostic: { label: "Diagnostic & Specialty Care", color: COLORS.blue },
};

const defaultDoctors = [
  {
    category: "emergency",
    name: "Dr. Ramon Villareal",
    specialty: "Emergency Medicine",
    bio: "Leads rapid assessment and treatment for urgent, high-risk conditions around the clock.",
  },
  {
    category: "emergency",
    name: "Dr. Carla Mendoza",
    specialty: "Trauma Surgery",
    bio: "Specializes in emergency surgical care for serious injuries and critical trauma cases.",
  },
  {
    category: "wellness",
    name: "Dr. Bea Santos",
    specialty: "Family & Wellness Medicine",
    bio: "Focuses on long-term health, preventive screening, and whole-family primary care.",
  },
  {
    category: "wellness",
    name: "Dr. Miguel Torres",
    specialty: "Pediatrics",
    bio: "Provides checkups, immunizations, and developmental care for infants through teens.",
  },
  {
    category: "diagnostic",
    name: "Dr. Elena Cruz",
    specialty: "Cardiology",
    bio: "Diagnoses and manages heart conditions using on-site imaging and diagnostic testing.",
  },
  {
    category: "diagnostic",
    name: "Dr. Paolo Reyes",
    specialty: "Radiology",
    bio: "Reads and interprets X-ray, ultrasound, and CT imaging to guide accurate diagnoses.",
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

export default function DoctorsPage({ doctors = defaultDoctors }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? doctors
      : doctors.filter((d) => d.category === activeCategory);

  return (
    <div style={{ backgroundColor: COLORS.paper, color: COLORS.ink }} className="w-full min-h-screen">
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
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="tc-mono text-xs uppercase mb-4" style={{ color: COLORS.blue }}>
          Meet Our Team
        </p>
        <h1 className="tc-display text-4xl md:text-5xl leading-tight mb-5">
          Doctors who treat the whole story,
          <br />
          not just the chart.
        </h1>
        <p className="tc-body text-base md:text-lg max-w-2xl mx-auto opacity-70">
          Every doctor below is grouped by the kind of care they specialize in, matching
          how our Services are organized.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-3 pb-12">
        {Object.entries(CATEGORIES).map(([key, cat]) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className="tc-tab tc-body text-sm px-5 py-2 rounded-full border font-medium"
              style={{
                backgroundColor: isActive ? cat.color : "transparent",
                borderColor: cat.color,
                color: isActive ? COLORS.white : cat.color,
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((doctor, i) => {
              const color = CATEGORIES[doctor.category].color;
              return (
                <motion.div
                  key={doctor.name}
                  layout
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  exit="exit"
                  viewport={{ once: false, amount: 0.2 }}
                  variants={cardVariants}
                  className="p-6 rounded-xl border bg-white text-center"
                  style={{ borderColor: COLORS.border }}
                >
                  {/* Placeholder avatar — swap this div for a real <img> once photos exist */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: color }}
                  >
                    <User size={28} color={COLORS.white} strokeWidth={1.75} />
                  </div>
                  <p
                    className="tc-mono text-[10px] uppercase mb-2"
                    style={{ color }}
                  >
                    {CATEGORIES[doctor.category].label}
                  </p>
                  <h3 className="tc-display text-lg mb-1">{doctor.name}</h3>
                  <p className="tc-body text-sm font-medium mb-2 opacity-90">
                    {doctor.specialty}
                  </p>
                  <p className="tc-body text-sm opacity-70 leading-relaxed">
                    {doctor.bio}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <p className="tc-body text-center opacity-60 py-10">
            No doctors in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}
