import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export default function AdminScheduleModal({
  scheduleModalOpen,
  setScheduleModalOpen,
  scheduleModalData,
  setScheduleModalData,
  customTime,
  setCustomTime,
  DEFAULT_TIME_SLOTS,
  isSaving,
  handleApplyScheduleModal
}) {
  if (!scheduleModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-border bg-paper">
          <div>
            <h3 className="font-display text-xl text-primary">Schedule for {scheduleModalData.dateStr}</h3>
          </div>
          <button onClick={() => setScheduleModalOpen(false)} className="text-primary/50 hover:text-primary transition-colors text-2xl leading-none">&times;</button>
        </div>
        
        <div className="p-6">
          <label className="flex items-center gap-3 cursor-pointer mb-6 border border-border p-4 rounded-xl bg-cream/30 hover:bg-cream/50 transition-colors">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded text-secondary focus:ring-secondary/20 cursor-pointer"
              checked={scheduleModalData.isAvailable}
              onChange={(e) => setScheduleModalData(prev => ({ ...prev, isAvailable: e.target.checked, timeSlots: e.target.checked ? prev.timeSlots : [] }))}
            />
            <span className="font-body font-medium text-ink">Doctor is available on this date</span>
          </label>

          {scheduleModalData.isAvailable && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <h4 className="font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-3">Available Time Slots</h4>
              
              <div className="flex flex-wrap gap-2 mb-5">
                {DEFAULT_TIME_SLOTS.map(time => {
                  const isSelected = scheduleModalData.timeSlots.includes(time);
                  return (
                    <label 
                      key={time} 
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors text-sm font-mono ${isSelected ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-white border-border text-ink/70 hover:border-border/80'}`}
                    >
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={isSelected}
                        onChange={(e) => {
                          setScheduleModalData(prev => ({
                            ...prev,
                            timeSlots: e.target.checked 
                              ? [...prev.timeSlots, time] 
                              : prev.timeSlots.filter(t => t !== time)
                          }))
                        }}
                      />
                      {time}
                    </label>
                  )
                })}
              </div>

              <div className="mb-2">
                <h4 className="font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-2">Custom Time Slot</h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="e.g. 05:30 PM"
                    className="flex-1 p-2 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customTime.trim() && !scheduleModalData.timeSlots.includes(customTime.trim())) {
                          setScheduleModalData(prev => ({ ...prev, timeSlots: [...prev.timeSlots, customTime.trim()] }));
                          setCustomTime('');
                        }
                      }
                    }}
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      if (customTime.trim() && !scheduleModalData.timeSlots.includes(customTime.trim())) {
                        setScheduleModalData(prev => ({ ...prev, timeSlots: [...prev.timeSlots, customTime.trim()] }));
                        setCustomTime('');
                      }
                    }}
                    className="px-4 py-2 bg-cream text-primary rounded-lg font-body text-sm font-medium hover:bg-border transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="mt-8 pt-5 border-t border-border flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setScheduleModalOpen(false)} 
              className="px-4 py-2 rounded-lg font-body text-sm text-primary/60 hover:text-primary transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="button" 
              onClick={handleApplyScheduleModal} 
              disabled={isSaving || (scheduleModalData.isAvailable && scheduleModalData.timeSlots.length === 0)}
              className="main-button px-5 py-2 rounded-lg font-body text-sm font-semibold disabled:opacity-50 flex items-center justify-center min-w-[100px]"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </span>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
