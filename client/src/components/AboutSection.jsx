import React from "react";
import { HeartHandshake, ShieldCheck, Sparkles, Users, Compass, Award, Heart, Activity } from "lucide-react";
import { motion } from "framer-motion";

const COLORS = {
  ink: "#1C1E1F",
  paper: "#FAFAF9",
  white: "#FFFFFF",
  border: "#E7E7E5",
  green: "#10B981",
  blue: "#0544AB",
  red: "#E63946",
};

const defaultTimeline = [
  {
    year: "1998",
    title: "Two clinics, one purpose",
    text: "On opposite ends of the city, two small community clinics open in the same month, each founded on the belief that care shouldn't wait for a referral.",
  },
  {
    year: "2004",
    title: "The clinics become one",
    text: "The two founding clinics merge into a single hospital. The new name keeps the story alive: Twin Care, because good care was never meant to come from just one place.",
  },
  {
    year: "2011",
    title: "A dedicated maternity and pediatric wing",
    text: "Twin Care opens a new wing built specifically for mothers and children, doubling capacity for the community's fastest-growing need.",
  },
  {
    year: "2017",
    title: "Full hospital accreditation",
    text: "Twin Care Hospital earns full accreditation, formalizing standards that had guided the hospital since its earliest days.",
  },
  {
    year: "Today",
    title: "Still two, still one",
    text: "Twin Care now serves the wider community with a growing team of specialists, but still runs on the same idea that opened its doors: two hands, working as one.",
  },
];

const defaultValues = [
  {
    icon: ShieldCheck,
    title: "Trust",
    text: "Building lasting confidence through honest, transparent care.",
  },
  {
    icon: Activity,
    title: "Wellness",
    text: "Focusing on complete health, not just the absence of illness.",
  },
  {
    icon: Award,
    title: "Integrity",
    text: "Doing the right thing, even when no one is watching.",
  },
  {
    icon: HeartHandshake,
    title: "Nurture",
    text: "Providing a supportive and healing environment for all.",
  },
  {
    icon: Heart,
    title: "Compassion",
    text: "Every patient is met as a person first, a case second.",
  },
  {
    icon: Compass,
    title: "Accessibility",
    text: "Quality care shouldn't depend on how far you can travel.",
  },
  {
    icon: Users,
    title: "Respect",
    text: "Honoring the dignity and rights of every individual we serve.",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    text: "We hold our care to a standard, not a minimum.",
  },
];

function TwinArcDivider({ flip = false }) {
  return (
    <div className="w-full flex justify-center py-2" aria-hidden="true">
      <svg
        width="120"
        height="36"
        viewBox="0 0 120 36"
        style={{ transform: flip ? "scaleX(-1)" : undefined }}
      >
        <circle cx="42" cy="18" r="16" fill="none" stroke={COLORS.green} strokeWidth="2" opacity="0.55" />
        <circle cx="78" cy="18" r="16" fill="none" stroke={COLORS.red} strokeWidth="2" opacity="0.75" />
      </svg>
    </div>
  );
}

