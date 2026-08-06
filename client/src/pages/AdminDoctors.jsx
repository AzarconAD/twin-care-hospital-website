import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Calendar as CalendarIcon, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react'
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

  const handleApplyScheduleModal = () => {
    const { dateStr, isAvailable, timeSlots } = scheduleModalData;
    
    if (isAvailable) {
      setLocalSchedule(prev => {
        const exists = prev.some(s => s.doctorId === selectedDoctorId && s.date === dateStr);
        if (exists) {
          return prev.map(s => (s.doctorId === selectedDoctorId && s.date === dateStr) ? { ...s, timeSlots } : s);
        } else {
          return [...prev, { doctorId: selectedDoctorId, date: dateStr, timeSlots }];
        }
      });
    } else {
      setLocalSchedule(prev => prev.filter(s => !(s.doctorId === selectedDoctorId && s.date === dateStr)));
    }
    setScheduleModalOpen(false);
  };

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const toAdd = localSchedule.filter(ls => !schedule.some(s => s.doctorId === ls.doctorId && s.date === ls.date))
      const toRemove = schedule.filter(s => !localSchedule.some(ls => ls.doctorId === s.doctorId && ls.date === s.date))
      const toUpdate = localSchedule.filter(ls => {
        const existing = schedule.find(s => s.doctorId === ls.doctorId && s.date === ls.date)
        if (!existing) return false
        const existingSlots = existing.timeSlots || []
        const localSlots = ls.timeSlots || []
        if (existingSlots.length !== localSlots.length) return true
        const sortedExisting = [...existingSlots].sort()
        const sortedLocal = [...localSlots].sort()
        return sortedExisting.some((v, i) => v !== sortedLocal[i])
      })
      
      for (const rem of toRemove) {
        if (rem._id) await removeScheduleEntry(rem._id)
      }
      for (const add of toAdd) {
        await addScheduleEntry(add.doctorId, add.date, add.timeSlots)
      }
      for (const upd of toUpdate) {
        const existing = schedule.find(s => s.doctorId === upd.doctorId && s.date === upd.date)
        if (existing && existing._id) {
          await updateScheduleEntry(existing._id, upd.timeSlots)
        }
      }
      
      const freshSchedule = await getSchedule()
      setSchedule(freshSchedule)
      setLocalSchedule(freshSchedule)
      alert("Schedule saved successfully!")
    } catch (err) {
      alert(`Failed to save schedule: ${err.message}`)
    } finally {
      setIsSaving(false)
    }
  }

  // Determine if there are unsaved changes
  const hasChanges = () => {
      const toAdd = localSchedule.filter(ls => !schedule.some(s => s.doctorId === ls.doctorId && s.date === ls.date))
      const toRemove = schedule.filter(s => !localSchedule.some(ls => ls.doctorId === s.doctorId && ls.date === s.date))
      const toUpdate = localSchedule.filter(ls => {
        const existing = schedule.find(s => s.doctorId === ls.doctorId && s.date === ls.date)
        if (!existing) return false
        const existingSlots = existing.timeSlots || []
        const localSlots = ls.timeSlots || []
        if (existingSlots.length !== localSlots.length) return true
        const sortedExisting = [...existingSlots].sort()
        const sortedLocal = [...localSlots].sort()
        return sortedExisting.some((v, i) => v !== sortedLocal[i])
      })
      return toAdd.length > 0 || toRemove.length > 0 || toUpdate.length > 0;
  }

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
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck size={18} color="white" />
            </div>
            <div>
              <h1 className="font-display text-lg text-primary leading-none">Admin Dashboard</h1>
              <p className="font-mono text-[10px] uppercase tracking-wider text-primary/50 mt-0.5">
                Twin Care Hospital
              </p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center bg-cream rounded-lg p-1 border border-border">
            <Link 
              to="/admin/dashboard" 
              className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/dashboard' ? 'bg-white shadow-sm text-primary' : 'text-primary/60 hover:text-primary'}`}
            >
              Submissions
            </Link>
            <Link 
              to="/admin/doctors" 
              className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/doctors' ? 'bg-white shadow-sm text-primary' : 'text-primary/60 hover:text-primary'}`}
            >
              Doctors
            </Link>
            <Link 
              to="/admin/news" 
              className={`px-4 py-1.5 rounded-md font-body text-sm font-medium transition-colors ${location.pathname === '/admin/news' ? 'bg-white shadow-sm text-primary' : 'text-primary/60 hover:text-primary'}`}
            >
              News
            </Link>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-body text-sm text-primary/60 hover:text-accent transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

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
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden p-6"
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
                <div className="flex items-center justify-between p-4 bg-cream/60 border-b border-border flex-wrap gap-4">
                  <h3 className="font-display text-xl text-primary flex items-center gap-4">
                    <span>{MONTHS[month]} {year}</span>
                    {hasChanges() && (
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="main-button px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    )}
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
                
                <div className="grid grid-cols-7 bg-cream/30 border-b border-border">
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
                        className={`min-h-[80px] p-2 border-b border-r border-border/50 cursor-pointer transition-colors relative flex flex-col items-center justify-center gap-1 ${isAvailable ? 'bg-secondary/10 hover:bg-secondary/20' : 'bg-transparent hover:bg-cream'}`}
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

      {/* Doctor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-white z-10">
              <h3 className="font-display text-xl text-primary">
                {editingDoctor ? 'Edit Doctor' : 'Create New Doctor'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-primary/50 hover:text-primary transition-colors text-2xl leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSaveDoctor} className="p-6 flex flex-col gap-5">
              {formError && (
                <div className="bg-accent/10 border border-accent/30 rounded-lg px-4 py-3 text-accent font-body text-sm">
                  {formError}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Name *</label>
                  <input required name="name" value={formData.name} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" placeholder="e.g. Dr. Carla Mendoza" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Postfix</label>
                  <input name="postfix" value={formData.postfix} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" placeholder="e.g. MD, PhD" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Specialty *</label>
                  <input required name="specialty" value={formData.specialty} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" placeholder="e.g. Cardiology" />
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Category *</label>
                  <select required name="category" value={formData.category} onChange={handleFormChange} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary bg-white">
                    <option value="emergency">Emergency & Urgent Care</option>
                    <option value="wellness">Wellness & Preventive Care</option>
                    <option value="diagnostic">Diagnostic & Specialty Care</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Bio *</label>
                <textarea required name="bio" value={formData.bio} onChange={handleFormChange} rows={3} className="w-full p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary resize-none" placeholder="Short biography..." />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-primary/50 mb-1.5">Photo URL</label>
                <div className="flex items-start gap-4">
                  <input name="photo" value={formData.photo} onChange={handleFormChange} className="flex-1 p-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-secondary" placeholder="https://..." />
                  {formData.photo && (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-secondary/20 shrink-0 bg-cream flex items-center justify-center">
                      <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4 pt-5 border-t border-border flex items-center justify-between">
                {editingDoctor ? (
                  <button type="button" onClick={handleDeleteDoctor} disabled={formLoading} className="text-accent hover:text-accent/80 font-body text-sm font-semibold transition-colors disabled:opacity-50">
                    Delete Doctor
                  </button>
                ) : <div></div>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-body text-sm text-primary/60 hover:text-primary transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={formLoading} className="main-button px-5 py-2 rounded-lg font-body text-sm font-semibold disabled:opacity-50">
                    {formLoading ? 'Saving...' : 'Save Doctor'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Time Slot Modal */}
      {scheduleModalOpen && (
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
                        className="px-4 py-2 bg-paper border border-border rounded-lg font-body text-sm text-primary hover:bg-border/30 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {scheduleModalData.timeSlots.filter(t => !DEFAULT_TIME_SLOTS.includes(t)).map(time => (
                      <div key={time} className="flex items-center gap-1 px-3 py-1 bg-ink text-white rounded-lg text-sm font-mono">
                        {time}
                        <button 
                          type="button"
                          onClick={() => setScheduleModalData(prev => ({ ...prev, timeSlots: prev.timeSlots.filter(t => t !== time) }))}
                          className="ml-1 text-white/50 hover:text-white"
                        >×</button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="p-5 border-t border-border flex items-center justify-between bg-paper">
              <div>
                {scheduleModalData.isAvailable && scheduleModalData.timeSlots.length === 0 && (
                  <span className="font-body text-xs text-accent font-medium">
                    * Please select at least one time slot
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setScheduleModalOpen(false)} 
                  className="px-4 py-2 rounded-lg font-body text-sm text-primary/60 hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleApplyScheduleModal} 
                  disabled={scheduleModalData.isAvailable && scheduleModalData.timeSlots.length === 0}
                  className="main-button px-6 py-2 rounded-lg font-body text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
