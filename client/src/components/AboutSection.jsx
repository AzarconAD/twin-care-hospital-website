import React from "react";
import { HeartHandshake, ShieldCheck, Sparkles, Users, Compass, Award, Heart, Activity } from "lucide-react";
import { motion } from "framer-motion";

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

export default function AboutSection({
  values = defaultValues,
  missionText = "To deliver attentive, high-quality care to every person who walks through our doors, regardless of where they started from or what they can afford.",
  visionText = "A community where excellent care is never a matter of luck, geography, or connections \u2014 just a short walk from home.",
}) {
  return (
    <section
      id="about"
      className="relative w-full scroll-mt-24 text-ink pb-24"
    >
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-1/4 -left-20 w-[24rem] h-[24rem] rounded-full bg-secondary/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-40 left-[-10rem] w-[28rem] h-[28rem] rounded-full bg-accent/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 right-[-5rem] w-96 h-96 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute top-2/3 right-1/4 w-[20rem] h-[20rem] rounded-full bg-secondary/20 blur-3xl"
          aria-hidden="true"
        />
      </div>
      {/* Header with hospital photo */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border-8 border-white group"
        >
          <img 
            src="/hospital-bg.jpg"
            alt="Twin Care Hospital building"
            className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p className="font-mono text-xs uppercase tracking-wider mb-4 font-bold text-accent">
            About Twin Care Hospital
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 text-primary">
            Two beginnings.<br />One standard of care.
          </h2>
          <p className="font-body text-base md:text-lg opacity-80 leading-relaxed text-ink/90">
            Twin Care Hospital Incorporated grew out of two community clinics that shared a single
            conviction: care should be close, honest, and unhurried. That conviction still shapes
            everything we do today.
          </p>
        </motion.div>
      </div>

      {/* Mission & Vision — twin overlapping panels */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 relative shadow-2xl shadow-ink/5 rounded-3xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="p-12 md:p-16 bg-secondary text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150" />
            <p className="font-mono text-sm tracking-widest uppercase mb-4 opacity-90 font-bold">Mission</p>
            <p className="font-display text-2xl md:text-3xl leading-relaxed relative z-10">{missionText}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="p-12 md:p-16 bg-primary text-white relative overflow-hidden group"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -ml-20 -mb-20 transition-transform duration-700 group-hover:scale-150" />
            <p className="font-mono text-sm tracking-widest uppercase mb-4 opacity-90 font-bold">Vision</p>
            <p className="font-display text-2xl md:text-3xl leading-relaxed relative z-10">{visionText}</p>
          </motion.div>

          {/* Seam mark symbolizing the two founding clinics joining */}
          <motion.div
            initial={{ scale: 0, opacity: 0, x: "-50%", y: "-50%", rotate: -15 }}
            whileInView={{ scale: 1, opacity: 1, x: "-50%", y: "-50%", rotate: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.5 }}
            className="hidden md:flex absolute left-1/2 top-1/2 items-center justify-center z-20"
            aria-hidden="true"
          >
            <Heart size={80} className="text-accent fill-accent drop-shadow-2xl" />
          </motion.div>
        </div>
      </div>

      {/* Core Values - TWIN CARE Acronym */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs tracking-widest uppercase mb-3 font-bold text-secondary">
            Our Guiding Principles
          </p>
          <h3 className="font-display text-4xl md:text-5xl text-primary mb-4">
            The TWIN CARE Promise
          </h3>
          <p className="font-body text-base md:text-lg max-w-2xl mx-auto opacity-70">
            Our core values form the very name of our hospital. They are the standard by which we measure every interaction, every decision, and every life we touch.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            const firstLetter = v.title.charAt(0);
            const restOfTitle = v.title.slice(1);
            const isTwin = i < 4; // T, W, I, N
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i}
                className="group relative p-8 rounded-2xl bg-white border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Subtle background letter watermark */}
                <div className="absolute -right-4 -top-8 font-display text-[12rem] font-bold text-cream select-none pointer-events-none opacity-70 group-hover:text-primary/10 group-hover:opacity-100 transition-all duration-500">
                  {firstLetter}
                </div>

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 ${isTwin ? 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  
                  <h4 className="font-display text-2xl mb-3 text-ink flex items-baseline">
                    <span className={`text-3xl font-bold mr-[1px] ${isTwin ? 'text-secondary' : 'text-primary'}`}>
                      {firstLetter}
                    </span>
                    {restOfTitle}
                  </h4>
                  
                  <p className="font-body text-sm opacity-75 leading-relaxed">
                    {v.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
