import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Phone } from 'lucide-react'
import { checkAdminSession, adminLogout, getAppointments, updateAppointmentStatus, getDoctors } from '../api/index.js'
import AdminHeader from '../components/admin/AdminHeader.jsx'

export default function AdminAppointments() {
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [doctorsMap, setDoctorsMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(null) // ID of appointment being updated

  useEffect(() => {
    checkAdminSession()
      .then(({ authenticated }) => {
        if (!authenticated) {
          navigate('/admin/login', { replace: true })
          return
        }
        
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
    <div className="min-h-screen bg-cream">
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
          <div className="text-center py-20 text-primary/40">
            <Calendar size={36} className="mx-auto mb-3 opacity-40" />
            <p className="font-body text-sm">No appointment requests yet.</p>
          </div>
        )}

        {!loading && !error && appointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-cream/60">
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">
                      <span className="flex items-center gap-1.5"><User size={12} /> Patient Info</span>
                    </th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> Request Details</span>
                    </th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">
                      Notes
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
                        className={`border-b border-border last:border-b-0 hover:bg-cream/40 transition-colors ${i % 2 === 0 ? '' : 'bg-cream/20'}`}
                      >
                        <td className="px-5 py-4">
                          <p className="font-body text-ink font-medium">{appt.patientName}</p>
                          <div className="flex items-center gap-3 mt-1 text-primary/60 text-xs">
                            <a href={`mailto:${appt.email}`} className="flex items-center gap-1 hover:text-secondary"><Mail size={10} /> {appt.email}</a>
                            <a href={`tel:${appt.phone}`} className="flex items-center gap-1 hover:text-secondary"><Phone size={10} /> {appt.phone}</a>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-body text-primary text-sm font-medium">
                            {doc ? `${doc.name}` : 'Unknown Doctor'}
                          </p>
                          <p className="font-mono text-xs text-ink/60 mt-1">
                            {appt.date} at {appt.time}
                          </p>
                          <p className="font-mono text-[10px] text-primary/40 mt-1 uppercase">
                            Submitted: {formatDate(appt.createdAt)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-body text-xs text-ink/70 max-w-xs line-clamp-2" title={appt.notes}>
                            {appt.notes || <span className="italic opacity-50">No notes</span>}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={appt.status}
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

            <div className="px-5 py-3 border-t border-border bg-cream/40">
              <p className="font-mono text-[10px] uppercase tracking-wider text-primary/40">
                {appointments.length} {appointments.length === 1 ? 'request' : 'requests'} total
              </p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
