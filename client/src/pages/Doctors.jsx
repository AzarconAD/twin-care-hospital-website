import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { User, ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown, Search } from "lucide-react";
import { THEME_COLORS } from "../theme";
import { DoctorsBackgroundBlobs } from "../components/bg-decorations";
import { getDoctors, getSchedule } from "../api/index.js";

const CATEGORIES = {
  all: { label: "All Doctors", color: THEME_COLORS.ink },
  emergency: { label: "Emergency & Urgent Care", color: THEME_COLORS.accent },
  wellness: { label: "Wellness & Preventive Care", color: THEME_COLORS.secondary },
  diagnostic: { label: "Diagnostic & Specialty Care", color: THEME_COLORS.primary },
};

// Dictionary of doctors (normalized for admin editability later)
const defaultDoctors = {
  d1: {
    id: "d1",
    category: "emergency",
    name: "Dr. Ramon Villareal",
    specialty: "Emergency Medicine",
    bio: "Leads rapid assessment and treatment for urgent, high-risk conditions around the clock.",
    // Swap with real photo later
    photo: "https://picsum.photos/seed/dr_ramon/400/500",
  },
  d2: {
    id: "d2",
    category: "emergency",
    name: "Dr. Carla Mendoza",
    specialty: "Trauma Surgery",
    bio: "Specializes in emergency surgical care for serious injuries and critical trauma cases.",
    // Swap with real photo later
    photo: "https://picsum.photos/seed/dr_carla/400/500",
  },
  d3: {
    id: "d3",
    category: "wellness",
    name: "Dr. Bea Santos",
    specialty: "Family & Wellness Medicine",
    bio: "Focuses on long-term health, preventive screening, and whole-family primary care.",
    // Swap with real photo later
    photo: "https://picsum.photos/seed/dr_bea/400/500",
  },
  d4: {
    id: "d4",
    category: "wellness",
    name: "Dr. Miguel Torres",
    specialty: "Pediatrics",
    bio: "Provides checkups, immunizations, and developmental care for infants through teens.",
    // Swap with real photo later
    photo: "https://picsum.photos/seed/dr_miguel/400/500",
  },
  d5: {
    id: "d5",
    category: "diagnostic",
    name: "Dr. Elena Cruz",
    specialty: "Cardiology",
    bio: "Diagnoses and manages heart conditions using on-site imaging and diagnostic testing.",
    // Swap with real photo later
    photo: "https://picsum.photos/seed/dr_elena/400/500",
  },
  d6: {
    id: "d6",
    category: "diagnostic",
    name: "Dr. Paolo Reyes",
    specialty: "Radiology",
    bio: "Reads and interprets X-ray, ultrasound, and CT imaging to guide accurate diagnoses.",
    // Swap with real photo later
    photo: "https://picsum.photos/seed/dr_paolo/400/500",
  },
};

// Generate a plausible schedule for the current month.
// Accepts an optional array of doctor IDs — defaults to the hardcoded set
// so it still works before the API responds. After the fetch, called again
// with the real IDs from the API.
const DEFAULT_IDS = ["d1", "d2", "d3", "d4", "d5", "d6"];

const generateSampleSchedule = (ids = DEFAULT_IDS) => {
  if (ids.length === 0) return [];
  const schedule = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Six weekday-pattern "slots" that repeat cyclically across however many doctors we have.
  // Each slot is a function(dayOfWeek) => boolean that decides if a doctor works that day.
  const patterns = [
    (d) => d !== 0,                           // Mon–Sat
    (d) => d % 2 === 0,                       // Tue, Thu, Sat (even days)
    (d) => d >= 1 && d <= 5,                  // Mon–Fri
    (d) => [1, 3, 5].includes(d),             // Mon, Wed, Fri
    (d) => [2, 4].includes(d),                // Tue, Thu
    (d) => d >= 3 && d <= 6,                  // Wed–Sat
  ];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayOfWeek = new Date(year, month, day).getDay(); // 0 = Sun, 6 = Sat

    ids.forEach((doctorId, i) => {
      // Assign each doctor a pattern by cycling through the patterns array
      const pattern = patterns[i % patterns.length];
      if (pattern(dayOfWeek)) {
        schedule.push({ doctorId, date: dateStr });
      }
    });
  }

  return schedule;
};

