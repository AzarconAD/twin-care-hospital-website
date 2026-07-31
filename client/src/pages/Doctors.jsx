import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown, Search } from "lucide-react";
import { THEME_COLORS } from "../theme";

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
  },
  d2: {
    id: "d2",
    category: "emergency",
    name: "Dr. Carla Mendoza",
    specialty: "Trauma Surgery",
    bio: "Specializes in emergency surgical care for serious injuries and critical trauma cases.",
  },
  d3: {
    id: "d3",
    category: "wellness",
    name: "Dr. Bea Santos",
    specialty: "Family & Wellness Medicine",
    bio: "Focuses on long-term health, preventive screening, and whole-family primary care.",
  },
  d4: {
    id: "d4",
    category: "wellness",
    name: "Dr. Miguel Torres",
    specialty: "Pediatrics",
    bio: "Provides checkups, immunizations, and developmental care for infants through teens.",
  },
  d5: {
    id: "d5",
    category: "diagnostic",
    name: "Dr. Elena Cruz",
    specialty: "Cardiology",
    bio: "Diagnoses and manages heart conditions using on-site imaging and diagnostic testing.",
  },
  d6: {
    id: "d6",
    category: "diagnostic",
    name: "Dr. Paolo Reyes",
    specialty: "Radiology",
    bio: "Reads and interprets X-ray, ultrasound, and CT imaging to guide accurate diagnoses.",
  },
};

// Generate a plausible schedule for the current month
const generateSampleSchedule = () => {
  const schedule = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay(); // 0 is Sunday, 6 is Saturday
    
    // Emergency doctors available mostly every day
    if (dayOfWeek !== 0) schedule.push({ doctorId: "d1", date: dateStr }); // Mon-Sat
    if (dayOfWeek % 2 === 0) schedule.push({ doctorId: "d2", date: dateStr }); // Tue, Thu, Sat
    
    // Wellness doctors
    if (dayOfWeek >= 1 && dayOfWeek <= 5) schedule.push({ doctorId: "d3", date: dateStr }); // Mon-Fri
    if ([1, 3, 5].includes(dayOfWeek)) schedule.push({ doctorId: "d4", date: dateStr }); // Mon, Wed, Fri
    
    // Diagnostic doctors
    if ([2, 4].includes(dayOfWeek)) schedule.push({ doctorId: "d5", date: dateStr }); // Tue, Thu
    if (dayOfWeek >= 3 && dayOfWeek <= 6) schedule.push({ doctorId: "d6", date: dateStr }); // Wed-Sat
  }
  
  return schedule;
};

const defaultSchedule = generateSampleSchedule();

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function DoctorsPage({ doctors = defaultDoctors, schedule = defaultSchedule }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  
  // Mobile accordion state: tracks which doctor's detail is open on which day
  // Format: "YYYY-MM-DD-doctorId"
  const [openMobileDetail, setOpenMobileDetail] = useState(null);
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

  // Helper for hover popover content (Desktop)
  const DoctorPopup = ({ doctor }) => (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 rounded-xl border border-border bg-white shadow-xl z-50 hidden group-hover:block cursor-default">
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-border rotate-45"></div>
      <div className="flex flex-col items-center text-center relative z-10">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: CATEGORIES[doctor.category].color }}
        >
          <User size={20} color={THEME_COLORS.white} strokeWidth={2} />
        </div>
        <p className="font-mono text-[10px] uppercase mb-1" style={{ color: CATEGORIES[doctor.category].color }}>
          {CATEGORIES[doctor.category].label}
        </p>
        <h4 className="font-display text-base mb-1 text-ink">{doctor.name}</h4>
        <p className="font-body text-xs font-medium mb-2 text-ink/90">
          {doctor.specialty}
        </p>
        <p className="font-body text-xs text-ink/70 leading-relaxed">
          {doctor.bio}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen bg-cream text-primary overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-32 w-[32rem] h-[32rem] rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
        <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-secondary/15 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-32 left-1/4 w-[24rem] h-[24rem] rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
        <div className="absolute top-10 right-1/3 w-[20rem] h-[20rem] rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-1/4 -right-10 w-[26rem] h-[26rem] rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      </div>
      <style>{`
        .tc-tab { transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
        .tc-doctor-pill { transition: transform 0.1s ease, box-shadow 0.1s ease; }
        .tc-doctor-pill:hover { transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      `}</style>

      {/* Header Area */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 lg:pt-40 pb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight text-primary mb-5">
          Doctors' Schedule
        </h1>
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto relative mt-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-primary/40" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor name or specialty..."
            className="block w-full px-11 py-3 text-center bg-white/40 backdrop-blur-md border border-primary/15 rounded-full text-ink placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
          />
        </div>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {/* Calendar Controls */}
        <div className="flex items-center justify-between bg-white/40 backdrop-blur-md p-5 rounded-t-2xl border-x border-t border-primary/15 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
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
        <div className="hidden sm:block bg-white/30 backdrop-blur-md border-x border-b border-primary/15 rounded-b-2xl shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
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
                      <div key={doc.id} className="relative group tc-doctor-pill">
                        <div 
                          className="flex items-center gap-1.5 p-1.5 px-2 rounded-md border border-primary/15 cursor-pointer bg-white/70 hover:bg-white shadow-sm transition-colors"
                        >
                          <span className="font-body text-xs font-medium truncate text-ink/90">
                            {doc.name}
                          </span>
                        </div>
                        {/* Hover Popup */}
                        <DoctorPopup doctor={doc} />
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
        <div className="sm:hidden bg-white/30 backdrop-blur-md border border-primary/15 rounded-b-2xl shadow-[0_4px_30px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col divide-y divide-primary/15">
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
                  <div className="font-body text-sm font-semibold text-primary/70 uppercase tracking-wider">
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
                                <h4 className="font-display text-base text-ink leading-none mb-1">{doc.name}</h4>
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
  );
}