export default function AboutSection({
  timeline = defaultTimeline,
  values = defaultValues,
  missionText = "To deliver attentive, high-quality care to every person who walks through our doors, regardless of where they started from or what they can afford.",
  visionText = "A community where excellent care is never a matter of luck, geography, or connections \u2014 just a short walk from home.",
}) {
  return (
    <section
      id="about"
      style={{ color: COLORS.ink }}
      className="relative z-10 w-full scroll-mt-24"
    >

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .tc-display { font-family: 'Fraunces', serif; }
        .tc-body { font-family: 'Inter', sans-serif; }
        .tc-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; }
      `}</style>

      {/* Header with hospital photo */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10 grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden shadow-lg border-4"
          style={{ borderColor: COLORS.white }}
        >
          <img 
            src="/hospital-bg.jpg"
            alt="Twin Care Hospital building"
            className="w-full h-auto block"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <p className="tc-mono text-xs uppercase mb-4 font-semibold" style={{ color: COLORS.red }}>
            About Twin Care Hospital
          </p>
          <h2 className="tc-display text-4xl md:text-5xl leading-tight mb-5" style={{ color: COLORS.blue }}>
            Two beginnings.<br />One standard of care.
          </h2>
          <p className="tc-body text-base md:text-lg opacity-80">
            Twin Care Hospital Incorporated grew out of two community clinics that shared a single
            conviction: care should be close, honest, and unhurried. That conviction still shapes
            everything we do.
          </p>
        </motion.div>
      </div>

      <TwinArcDivider />

      {/* History timeline */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto px-6 sm:px-10 py-14 my-10 rounded-2xl shadow-sm border bg-white/95 backdrop-blur-md"
        style={{ borderColor: COLORS.border }}
      >
        <h3 className="tc-display text-2xl mb-10 text-center" style={{ color: COLORS.blue }}>
          Our History
        </h3>
        <div className="relative pl-8">
          <div
            className="absolute left-[7px] top-1 bottom-1 w-[2px]"
            style={{ backgroundColor: COLORS.border }}
            aria-hidden="true"
          />
          {timeline.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.8 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              key={i} 
              className="relative pb-10 last:pb-0"
            >
              <div
                className="absolute -left-8 top-1 w-4 h-4 rounded-full border-2 bg-white"
                style={{ borderColor: COLORS.green }}
                aria-hidden="true"
              />
              <p className="tc-mono text-xs mb-1" style={{ color: COLORS.green }}>
                {item.year}
              </p>
              <h4 className="tc-display text-lg mb-1" style={{ color: COLORS.ink }}>
                {item.title}
              </h4>
              <p className="tc-body text-sm opacity-75 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <TwinArcDivider flip />

      {/* Another placeholder photo above Mission/Vision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto px-6 pt-10"
      >
        <div 
          className="w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-md border-4 relative"
          style={{ borderColor: COLORS.white }}
        >
          <img 
            src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=1000&auto=format&fit=crop" 
            alt="[Placeholder: Modern hospital staff]" 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-[#FAFAF9]/90 px-2 py-1 rounded text-[10px] tc-mono">
            Placeholder Photo 2
          </div>
        </div>
      </motion.div>

      {/* Mission & Vision — twin overlapping panels (Animated on scroll) */}
      <div className="max-w-5xl mx-auto px-6 py-14 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 md:gap-0 relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-8 md:p-10 md:rounded-l-2xl rounded-t-2xl md:rounded-t-none"
            style={{ backgroundColor: COLORS.green, color: "#FFFFFF" }}
          >
            <p className="tc-mono text-xs uppercase mb-3 opacity-80">Mission</p>
            <p className="tc-display text-xl md:text-2xl leading-snug">{missionText}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="p-8 md:p-10 md:rounded-r-2xl rounded-b-2xl md:rounded-b-none"
            style={{ backgroundColor: COLORS.blue, color: "#FFFFFF" }}
          >
            <p className="tc-mono text-xs uppercase mb-3 opacity-80">Vision</p>
            <p className="tc-display text-xl md:text-2xl leading-snug">{visionText}</p>
          </motion.div>
          {/* Seam mark symbolizing the two founding clinics joining */}
          <motion.div
            initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%" }}
            whileInView={{ scale: 1, opacity: 1, x: "-50%", y: "-50%" }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden md:flex absolute left-1/2 top-1/2 items-center justify-center"
            aria-hidden="true"
          >
            <Heart size={48} color={COLORS.red} fill={COLORS.red} />
          </motion.div>
        </div>
      </div>

      {/* Core Values (Animated on scroll) */}
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-20">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="tc-display text-2xl mb-10 text-center" 
          style={{ color: COLORS.blue }}
        >
          Core Values
        </motion.h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                key={i}
                className="p-6 rounded-xl border shadow-sm"
                style={{ backgroundColor: COLORS.white, borderColor: COLORS.border }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: COLORS.paper, border: `1px solid ${COLORS.border}` }}
                >
                  <Icon size={20} color={COLORS.green} strokeWidth={1.75} />
                </div>
                <h4 className="tc-display text-base mb-1.5" style={{ color: COLORS.ink }}>
                  {v.title}
                </h4>
                <p className="tc-body text-sm opacity-70 leading-relaxed">{v.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
