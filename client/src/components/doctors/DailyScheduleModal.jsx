import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { User, Calendar as CalendarIcon, X } from "lucide-react";
import { THEME_COLORS } from "../../theme";

export default function DailyScheduleModal({ 
  selectedDate, 
  setSelectedDate, 
  scheduleByDate, 
  CATEGORIES 
}) {
  if (!selectedDate) return null;
  
  // Parse date for display
  const [y, m, d] = selectedDate.split("-");
  const dateObj = new Date(y, m - 1, d);
  const dateLabel = dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const pad = (n) => String(n).padStart(2, "0");
  const today = new Date();
  const todayISO = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  const isPast = selectedDate < todayISO;
  
  const docsForDay = scheduleByDate[selectedDate] || [];

  return (
    <AnimatePresence>
      {selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setSelectedDate(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-paper">
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-ink">Schedule for {dateLabel}</h3>
                <p className="font-body text-sm text-ink/60 mt-1">{docsForDay.length} {docsForDay.length === 1 ? 'Doctor' : 'Doctors'} Available</p>
              </div>
              <button 
                onClick={() => setSelectedDate(null)}
                className="p-2 bg-white rounded-full text-ink/50 hover:text-ink border border-border hover:bg-paper transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 overflow-y-auto bg-white/50 space-y-6">
              {docsForDay.length === 0 ? (
                <div className="text-center py-10">
                  <p className="font-body text-ink/60">No doctors scheduled for this date.</p>
                </div>
              ) : (
                docsForDay.map(doc => {
                  const catColor = CATEGORIES[doc.category]?.color || THEME_COLORS.secondary;
                  return (
                    <div key={doc.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                        {/* Avatar */}
                        <div className="shrink-0">
                          {doc.photo ? (
                            <img src={doc.photo} alt={doc.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shadow-sm ring-4 ring-paper" />
                          ) : (
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-sm ring-4 ring-paper" style={{ backgroundColor: catColor }}>
                              <User size={30} color="#fff" />
                            </div>
                          )}
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1">
                          <span className="inline-block px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider mb-2" style={{ backgroundColor: `${catColor}15`, color: catColor }}>
                            {CATEGORIES[doc.category]?.label}
                          </span>
                          <h4 className="font-display text-lg text-ink leading-tight">{doc.name}{doc.postfix ? `, ${doc.postfix}` : ''}</h4>
                          <p className="font-body text-sm text-ink/70 mt-0.5 mb-2">{doc.specialty}</p>
                          <p className="font-body text-xs text-ink/60 line-clamp-2">{doc.bio}</p>
                        </div>
                      </div>
                      
                      {/* Time slots & Action */}
                      <div className="bg-paper px-4 sm:px-5 py-4 border-t border-border flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                          <h5 className="font-mono text-[10px] uppercase tracking-widest text-ink/50 mb-3">Available Time Slots</h5>
                          <div className="flex flex-wrap gap-2">
                            {doc.timeSlots && doc.timeSlots.length > 0 ? doc.timeSlots.map(time => (
                              isPast ? (
                                <span 
                                  key={time}
                                  className="px-2.5 py-1 bg-white border border-border rounded-md font-mono text-[11px] text-ink/70"
                                >
                                  {time}
                                </span>
                              ) : (
                                <Link 
                                  key={time}
                                  to="/contact"
                                  state={{ appointment: true, doctorId: doc.id, date: selectedDate, time }}
                                  className="px-2.5 py-1 bg-white border border-border rounded-md font-mono text-[11px] text-ink/70 hover:border-primary/50 hover:text-primary transition-colors"
                                >
                                  {time}
                                </Link>
                              )
                            )) : (
                              <span className="font-body text-xs text-ink/50 italic mb-1 block">Walk-in only</span>
                            )}
                          </div>
                        </div>
                        {!isPast && (
                          <Link
                            to="/contact"
                            state={{ appointment: true, doctorId: doc.id, date: selectedDate }}
                            className="main-button shrink-0 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-body font-semibold text-sm transition-all duration-200 active:scale-95"
                          >
                            <CalendarIcon size={16} />
                            Make an Appointment
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
