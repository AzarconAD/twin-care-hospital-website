import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Phone } from 'lucide-react'
import { checkAdminSession, adminLogout, getAppointments, updateAppointmentStatus, getDoctors, replyToAppointment, markAppointmentAsRead } from '../api/index.js'
import AdminHeader from '../components/admin/AdminHeader.jsx'
import AppointmentReplyModal from '../components/admin/AppointmentReplyModal.jsx'

export default function AdminAppointments() {
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [doctorsMap, setDoctorsMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null) // ID of appointment being updated

  const [adminEmail, setAdminEmail] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [replyStatus, setReplyStatus] = useState(null)

  useEffect(() => {
    checkAdminSession()
      .then(({ authenticated, adminEmail }) => {
        if (!authenticated) {
          navigate('/admin/login', { replace: true })
          return
        }
        setAdminEmail(adminEmail)
        
        // Fetch doctors and appointments concurrently
        return Promise.all([
          getDoctors(),
          getAppointments()
        ])
      })
      .then((data) => {
        if (data) {
          const [doctors, appts] = data
          
          // Map doctors by ID for easy lookup
          const dMap = {}
          doctors.forEach(d => {
            dMap[d._id] = d
          })
          setDoctorsMap(dMap)
          
          setAppointments(appts)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [navigate])

  const handleLogout = async () => {
    try {
      await adminLogout()
    } catch {
      // ignore
    }
    navigate('/admin/login', { replace: true })
  }

  const handleStatusChange = async (id, newStatus) => {
    setStatusUpdateLoading(id)
    try {
      const updatedAppt = await updateAppointmentStatus(id, newStatus)
      setAppointments(prev => prev.map(a => a._id === id ? updatedAppt : a))
    } catch (err) {
      alert("Failed to update status: " + err.message)
    } finally {
      setStatusUpdateLoading(null)
    }
  }

  const openModal = async (appt) => {
    setSelectedAppointment(appt)
    setReplyMessage('')
    setReplyStatus(null)

    if (!appt.isRead) {
      try {
        await markAppointmentAsRead(appt._id)
        setAppointments(prev => prev.map(a => 
          a._id === appt._id ? { ...a, isRead: true } : a
        ))
      } catch (err) {
        console.error('Failed to mark appointment as read:', err)
      }
    }
  }

  const closeModal = () => {
    setSelectedAppointment(null)
    setReplyMessage('')
    setReplyStatus(null)
  }

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedAppointment) return
    setIsReplying(true)
    setReplyStatus(null)
    try {
      await new Promise(r => setTimeout(r, 600))
      await replyToAppointment(selectedAppointment._id, replyMessage)
      setReplyStatus({ type: 'success', message: 'Reply sent successfully! (Check terminal if SMTP not configured)' })
      setTimeout(() => {
        closeModal()
      }, 2000)
    } catch (err) {
      setReplyStatus({ type: 'error', message: err.message })
    } finally {
      setIsReplying(false)
    }
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('en-PH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-secondary bg-secondary/10'
      case 'cancelled': return 'text-accent bg-accent/10'
      default: return 'text-primary bg-primary/10'
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminHeader handleLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h2 className="font-display text-2xl text-primary mb-1">Appointment Requests</h2>
          <p className="font-body text-sm text-primary/60">
            Manage patient appointment requests and their statuses.
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

        {!loading && !error && appointments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white/40 border-2 border-dashed border-primary/20 rounded-2xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Calendar size={28} className="text-primary/40" />
            </div>
            <p className="font-display text-xl text-primary/80 mb-1">No appointments found</p>
            <p className="font-body text-sm text-primary/50 text-center max-w-sm">
              When patients request appointments, they will appear here.
            </p>
          </div>
        )}

        {!loading && !error && appointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-border rounded-2xl shadow-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-primary/5">
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">
                      <span className="flex items-center gap-1.5"><User size={12} /> Name</span>
                    </th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">
                      <span className="flex items-center gap-1.5"><User size={12} /> Doctor</span>
                    </th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> Submitted</span>
                    </th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt, i) => {
                    const doc = doctorsMap[appt.doctorId]
                    return (
                      <tr
                        key={appt._id}
                        onClick={() => openModal(appt)}
                        className="border-b border-border last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer bg-white"
                      >
                        <td className="px-5 py-4 font-body text-ink whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${!appt.isRead ? 'bg-primary' : 'bg-transparent'}`} />
                            <span className={!appt.isRead ? 'font-bold' : 'font-medium'}>{appt.patientName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-body text-primary/70 whitespace-nowrap">
                          {doc ? `${doc.name}` : 'Unknown Doctor'}
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-primary/50 whitespace-nowrap">
                          {formatDate(appt.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={appt.status}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => handleStatusChange(appt._id, e.target.value)}
                            disabled={statusUpdateLoading === appt._id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 ${getStatusColor(appt.status)} ${statusUpdateLoading === appt._id ? 'opacity-50' : ''}`}
                          >
                            <option value="pending">PENDING</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-4 border-t border-border bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary/10 text-primary font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                  {appointments.length}
                </span>
                <p className="font-mono text-xs uppercase tracking-wider text-primary/70 font-semibold">
                  {appointments.length === 1 ? 'Request Total' : 'Requests Total'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <AppointmentReplyModal 
        selectedAppointment={selectedAppointment}
        closeModal={closeModal}
        formatDate={formatDate}
        adminEmail={adminEmail}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
        isReplying={isReplying}
        replyStatus={replyStatus}
        handleReply={handleReply}
        doctorName={selectedAppointment && doctorsMap[selectedAppointment.doctorId] ? doctorsMap[selectedAppointment.doctorId].name : 'Unknown Doctor'}
      />
    </div>
  )
}
