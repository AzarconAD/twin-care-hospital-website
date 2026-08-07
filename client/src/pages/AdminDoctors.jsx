import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Calendar as CalendarIcon, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import AdminHeader from '../components/admin/AdminHeader.jsx'
import DoctorEditModal from '../components/admin/DoctorEditModal.jsx'
import AdminScheduleModal from '../components/admin/AdminScheduleModal.jsx'
import { checkAdminSession, adminLogout, getDoctors, getSchedule, addScheduleEntry, removeScheduleEntry, updateScheduleEntry, createDoctor, updateDoctor, deleteDoctor } from '../api/index.js'

export default function AdminDoctors() {
  const navigate = useNavigate()
  const location = useLocation()

  const [doctors, setDoctors] = useState([])
  const [schedule, setSchedule] = useState([])
  const [localSchedule, setLocalSchedule] = useState([])
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null) // null = create new
  const [formData, setFormData] = useState({
    name: '', postfix: '', specialty: '', category: 'wellness', bio: '', photo: ''
  })
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState(null)
  
  // Schedule Modal state
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [scheduleModalData, setScheduleModalData] = useState({ dateStr: '', isAvailable: false, timeSlots: [] })
  const [customTime, setCustomTime] = useState('')
  const DEFAULT_TIME_SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"]
  
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const pad = (n) => String(n).padStart(2, "0");

  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    checkAdminSession()
      .then(({ authenticated }) => {
        if (!authenticated) {
          navigate('/admin/login', { replace: true })
          return Promise.reject('Not authenticated')
        }
        return Promise.all([getDoctors(), getSchedule()])
      })
      .then(([docsData, schedData]) => {
        setDoctors(docsData)
        setSchedule(schedData)
        setLocalSchedule(schedData)
        if (docsData.length > 0) {
          setSelectedDoctorId(docsData[0]._id)
        }
      })
      .catch((err) => {
        if (err !== 'Not authenticated') {
          setError(err.message)
        }
      })
      .finally(() => setLoading(false))
  }, [navigate])

  const handleLogout = async () => {
    try {
      await adminLogout()
    } catch {}
    navigate('/admin/login', { replace: true })
  }

  const handleDayClick = (day) => {
    if (!selectedDoctorId) return;
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
    
    const existing = localSchedule.find(s => s.doctorId === selectedDoctorId && s.date === dateStr);
    
    setScheduleModalData({
      dateStr,
      isAvailable: !!existing,
      timeSlots: existing?.timeSlots || []
    });
    setCustomTime('');
    setScheduleModalOpen(true);
  };

  const handleApplyScheduleModal = async () => {
    const { dateStr, isAvailable, timeSlots } = scheduleModalData;
    const existing = schedule.find(s => s.doctorId === selectedDoctorId && s.date === dateStr);

    setIsSaving(true);
    try {
      if (isAvailable) {
        if (existing) {
          const existingSlots = existing.timeSlots || [];
          const sortedExisting = [...existingSlots].sort();
          const sortedLocal = [...timeSlots].sort();
          const hasChanged = existingSlots.length !== timeSlots.length || sortedExisting.some((v, i) => v !== sortedLocal[i]);
          
          if (hasChanged) {
            await updateScheduleEntry(existing._id, timeSlots);
          }
        } else {
          await addScheduleEntry(selectedDoctorId, dateStr, timeSlots);
        }
      } else {
        if (existing) {
          await removeScheduleEntry(existing._id);
        }
      }

      const freshSchedule = await getSchedule();
      setSchedule(freshSchedule);
      setLocalSchedule(freshSchedule);
      setScheduleModalOpen(false);
    } catch (err) {
      alert(`Failed to save schedule: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // --- Doctor Form Handlers ---
  const openCreateModal = () => {
    setEditingDoctor(null)
    setFormData({ name: '', postfix: '', specialty: '', category: 'wellness', bio: '', photo: '' })
    setFormError(null)
    setIsModalOpen(true)
  }

  const openEditModal = () => {
    const doc = doctors.find(d => d._id === selectedDoctorId)
    if (!doc) return
    setEditingDoctor(doc)
    setFormData({
      name: doc.name || '',
      postfix: doc.postfix || '',
      specialty: doc.specialty || '',
      category: doc.category || 'wellness',
      bio: doc.bio || '',
      photo: doc.photo || ''
    })
    setFormError(null)
    setIsModalOpen(true)
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveDoctor = async (e) => {
    e.preventDefault()
    setFormError(null)
    setFormLoading(true)
    
    try {
      if (editingDoctor) {
        const updated = await updateDoctor(editingDoctor._id, formData)
        setDoctors(prev => prev.map(d => d._id === updated._id ? updated : d))
      } else {
        const created = await createDoctor(formData)
        setDoctors(prev => [...prev, created])
        setSelectedDoctorId(created._id)
      }
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteDoctor = async () => {
    if (!editingDoctor) return
    if (!window.confirm(`Delete ${editingDoctor.name} and all their schedule entries? This can't be undone.`)) {
      return
    }
    
    setFormLoading(true)
    try {
      await deleteDoctor(editingDoctor._id)
      setDoctors(prev => prev.filter(d => d._id !== editingDoctor._id))
      // Remove local schedule entries for this doctor
      setSchedule(prev => prev.filter(s => s.doctorId !== editingDoctor._id))
      setLocalSchedule(prev => prev.filter(s => s.doctorId !== editingDoctor._id))
      if (selectedDoctorId === editingDoctor._id) {
        setSelectedDoctorId(doctors.length > 1 ? doctors.find(d => d._id !== editingDoctor._id)._id : '')
      }
      setIsModalOpen(false)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <AdminHeader handleLogout={handleLogout} />

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h2 className="font-display text-2xl text-primary mb-1">Doctors' Schedule</h2>
          <p className="font-body text-sm text-primary/60">
            Manage availability. Click a date to toggle the doctor's schedule, then click Save Changes.
          </p>
        </motion.div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4 text-primary/40">
              <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-secondary animate-spin" />
              <p className="font-mono text-xs uppercase tracking-widest">Loading…</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl px-5 py-4 text-accent font-body text-sm">
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-border rounded-2xl shadow-md overflow-hidden p-6"
          >
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-2">Select Doctor</label>
                <select 
                  value={selectedDoctorId} 
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full p-3 border border-border rounded-lg font-body text-primary focus:outline-none focus:border-secondary transition-colors"
                >
                  {doctors.length === 0 && <option value="" disabled>No doctors found</option>}
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>{doc.name} ({doc.specialty})</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                {selectedDoctorId && (
                  <button 
                    onClick={openEditModal}
                    className="secondary-button px-4 py-3 rounded-lg text-sm font-semibold flex-1 sm:flex-none whitespace-nowrap"
                  >
                    Edit Info
                  </button>
                )}
                <button 
                  onClick={openCreateModal}
                  className="main-button px-4 py-3 rounded-lg text-sm font-semibold flex-1 sm:flex-none whitespace-nowrap"
                >
                  Create New Doctor
                </button>
              </div>
            </div>

            {selectedDoctorId && (
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-slate-100 border-b border-border flex-wrap gap-4">
                  <h3 className="font-display text-xl text-primary flex items-center gap-4">
                    <span>{MONTHS[month]} {year}</span>
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-border transition-colors text-primary">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-border transition-colors text-primary">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 bg-slate-200 border-b border-border">
                  {WEEKDAYS.map(day => (
                    <div key={day} className="py-3 text-center font-mono text-xs uppercase text-primary/60 font-semibold tracking-wider">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 auto-rows-fr">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`pad-${i}`} className="min-h-[80px] p-2 border-b border-r border-border/50 bg-transparent"></div>
                  ))}
                  
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
                    const existingSchedule = localSchedule.find(s => s.doctorId === selectedDoctorId && s.date === dateStr);
                    const isAvailable = !!existingSchedule;
                    const selectedDoctor = doctors.find(d => d._id === selectedDoctorId);
                    const doctorName = selectedDoctor ? selectedDoctor.name : 'Available';
                    
                    return (
                      <div 
                        key={day} 
                        onClick={() => handleDayClick(day)}
                        className={`min-h-[80px] p-2 border-b border-r border-border/50 cursor-pointer transition-colors relative flex flex-col items-center justify-center gap-1 ${isAvailable ? 'bg-secondary/10 hover:bg-secondary/20' : 'bg-transparent hover:bg-slate-100'}`}
                      >
                        <span className={`font-mono text-sm w-7 h-7 flex items-center justify-center rounded-full ${isAvailable ? 'bg-secondary text-white' : 'text-primary/70'}`}>
                          {day}
                        </span>
                        {isAvailable && (
                          <div className="flex flex-col w-full px-1 items-center gap-1 mt-1">
                            <span className="font-mono text-[9px] uppercase tracking-wider text-secondary text-center leading-tight">
                              {doctorName}
                            </span>
                            <div className="flex flex-col w-full gap-0.5 items-center">
                              {existingSchedule.timeSlots?.length > 0 ? (
                                existingSchedule.timeSlots.map((time, idx) => (
                                  <span key={idx} className="font-body text-[8px] bg-secondary/20 text-secondary px-1 py-0.5 rounded-sm whitespace-nowrap w-full text-center">
                                    {time}
                                  </span>
                                ))
                              ) : (
                                <span className="font-body text-[8px] bg-accent/10 text-accent px-1 py-0.5 rounded-sm whitespace-nowrap w-full text-center">
                                  No slots
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
                    <div key={`pad-end-${i}`} className="min-h-[80px] p-2 border-b border-r border-border/50 bg-transparent"></div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>

      <DoctorEditModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editingDoctor={editingDoctor}
        formData={formData}
        setFormData={setFormData}
        formError={formError}
        formLoading={formLoading}
        handleFormChange={handleFormChange}
        handleSaveDoctor={handleSaveDoctor}
        handleDeleteDoctor={handleDeleteDoctor}
      />

      <AdminScheduleModal 
        scheduleModalOpen={scheduleModalOpen}
        setScheduleModalOpen={setScheduleModalOpen}
        scheduleModalData={scheduleModalData}
        setScheduleModalData={setScheduleModalData}
        customTime={customTime}
        setCustomTime={setCustomTime}
        DEFAULT_TIME_SLOTS={DEFAULT_TIME_SLOTS}
        isSaving={isSaving}
        handleApplyScheduleModal={handleApplyScheduleModal}
      />
    </div>
  )
}
