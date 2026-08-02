import React from "react";
import { HeartHandshake, ShieldCheck, Sparkles, Users, Compass, Award, Heart, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { AboutBackgroundBlobs, AboutHeaderBlobs, AboutMissionBlobs, AboutMissionPanelBlobs } from "./bg-decorations";

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
      <AboutBackgroundBlobs />
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
          className="relative z-10"
        >
          {/* Decorative text blobs */}
          <AboutHeaderBlobs />
          
          <p className="font-mono text-sm tracking-widest uppercase mb-3 font-bold text-secondary">
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

      {/* Mission & Vision section and Photo Collage */}
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8 relative">
        {/* Local decorative blobs for Mission & Vision area */}
        <AboutMissionBlobs />
        
        {/* Mission & Vision Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="font-mono text-sm tracking-widest uppercase mb-3 font-bold text-secondary">
            Our Purpose
          </p>
          <h3 className="font-display text-4xl md:text-5xl text-primary mb-4">
            Mission & Vision
          </h3>
          <p className="font-body text-base md:text-lg max-w-2xl mx-auto opacity-70">
            Dedicated to providing exceptional healthcare, rooted in our community, with a forward-looking approach to wellness.
          </p>
        </motion.div>

        {/* Mission & Vision — twin overlapping panels */}
        <div className="relative z-10">
          {/* Dense blobs perfectly aligned behind the panels */}
          <AboutMissionPanelBlobs />

          <div className="grid md:grid-cols-2 relative shadow-2xl shadow-ink/5 rounded-3xl overflow-hidden z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="p-12 md:p-16 bg-secondary/80 backdrop-blur-2xl text-white relative overflow-hidden group border border-white/20"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform duration-700 group-hover:scale-150" />
              <p className="font-mono text-base tracking-widest uppercase mb-4 opacity-90 font-bold">Mission</p>
              <p className="font-display text-2xl md:text-3xl leading-relaxed relative z-10">{missionText}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="p-12 md:p-16 bg-primary/80 backdrop-blur-2xl text-white relative overflow-hidden group border border-white/20"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -ml-20 -mb-20 transition-transform duration-700 group-hover:scale-150" />
              <p className="font-mono text-base tracking-widest uppercase mb-4 opacity-90 font-bold">Vision</p>
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

        {/* Editorial Scattered Photo Collage */}
        <div className="relative w-full flex flex-row items-center justify-center -space-x-6 sm:-space-x-12 md:-space-x-20 -mt-12 sm:-mt-24 mb-16 z-30 px-4">
          
          {/* Back Left Photo */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: -5 }}
            whileInView={{ opacity: 1, y: 10, rotate: -12 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="z-0 w-16 sm:w-32 md:w-56 aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white flex-shrink-0"
          >
            <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80" alt="Hospital care" className="w-full h-full object-cover" />
          </motion.div>

          {/* Front Left Photo */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            whileInView={{ opacity: 1, y: -10, rotate: -6 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="z-10 w-24 sm:w-48 md:w-64 aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white flex-shrink-0"
          >
            <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80" alt="Care team" className="w-full h-full object-cover" />
          </motion.div>

          {/* Center Main Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0, rotate: 2 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7 }}
            className="z-20 w-32 sm:w-64 md:w-80 aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-4 sm:border-8 border-white group flex-shrink-0"
          >
            <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80" alt="Modern facility" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </motion.div>

          {/* Front Right Photo */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: 0 }}
            whileInView={{ opacity: 1, y: 15, rotate: 8 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="z-10 w-24 sm:w-48 md:w-64 aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white flex-shrink-0"
          >
            <img src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80" alt="Specialist" className="w-full h-full object-cover" />
          </motion.div>

          {/* Back Right Photo */}
          <motion.div
            initial={{ opacity: 0, y: 20, rotate: 5 }}
            whileInView={{ opacity: 1, y: -5, rotate: 15 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="z-0 w-16 sm:w-32 md:w-48 aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white flex-shrink-0"
          >
            <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80" alt="Lab" className="w-full h-full object-cover" />
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
          <p className="font-mono text-sm tracking-widest uppercase mb-3 font-bold text-secondary">
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
