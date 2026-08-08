import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ServicesBackgroundBlobs } from "../ui/BG-Decorations";
import {
  HeartPulse,
  Bandage,
  Hospital,
  Leaf,
  ShieldPlus,
  ClipboardPlus,
  Microscope,
  Scan,
  BriefcaseMedical,
} from "lucide-react";

const ICON_MAP = {
  "emergency-room": HeartPulse,
  "trauma-critical-care": Bandage,
  "ambulance-transport": Hospital,
  "wellness-nutrition": Leaf,
  "vaccination-immunization": ShieldPlus,
  "annual-checkups": ClipboardPlus,
  "laboratory-services": Microscope,
  "imaging-radiology": Scan,
  "specialist-clinics": BriefcaseMedical,
};



const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ServicesSection({ services, onImageClick }) {
  return (
    <section className="w-full bg-cream py-20 relative overflow-hidden">
      {/* Decorative background blobs */}
      <ServicesBackgroundBlobs />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div 
          className="relative z-10 max-w-3xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-primary mb-6">
            Our <span className="text-accent">Services</span>
          </h2>
          <p className="font-body text-lg text-primary/70 leading-relaxed max-w-2xl mx-auto">
            An overview of our services &mdash; select any one to learn more.
          </p>
        </motion.div>

        <motion.div 
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service) => {
            const Icon = service.icon || ICON_MAP[service.slug] || HeartPulse;
            return (
              <motion.div
                key={service.slug}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="main-container-wrapper group transition-transform duration-300"
              >
                <div className="main-container h-64 relative">
                  {/* Decorative Background Effects Wrapper (clipped) */}
                  <div className="absolute inset-0 overflow-hidden rounded-[1rem] pointer-events-none z-0">
                    {/* Light Bleed Glow */}
                    <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/50 blur-3xl rounded-full" />
                    
                    {/* Giant Faint Watermark Icon */}
                    <div className="absolute -bottom-6 -left-6 opacity-[0.04] transform -rotate-12 transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-3">
                      <Icon size={180} className="text-primary" />
                    </div>
                  </div>

                  {/* Floating photo — inset from the bottom-right corner, masked to dissolve into the background */}
                  <div 
                    className="absolute bottom-3 right-3 w-[45%] h-[60%] rounded-2xl overflow-hidden cursor-pointer shadow-md border border-primary/10"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to bottom right, transparent 0%, black 40%)',
                      maskImage: 'linear-gradient(to bottom right, transparent 0%, black 40%)'
                    }}
                    onClick={() => onImageClick && onImageClick(service.photo)}
                  >
                    <img
                      src={service.photo}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 pointer-events-none" />
                  </div>

                  {/* Content — icon, title, description, divider, link */}
                  <div className="relative p-5 w-[62%] flex flex-col h-full z-10 pointer-events-none">
                    <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center mb-4 flex-shrink-0 shadow-sm">
                      <Icon size={20} className="text-white" strokeWidth={2} />
                    </div>
                    <h3 className="font-display text-base text-ink leading-snug mb-1.5">
                      {service.title}
                    </h3>
                    <p className="font-body text-xs text-ink/60 leading-relaxed mb-auto">
                      {service.text}
                    </p>
                    <div className="pointer-events-auto">
                      <div className="w-8 border-t-2 border-secondary mb-2" />
                      <Link
                        to={`/services/${service.slug}`}
                        className="font-mono text-xs font-semibold text-primary hover:underline group/link inline-flex items-center gap-1"
                      >
                        [Learn More]
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}