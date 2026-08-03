import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { THEME_COLORS } from "../theme";
import { ServicesBackgroundBlobs } from "./bg-decorations";
import Button from "./Button";

// Must roughly match the card's rendered width (w-72 = 288px) + the gap (gap-6 = 24px).
// Used to move the carousel by "one card" when an arrow button is clicked.
const CARD_STEP = 312;

// How many pixels the carousel auto-advances per animation frame (~60 times/sec).
// Smaller = slower/smoother drift. Larger = faster.
const AUTOPLAY_SPEED = 0.3;

const CATEGORIES = {
  all: "All Services",
  emergency: "Emergency & Urgent Care",
  wellness: "Wellness & Preventive Care",
  diagnostic: "Diagnostic & Specialty Care",
};

// "category" is kept only so the filter tabs still work — it is no longer
// used to color the cards. "photo" is a placeholder; replace with a real
// path (e.g. "/services/emergency-room.jpg" in client/public) once you have one.
const defaultServices = [
  {
    category: "emergency",
    title: "Emergency Room",
    text: "24/7 emergency care for critical and life-threatening conditions.",
    photo: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=500&h=375",
  },
  {
    category: "emergency",
    title: "Trauma & Critical Care",
    text: "A rapid-response team ready for high-acuity trauma cases at any hour.",
    photo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=500&h=375",
  },
  {
    category: "emergency",
    title: "Ambulance & Transport",
    text: "Round-the-clock ambulance dispatch for urgent patient transport.",
    photo: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=500&h=375",
  },
  {
    category: "wellness",
    title: "Wellness & Nutrition",
    text: "Personalized nutrition and lifestyle counseling for long-term health.",
    photo: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=500&h=375",
  },
  {
    category: "wellness",
    title: "Vaccination & Immunization",
    text: "Full immunization schedules and boosters for every age group.",
    photo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=500&h=375",
  },
  {
    category: "wellness",
    title: "Annual Checkups",
    text: "Comprehensive physical exams designed to catch issues early.",
    photo: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=500&h=375",
  },
  {
    category: "diagnostic",
    title: "Laboratory Services",
    text: "Fast, accurate lab testing across a full range of diagnostics.",
    photo: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=500&h=375",
  },
  {
    category: "diagnostic",
    title: "Imaging & Radiology",
    text: "On-site X-ray, ultrasound, and CT imaging with quick turnaround.",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=500&h=375",
  },
  {
    category: "diagnostic",
    title: "Specialist Clinics",
    text: "Cardiology, pediatrics, OB-GYN, and other specialist consultations.",
    photo: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=500&h=375",
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

export default function ServicesSection({ services = defaultServices, onImageClick }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const scrollRef = useRef(null);

  const filtered =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory);

  // Three copies of the (filtered) list back to back, so there's always
  // more content to scroll into as the carousel wraps around.
  const loopedServices =
    filtered.length > 0 ? [...filtered, ...filtered, ...filtered] : [];

  // On mount, and whenever the filter changes (which changes the list length,
  // so the "middle copy" starts at a different pixel offset), jump the
  // scroll position to the start of the middle copy — this is what makes
  // the carousel open already "in the middle" instead of at the very start.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || filtered.length === 0) return;
    requestAnimationFrame(() => {
      const singleSetWidth = el.scrollWidth / 3;
      el.scrollLeft = singleSetWidth;
    });
  }, [activeCategory, filtered.length]);

  // Auto-advance the carousel to the right, frame by frame.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || filtered.length === 0) return;
    let frameId;
    let accumulatedScroll = 0;

    const tick = () => {
      if (el && activeCategory === "all") {
        // Accumulate sub-pixels to handle speeds < 1 on browsers that truncate scrollLeft
        accumulatedScroll += AUTOPLAY_SPEED;
        if (accumulatedScroll >= 1) {
          const pixelsToMove = Math.floor(accumulatedScroll);
          el.scrollLeft += pixelsToMove;
          accumulatedScroll -= pixelsToMove;
        }
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [activeCategory, filtered.length]);

  // Runs on EVERY scroll event, whether caused by autoplay, an arrow click,
  // or the user manually dragging/swiping. If we've drifted into the first
  // or third copy, silently snap back to the equivalent spot in the middle
  // copy — since all three copies are identical, this jump is invisible.
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el || filtered.length === 0) return;
    const singleSetWidth = el.scrollWidth / 3;
    if (el.scrollLeft <= 0) {
      el.scrollLeft += singleSetWidth;
    } else if (el.scrollLeft >= singleSetWidth * 2) {
      el.scrollLeft -= singleSetWidth;
    }
  };

  const scrollByCard = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * CARD_STEP, behavior: "smooth" });
  };

  return (
    <section
      id="services"
      className="relative w-full text-ink"
    >
      {/* Decorative background blobs */}
      <ServicesBackgroundBlobs />
      <style>{`
        .tc-tab { transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
        .tc-scroll::-webkit-scrollbar { display: none; }
        .tc-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .tc-arrow { transition: background-color 0.2s ease, transform 0.15s ease; }
        .tc-arrow:hover { transform: scale(1.06); }
      `}</style>

      <motion.div
        className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-10 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-sm tracking-widest uppercase mb-3 font-bold text-secondary">
          What We Offer
        </p>
        <h2 className="font-display text-4xl md:text-5xl leading-tight mb-5 text-primary">
          Care organized around
          <br />
          how urgently you need it.
        </h2>
        <p className="font-body text-base md:text-lg max-w-2xl mx-auto text-primary/70">
          Every service below is grouped by the kind of care it provides &mdash; so
          you always know where to start.
        </p>
      </motion.div>

      {/* Category filter tabs — kept for filtering, no longer color-coded per category */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-3 pb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {Object.entries(CATEGORIES).map(([key, label]) => {
          const isActive = activeCategory === key;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`tc-tab font-body text-sm font-medium !rounded-full ${
                isActive
                  ? "px-6 py-3 bg-secondary text-white border border-secondary" 
                  : "btn-fill"
              }`}
            >
              {label}
            </button>
          );
        })}
      </motion.div>

      {/* Carousel — infinite auto-scroll, pausable on hover, with arrow controls */}
      <div className="relative z-10 pb-12">
        {filtered.length === 0 ? (
          <p className="font-body text-center opacity-60 py-10">
            No services in this category yet.
          </p>
        ) : (
          <div
            className="relative"
          >
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="tc-scroll flex gap-6 overflow-x-auto px-6 md:px-[calc((100%-64rem)/2+1.5rem)] py-2"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                maskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              }}
            >
              <AnimatePresence mode="popLayout">
                {loopedServices.map((service, i) => {
                  const setIndex = Math.floor(i / filtered.length);
                  const cardIndexInSet = i % filtered.length;
                  return (
                    <motion.div
                      key={`${service.title}-${setIndex}`}
                      layout
                      custom={cardIndexInSet}
                      initial="hidden"
                      whileInView="visible"
                      exit="exit"
                      viewport={{ once: false, amount: 0.2 }}
                      variants={cardVariants}
                      className="group flex-none w-72 sm:w-80 aspect-[3/4] rounded-3xl overflow-hidden relative cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
                      onClick={() => onImageClick?.(service.photo)}
                    >
                      {/* Full background image */}
                      <img
                        src={service.photo}
                        alt={service.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient overlay for text legibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                      
                      {/* Inner border for premium glass feel */}
                      <div className="absolute inset-0 border border-white/20 rounded-3xl z-10 pointer-events-none" />

                      {/* Content anchored to bottom */}
                      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end z-20">
                        <h3 className="font-display text-2xl mb-2 text-white transform group-hover:-translate-y-2 transition-transform duration-500">
                          {service.title}
                        </h3>
                        <div className="overflow-hidden">
                          <p className="font-body text-sm text-white/90 leading-relaxed transform translate-y-[120%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                            {service.text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Arrow buttons */}
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll left"
              className="tc-arrow hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center shadow-md bg-white border border-border"
            >
              <ChevronLeft size={20} color={THEME_COLORS.primary} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Scroll right"
              className="tc-arrow hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center shadow-md bg-white border border-border"
            >
              <ChevronRight size={20} color={THEME_COLORS.primary} />
            </button>
          </div>
        )}
        
        <div className="mt-20 w-fit mx-auto flex flex-col sm:flex-row items-center justify-center gap-8 bg-white border border-border/50 rounded-2xl shadow-sm py-6 px-10">
          <h3 className="font-display text-3xl font-semibold text-primary">Got Questions?</h3>
          <Button 
            to="/contact" 
            variant="secondary"
            className="!px-10 !py-4 text-lg"
          >
            Message Us <ArrowRight size={20} className="ml-1 -mr-2" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </section>
  );
}