function buildDoctorDict(apiDoctors) {
  const dict = {};
  apiDoctors.forEach((doc) => {
    dict[doc._id] = {
      id: doc._id,
      _id: doc._id,           // keep the real Mongo ID in case we need it later
      name: doc.name,
      postfix: doc.postfix || '',
      specialty: doc.specialty,
      bio: doc.bio,
      category: doc.category,
      photo: doc.photo || null, // photo is optional — fallback avatar shown if missing
    };
  });
  return dict;
}

const defaultSchedule = generateSampleSchedule();

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function DoctorsPage() {
  // ── API state ────────────────────────────────────────────────────────────────
  // doctors is a dict: { d1: { id, name, specialty, ... }, d2: ... }
  // schedule is generated from the doctors dict on the fly via generateSampleSchedule
  const [doctors, setDoctors]   = useState(defaultDoctors);
  const [schedule, setSchedule] = useState(defaultSchedule);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // Fetch doctors and schedule from the Express API once on mount.
  // On success: convert the array to a dict and update state.
  // On failure: fall back to the hardcoded defaultDoctors and defaultSchedule already in state.
  useEffect(() => {
    Promise.all([getDoctors(), getSchedule()])
      .then(([docsData, schedData]) => {
        const dict = buildDoctorDict(docsData);
        setDoctors(dict);
        setSchedule(schedData);
      })
      .catch((err) => {
        setError(err.message);
        // Keep hardcoded data visible so the page isn’t blank on error
      })
      .finally(() => setLoading(false));
  }, []);

  const calendarRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  // Mobile accordion state: tracks which doctor's detail is open on which day
  // Format: "YYYY-MM-DD-doctorId"
  const [openMobileDetail, setOpenMobileDetail] = useState(null);
  const [openDesktopPopup, setOpenDesktopPopup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Format dates for matching with schedule
  const formatKey = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Filter schedule based on active category and search query
  const filteredSchedule = schedule.filter(entry => {
    const doc = doctors[entry.doctorId];
    if (!doc) return false;
    
    const categoryMatch = activeCategory === "all" || doc.category === activeCategory;
    
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const searchMatch = !normalizedQuery || 
      doc.name.toLowerCase().includes(normalizedQuery) || 
      doc.specialty.toLowerCase().includes(normalizedQuery);
      
    return categoryMatch && searchMatch;
  });

  // Group schedule by date
  const scheduleByDate = {};
  filteredSchedule.forEach(entry => {
    if (!scheduleByDate[entry.date]) scheduleByDate[entry.date] = [];
    if (doctors[entry.doctorId]) {
      scheduleByDate[entry.date].push(doctors[entry.doctorId]);
    }
  });

  const toggleMobileDetail = (id) => {
    setOpenMobileDetail(prev => prev === id ? null : id);
  };

  // Helper for hover popover (Desktop) — fully Framer Motion animated
  const DoctorPopup = ({ doctor, isVisible }) => {
    const catColor = THEME_COLORS.secondary;
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, y: 8, x: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 6, x: "-50%", scale: 0.97, transition: { duration: 0.25 } }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="absolute bottom-full left-1/2 mb-2 w-72 rounded-2xl shadow-2xl border border-white/60 z-50 cursor-default backdrop-blur-md"
            style={{ filter: "drop-shadow(0 8px 32px rgba(5,68,171,0.13))" }}
          >
            {/* Gradient header band */}
            <div
              className="relative flex flex-col items-center pt-5 pb-4 px-5 rounded-t-2xl"
              style={{ background: `linear-gradient(135deg, ${catColor}18 0%, ${catColor}0d 100%)`, borderBottom: `1px solid ${catColor}22` }}
            >
              {/* Avatar — photo if available, icon fallback */}
              {doctor.photo ? (
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-full object-cover mb-3 shadow-md ring-4 ring-white"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-3 shadow-md ring-4 ring-white"
                  style={{ backgroundColor: catColor }}
                >
                  <User size={24} color="#fff" strokeWidth={2} />
                </div>
              )}
              {/* Category badge */}
              <span
                className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-2"
                style={{ backgroundColor: `${catColor}22`, color: catColor }}
              >
                {CATEGORIES[doctor.category].label}
              </span>
              <h4 className="font-display text-base leading-tight text-ink text-center">
                {doctor.name}{doctor.postfix ? `, ${doctor.postfix}` : ''}
              </h4>
              <p className="font-mono text-[10px] uppercase tracking-wide mt-0.5 text-ink/60">{doctor.specialty}</p>
            </div>

            {/* Body */}
            <div className="bg-white/80 px-5 pt-3 pb-4 rounded-b-2xl">
              <p className="font-body text-xs text-ink/65 leading-relaxed text-center mb-4">
                {doctor.bio}
              </p>
              <Link
                to="/contact"
                state={{ appointment: true, doctorName: doctor.name }}
                className="main-button flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-body font-semibold text-sm transition-all duration-200 active:scale-95"
              >
                <CalendarIcon size={16} />
                Make an Appointment
              </Link>
            </div>

            {/* Caret */}
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-border rotate-45"
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const today = new Date();

  // Built from LOCAL date parts on purpose, not toISOString()
  const pad = (n) => String(n).padStart(2, "0");
  const todayISO = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const todayLabel = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const availableTodayCount = new Set(
    schedule
      .filter((entry) => entry.date === todayISO)
      .map((entry) => entry.doctorId)
  ).size;

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative min-h-screen bg-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-primary/60">
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-secondary animate-spin" />
          <p className="font-mono text-sm uppercase tracking-widest">Loading doctors…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen bg-cream text-primary overflow-hidden">
      {/* Decorative background blobs */}
      <DoctorsBackgroundBlobs />

      {/* Error banner — shown if the API failed but we still render with fallback data */}
      {error && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-accent/10 border border-accent/30 text-accent rounded-xl px-5 py-3 text-sm font-body shadow-md">
          ⚠️ Couldn’t reach the server — showing placeholder data. ({error})
        </div>
      )}

      <style>{`
        .tc-tab { transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
        .tc-doctor-pill { transition: transform 0.1s ease, box-shadow 0.1s ease; }
        .tc-doctor-pill:hover { transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      `}</style>

      {/* Header Area */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-32 lg:pt-40 pb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Live status row — today's date + how many doctors are on today */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-6 bg-white/70 backdrop-blur-md border border-primary/10 shadow-sm px-4 py-2 rounded-full">
          <div className="flex items-center gap-2 text-primary/80">
            <CalendarIcon size={16} className="text-primary/60" />
            <span className="font-mono text-xs uppercase tracking-wide font-medium">
              {todayLabel}
            </span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-primary/20"></div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              {availableTodayCount > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${availableTodayCount > 0 ? 'bg-secondary' : 'bg-primary/40'}`}></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-wide text-secondary font-medium">
              {availableTodayCount} {availableTodayCount === 1 ? 'doctor is' : 'doctors are'} available today
            </span>
          </div>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-primary mb-6">
          Find your <span className="text-accent">Specialist</span>
        </h1>
        <p className="font-body text-lg text-primary/70 leading-relaxed max-w-2xl mx-auto mb-8">
          Browse our team of experienced medical professionals and view their real-time availability to schedule your next visit.
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto">
          <div className="tc-search-wrapper flex-1 mx-auto max-w-[500px]">
            <div className="tc-search-container">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                placeholder="Search by doctor name or specialty..."
                className="tc-search-input font-body"
              />
              <div 
                className="tc-search-icon"
                onClick={() => calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              >
                <Search strokeWidth={3} size={20} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24 scroll-mt-24" ref={calendarRef}>
        <div className="main-container-wrapper">
          <div className="main-container">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between gap-4 p-5 border-b border-primary/15 relative z-10">
              <h2 className="font-display text-2xl sm:text-3xl text-primary">
                {MONTHS[month]} <span className="text-primary/60">{year}</span>
              </h2>

              <div className="flex gap-2">
            <button 
              onClick={prevMonth}
              className="p-2 rounded-full hover:bg-white/60 border border-transparent hover:border-white transition-colors text-primary"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-white/60 border border-transparent hover:border-white transition-colors text-primary"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Desktop Calendar Grid (>640px) */}
        <div className="hidden sm:block relative z-10">
          <div className="grid grid-cols-7 border-b border-primary/15 bg-secondary/10">
            {WEEKDAYS.map(day => (
              <div key={day} className="py-3 text-center font-mono text-xs uppercase text-secondary font-semibold tracking-wider border-r last:border-r-0 border-primary/15">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 auto-rows-fr">
            {/* Empty padding cells for start of month */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`pad-start-${i}`} className="min-h-[120px] p-2 border-r border-b border-primary/15 bg-transparent last:border-r-0"></div>
            ))}
            
            {/* Actual days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateKey = formatKey(day);
              const docsToday = scheduleByDate[dateKey] || [];
              const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
              
              return (
                <div key={day} className={`min-h-[120px] p-2 border-r border-b border-primary/15 relative hover:z-40 transition-colors duration-300 hover:bg-white/40 ${isToday ? 'bg-secondary/15' : 'bg-transparent'}`}>
                  <div className={`font-mono text-sm mb-2 w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-secondary text-white' : 'text-primary/70'}`}>
                    {day}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {docsToday.map(doc => (
                      <div key={doc.id} className="relative tc-doctor-pill">
                        <div 
                          onClick={() => setOpenDesktopPopup(prev => prev === `${dateKey}-${doc.id}` ? null : `${dateKey}-${doc.id}`)}
                          className="flex items-center gap-1.5 p-1.5 px-2 rounded-md border border-primary/15 cursor-pointer bg-white/70 hover:bg-white shadow-sm transition-colors"
                        >
                          <span className="font-body text-xs font-medium truncate text-ink/90">
                            {doc.name}
                          </span>
                        </div>
                        {/* Animated Popup */}
                        <DoctorPopup doctor={doc} isVisible={openDesktopPopup === `${dateKey}-${doc.id}`} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {/* Empty padding cells for end of month */}
            {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
              <div key={`pad-end-${i}`} className="min-h-[120px] p-2 border-r border-b border-primary/15 bg-transparent"></div>
            ))}
          </div>
        </div>

        {/* Mobile Agenda List (<640px) */}
        <div className="sm:hidden overflow-hidden flex flex-col divide-y divide-primary/15 relative z-10">
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = formatKey(day);
            const docsToday = scheduleByDate[dateKey] || [];
            const dayOfWeek = WEEKDAYS[new Date(year, month, day).getDay()];
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            
            // Skip rendering days with no doctors if a category is filtered, 
            // unless it's 'all' where we might want to see empty days to know there's no availability.
            if (docsToday.length === 0 && activeCategory !== "all") return null;

            return (
              <div key={day} className={`p-4 ${isToday ? 'bg-secondary/15' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`font-mono text-lg font-medium w-9 h-9 flex items-center justify-center rounded-full ${isToday ? 'bg-secondary text-white' : 'bg-white/50 text-primary'}`}>
                    {day}
                  </div>
                  <div className="font-mono text-sm font-semibold text-primary/70 uppercase tracking-wider">
                    {dayOfWeek}
                  </div>
                </div>
                
                {docsToday.length === 0 ? (
                  <p className="font-body text-sm text-primary/40 italic ml-12">No available doctors.</p>
                ) : (
                  <div className="flex flex-col gap-3 ml-12">
                    {docsToday.map(doc => {
                      const accordionId = `${dateKey}-${doc.id}`;
                      const isOpen = openMobileDetail === accordionId;
                      const catColor = CATEGORIES[doc.category].color;
                      
                      return (
                        <div key={doc.id} className="border border-primary/15 rounded-lg overflow-hidden bg-white/60 shadow-sm">
                          {/* Accordion Header */}
                          <button 
                            onClick={() => toggleMobileDetail(accordionId)}
                            className="w-full flex items-center justify-between p-3 text-left transition-colors hover:bg-white"
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                style={{ backgroundColor: catColor }}
                              >
                                <User size={14} color={THEME_COLORS.white} strokeWidth={2} />
                              </div>
                              <div>
                                <h4 className="font-display text-base text-ink leading-none mb-1">
                                  {doc.name}{doc.postfix ? `, ${doc.postfix}` : ''}
                                </h4>
                                <p className="font-mono text-[9px] uppercase tracking-wider" style={{ color: catColor }}>
                                  {CATEGORIES[doc.category].label}
                                </p>
                              </div>
                            </div>
                            <ChevronDown 
                              size={18} 
                              className={`text-primary/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          
                          {/* Accordion Body */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="p-4 pt-0 border-t border-border/50 bg-cream/30">
                                  <div className="mt-3">
                                    <p className="font-body text-sm font-semibold mb-1 text-ink/90">
                                      {doc.specialty}
                                    </p>
                                    <p className="font-body text-sm text-ink/70 leading-relaxed">
                                      {doc.bio}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Handle case where ALL days are empty due to filter in mobile view */}
          {activeCategory !== "all" && Object.keys(scheduleByDate).length === 0 && (
             <div className="p-8 text-center font-body text-primary/60">
               No doctors found for this category in {MONTHS[month]}.
             </div>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
