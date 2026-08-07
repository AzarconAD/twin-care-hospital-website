import React from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { THEME_COLORS } from "../../theme";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function DoctorsCalendar({
  currentDate,
  prevMonth,
  nextMonth,
  scheduleByDate,
  setSelectedDate,
  activeCategory,
  todayISO,
  CATEGORIES
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const formatKey = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  return (
    <>
      {/* Calendar Controls */}
      <div className="flex items-center justify-between gap-4 p-5 border-b border-border relative z-10">
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
        <div className="grid grid-cols-7 border-b border-border bg-secondary/10">
          {WEEKDAYS.map(day => (
            <div key={day} className="py-3 text-center font-mono text-xs uppercase text-secondary font-semibold tracking-wider border-r last:border-r-0 border-border">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 auto-rows-fr">
          {/* Empty padding cells for start of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`pad-start-${i}`} className="min-h-[120px] p-2 border-r border-b border-border bg-transparent last:border-r-0"></div>
          ))}
          
          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = formatKey(day);
            const docsToday = scheduleByDate[dateKey] || [];
            const isToday = todayISO === dateKey;
            
            return (
              <div 
                key={day} 
                onClick={() => setSelectedDate(dateKey)}
                className={`min-h-[120px] p-2 border-r border-b border-border relative transition-colors duration-200 cursor-pointer group ${isToday ? 'bg-secondary/10' : 'bg-transparent hover:bg-white/60'}`}
              >
                <div className={`font-mono text-sm mb-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isToday ? 'bg-secondary text-white' : 'text-primary/70 group-hover:text-primary'}`}>
                  {day}
                </div>
                
                {docsToday.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center pl-1">
                      {docsToday.slice(0, 3).map((doc, idx) => {
                        const catColor = CATEGORIES[doc.category]?.color || THEME_COLORS.secondary;
                        return (
                          <div key={doc.id} className="relative transition-transform group-hover:-translate-y-0.5 duration-200" style={{ zIndex: 10 - idx, marginLeft: idx > 0 ? '-8px' : '0' }}>
                            {doc.photo ? (
                              <img src={doc.photo} alt={doc.name} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" title={doc.name} />
                            ) : (
                              <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm" style={{ backgroundColor: catColor }} title={doc.name}>
                                <User size={14} color="#fff" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {docsToday.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-paper border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-mono text-ink/70 z-0 -ml-2 transition-transform group-hover:-translate-y-0.5 duration-200">
                          +{docsToday.length - 3}
                        </div>
                      )}
                    </div>
                    <span className="font-body text-[10px] text-ink/50 pl-1 group-hover:text-ink/80 transition-colors">{docsToday.length} available</span>
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Empty padding cells for end of month */}
          {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
            <div key={`pad-end-${i}`} className="min-h-[120px] p-2 border-r border-b border-border bg-transparent"></div>
          ))}
        </div>
      </div>

      {/* Mobile Agenda List (<640px) */}
      <div className="sm:hidden overflow-hidden flex flex-col divide-y divide-border relative z-10">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateKey = formatKey(day);
          const docsToday = scheduleByDate[dateKey] || [];
          const dayOfWeek = WEEKDAYS[new Date(year, month, day).getDay()];
          const isToday = todayISO === dateKey;
          
          // Skip rendering days with no doctors if a category is filtered, 
          // unless it's 'all' where we might want to see empty days to know there's no availability.
          if (docsToday.length === 0 && activeCategory !== "all") return null;

          return (
            <div 
              key={day} 
              onClick={() => setSelectedDate(dateKey)}
              className={`p-5 cursor-pointer active:bg-white/40 transition-colors ${isToday ? 'bg-secondary/10' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`font-mono text-lg font-medium w-10 h-10 flex items-center justify-center rounded-full ${isToday ? 'bg-secondary text-white' : 'bg-white/80 text-primary'}`}>
                    {day}
                  </div>
                  <div className="font-mono text-sm font-semibold text-primary/70 uppercase tracking-wider">
                    {dayOfWeek}
                  </div>
                </div>
                {docsToday.length > 0 && (
                  <span className="font-body text-xs text-ink/60 bg-white px-2 py-1 rounded-md border border-border">{docsToday.length} Available</span>
                )}
              </div>
              
              {docsToday.length === 0 ? (
                <p className="font-body text-sm text-primary/40 italic ml-13">No available doctors.</p>
              ) : (
                <div className="flex items-center -space-x-2 pl-2">
                  {docsToday.slice(0, 5).map((doc, idx) => {
                    const catColor = CATEGORIES[doc.category]?.color || THEME_COLORS.secondary;
                    return (
                      <div key={doc.id} className="relative" style={{ zIndex: 10 - idx }}>
                        {doc.photo ? (
                          <img src={doc.photo} alt={doc.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white shadow-sm" style={{ backgroundColor: catColor }}>
                            <User size={16} color="#fff" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {docsToday.length > 5 && (
                    <div className="w-10 h-10 rounded-full bg-paper border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-mono text-ink/70 z-0">
                      +{docsToday.length - 5}
                    </div>
                  )}
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
    </>
  );
}
