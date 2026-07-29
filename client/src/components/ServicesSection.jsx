import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const COLORS = {
  ink: "#1C1E1F",
  paper: "#FAFAF9",
  white: "#FFFFFF",
  border: "#E7E7E5",
  blue: "#0544AB",
};

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
  const [isPaused, setIsPaused] = useState(false);
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

  // Auto-advance the carousel to the right, frame by frame, unless paused
  // (paused on hover so users can actually read a card without it drifting away).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || filtered.length === 0) return;
    let frameId;
    let accumulatedScroll = 0;

    const tick = () => {
      if (!isPaused && el) {
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
  }, [isPaused, activeCategory, filtered.length]);

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
      style={{ backgroundColor: COLORS.paper, color: COLORS.ink }}
      className="w-full"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
        .tc-display { font-family: 'Fraunces', serif; }
        .tc-body { font-family: 'Inter', sans-serif; }
        .tc-mono { font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.08em; }
        .tc-tab { transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
        .tc-scroll::-webkit-scrollbar { display: none; }
        .tc-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .tc-arrow { transition: background-color 0.2s ease, transform 0.15s ease; }
        .tc-arrow:hover { transform: scale(1.06); }
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

      {/* Carousel — infinite auto-scroll, pausable on hover, with arrow controls */}
      <div className="pb-20">
        {filtered.length === 0 ? (
          <p className="tc-body text-center opacity-60 py-10">
            No services in this category yet.
          </p>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
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
                      viewport={{ once: true, amount: 0.2 }}
                      variants={cardVariants}
                      className="flex-none w-72 sm:w-80 rounded-xl overflow-hidden border bg-white"
                      style={{ borderColor: COLORS.border }}
                    >
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
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Arrow buttons */}
            <button
              onClick={() => scrollByCard(-1)}
              aria-label="Scroll left"
              className="tc-arrow hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center shadow-md"
              style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}
            >
              <ChevronLeft size={20} color={COLORS.blue} />
            </button>
            <button
              onClick={() => scrollByCard(1)}
              aria-label="Scroll right"
              className="tc-arrow hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full items-center justify-center shadow-md"
              style={{ backgroundColor: COLORS.white, border: `1px solid ${COLORS.border}` }}
            >
              <ChevronRight size={20} color={COLORS.blue} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
