import React from "react";
import { HeartHandshake, ShieldCheck, Sparkles, Users, Compass, Award, Heart, Activity, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AboutBackgroundBlobs, AboutHeaderBlobs, AboutMissionBlobs, AboutMissionPanelBlobs } from "./bg-decorations";

const defaultValues = [
  {
    icon: ShieldCheck,
    title: "Trust",
    text: "Building lasting confidence through honest, transparent care.",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Activity,
    title: "Wellness",
    text: "Focusing on complete health, not just the absence of illness.",
    img: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Award,
    title: "Integrity",
    text: "Doing the right thing, even when no one is watching.",
    img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: HeartHandshake,
    title: "Nurture",
    text: "Providing a supportive and healing environment for all.",
    img: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Heart,
    title: "Compassion",
    text: "Every patient is met as a person first, a case second.",
    img: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Compass,
    title: "Accessibility",
    text: "Quality care shouldn't depend on how far you can travel.",
    img: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Users,
    title: "Respect",
    text: "Honoring the dignity and rights of every individual we serve.",
    img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80",
  },
  {
    icon: Sparkles,
    title: "Excellence",
    text: "We hold our care to a standard, not a minimum.",
    img: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80",
  },
];

export default function AboutSection({
  values = defaultValues,
  missionText = "To deliver attentive, high-quality care to every person who walks through our doors, regardless of where they started from or what they can afford.",
  visionText = "A community where excellent care is never a matter of luck, geography, or connections \u2014 just a short walk from home.",
  onImageClick,
}) {
  return (
    <section
      id="about"
      className="relative w-full scroll-mt-24 text-ink pb-24"
    >
      {/* Decorative background blobs */}
      <AboutBackgroundBlobs />
      {/* Header with hospital photo */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-6 pb-14 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="relative main-container-wrapper"
        >
          <div className="main-container relative z-10 p-0">
            <div 
              className="relative rounded-[inherit] overflow-hidden shadow-2xl shadow-primary/10 group cursor-pointer"
              onClick={() => onImageClick?.("/hospital-bg.jpg")}
            >
              <img 
                src="/hospital-bg.jpg"
                alt="Twin Care Hospital building"
                className="w-full h-auto block transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent pointer-events-none" />
            </div>
          </div>
          
          {/* Floating Visit Us Box */}
          <Link
            to="/contact"
            state={{ location: true }}
            className="absolute -bottom-6 left-6 sm:left-10 bg-white border border-border rounded-xl shadow-xl p-4 flex items-center gap-4 max-w-[85%] hover:scale-105 transition-transform duration-200 z-20 group"
          >
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors">
              <MapPin size={20} className="text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-wide font-semibold text-secondary mb-0.5 group-hover:text-accent transition-colors">
                Visit Us
              </p>
              <p className="text-sm font-medium font-body leading-snug text-ink">
                Find our location & directions
              </p>
            </div>
          </Link>
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
          <p className="font-body text-base md:text-lg leading-relaxed text-primary/70">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi 
            ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
            in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
            Excepteur sint occaecat cupidatat non proident, 
            sunt in culpa qui officia deserunt mollit anim id est laborum.
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
          <p className="font-body text-base md:text-lg max-w-2xl mx-auto text-primary/70">
            Dedicated to providing exceptional healthcare, rooted in our community, with a forward-looking approach to wellness.
          </p>
        </motion.div>

        {/* Mission & Vision — twin overlapping panels */}
        <div className="relative z-10">
          {/* Dense blobs perfectly aligned behind the panels */}
          <AboutMissionPanelBlobs />

          <div className="grid md:grid-cols-2 relative shadow-2xl shadow-ink/5 rounded-3xl overflow-hidden z-10">
            {/* Mission Panel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="p-12 md:p-16 text-white relative overflow-hidden group border-r border-white/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" 
                alt="Medical professionals" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
              <div className="absolute inset-0 bg-primary/40" />
              <div className="relative z-10">
                <h4 className="font-display text-4xl md:text-5xl font-bold mb-6">Our Mission</h4>
                <p className="font-body text-xl leading-relaxed opacity-90">{missionText}</p>
              </div>
            </motion.div>

            {/* Vision Panel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="p-12 md:p-16 text-white relative overflow-hidden group"
            >
              <img 
                src="https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80" 
                alt="Surgeons operating" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-secondary/60 mix-blend-multiply" />
              <div className="absolute inset-0 bg-secondary/40" />
              <div className="relative z-10">
                <h4 className="font-display text-4xl md:text-5xl font-bold mb-6">Our Vision</h4>
                <p className="font-body text-xl leading-relaxed opacity-90">{visionText}</p>
              </div>
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
            Our Core Values
          </h3>
          <p className="font-body text-base md:text-lg max-w-2xl mx-auto text-primary/70">
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
                className="group relative p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden text-white border border-white/10"
              >
                {/* Background Image */}
                <img 
                  src={v.img} 
                  alt={v.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                
                {/* Color Overlay (matching Mission/Vision treatment) */}
                <div className={`absolute inset-0 mix-blend-multiply ${isTwin ? 'bg-secondary/60' : 'bg-primary/60'}`} />
                <div className={`absolute inset-0 ${isTwin ? 'bg-secondary/40' : 'bg-primary/40'}`} />

                {/* Subtle background letter watermark */}
                <div className="absolute -right-4 -top-8 font-display text-[12rem] font-bold text-white select-none pointer-events-none opacity-20 group-hover:opacity-40 transition-all duration-500">
                  {firstLetter}
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300 bg-white/20 text-accent group-hover:bg-white">
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  
                  <h4 className="font-display text-2xl mb-3 text-white flex items-baseline">
                    <span className="text-3xl font-bold mr-[1px] text-white drop-shadow-md">
                      {firstLetter}
                    </span>
                    <span className="opacity-90">{restOfTitle}</span>
                  </h4>
                  
                  <p className="font-body text-sm opacity-90 leading-relaxed">
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
