import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Mail, User, MessageSquare, Clock, ShieldCheck, X, Loader2, Trash2 } from 'lucide-react'
import { 
  checkAdminSession, 
  adminLogout, 
  getContacts, 
  getTrashContacts,
  replyToContact, 
  markContactAsRead, 
  deleteContact,
  restoreContact,
  permanentDeleteContact
} from '../api/index.js'
import AdminHeader from '../components/admin/AdminHeader.jsx'
import ContactReplyModal from '../components/admin/ContactReplyModal.jsx'

/**
 * AdminDashboard
 *
 * Standalone page — no Navbar or Footer.
 * On mount: verifies session is valid → redirects to login if not.
 * Fetches all contact form submissions and displays them in a table.
 * Logout button destroys the session and redirects to /admin/login.
 */
export default function AdminDashboard() {
  const navigate = useNavigate()
  const location = useLocation()

  const [view, setView] = useState('inbox')
  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [replyStatus, setReplyStatus] = useState(null)
  const [adminEmail, setAdminEmail] = useState('')

  const fetchContacts = (currentView = view) => {
    setLoading(true)
    setError(null)
    const fetchFn = currentView === 'trash' ? getTrashContacts : getContacts
    fetchFn()
      .then(data => {
        setContacts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }

  const openModal = async (contact) => {
    setSelectedContact(contact)
    setReplyMessage('')
    setReplyStatus(null)

    if (!contact.isRead && view === 'inbox') {
      // Optimistically update local state
      setContacts((prev) =>
        prev.map((c) => (c._id === contact._id ? { ...c, isRead: true } : c))
      )
      // Call API in the background
      try {
        await markContactAsRead(contact._id)
      } catch (err) {
        console.error('Failed to mark contact as read:', err)
      }
    }
  }

  const closeModal = () => {
    setSelectedContact(null)
    setReplyMessage('')
    setReplyStatus(null)
    setIsDeleting(false)
    setIsReplying(false)
  }

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedContact) return
    setIsReplying(true)
    setReplyStatus(null)
    try {
      // Artificial minimum delay so the loading animation is visible 
      // even when the backend mock returns instantly
      await new Promise(r => setTimeout(r, 600))
      
      await replyToContact(selectedContact._id, replyMessage)
      setReplyStatus({ type: 'success', message: 'Reply sent successfully! (Check terminal if SMTP not configured)' })
      setContacts((prev) => prev.filter((c) => c._id !== selectedContact._id))
      setTimeout(() => {
        closeModal()
      }, 2000)
    } catch (err) {
      setReplyStatus({ type: 'error', message: err.message })
    } finally {
      setIsReplying(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedContact || !window.confirm('Move this message to the trash?')) return
    setIsDeleting(true)
    setReplyStatus(null)
    try {
      await deleteContact(selectedContact._id)
      setContacts((prev) => prev.filter((c) => c._id !== selectedContact._id))
      closeModal()
    } catch (err) {
      setReplyStatus({ type: 'error', message: err.message })
      setIsDeleting(false)
    }
  }

  const handleRestore = async () => {
    if (!selectedContact) return
    setIsReplying(true) // Reuse loader state
    setReplyStatus(null)
    try {
      await restoreContact(selectedContact._id)
      setContacts((prev) => prev.filter((c) => c._id !== selectedContact._id))
      closeModal()
    } catch (err) {
      setReplyStatus({ type: 'error', message: err.message })
      setIsReplying(false)
    }
  }

  const handlePermanentDelete = async () => {
    if (!selectedContact || !window.confirm('Are you sure you want to PERMANENTLY delete this message? This cannot be undone.')) return
    setIsDeleting(true)
    setReplyStatus(null)
    try {
      await permanentDeleteContact(selectedContact._id)
      setContacts((prev) => prev.filter((c) => c._id !== selectedContact._id))
      closeModal()
    } catch (err) {
      setReplyStatus({ type: 'error', message: err.message })
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    // First check the session — if not authenticated, redirect immediately.
    checkAdminSession()
      .then(({ authenticated, adminEmail }) => {
        if (!authenticated) {
          navigate('/admin/login', { replace: true })
          return
        }
        setAdminEmail(adminEmail)
        fetchContacts()
      })
      .catch((err) => setError(err.message))
  }, [navigate])

  // Refetch when view changes if already authenticated
  useEffect(() => {
    if (adminEmail) {
      fetchContacts(view)
    }
  }, [view])

  const handleLogout = async () => {
    try {
      await adminLogout()
    } catch {
      // Even if logout fails on the server, redirect to login —
      // the session will eventually expire on its own.
    }
    navigate('/admin/login', { replace: true })
  }

  // Format a submittedAt ISO string to a readable local date/time
  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('en-PH', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top bar */}
      <AdminHeader handleLogout={handleLogout} />

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h2 className="font-display text-2xl text-primary mb-1">Messages</h2>
            <p className="font-body text-sm text-primary/60">
              {view === 'inbox' 
                ? 'All messages submitted through the public contact form, newest first.' 
                : 'Deleted messages. You can restore them or permanently delete them.'}
            </p>
          </div>
          
          <div className="flex bg-slate-200/50 border border-border p-1 rounded-xl">
            <button 
              onClick={() => setView('inbox')}
              className={`px-4 py-1.5 rounded-lg font-body text-sm transition-colors ${view === 'inbox' ? 'bg-primary text-white shadow-sm' : 'text-primary/60 hover:text-primary hover:bg-slate-200/50'}`}
            >
              Inbox
            </button>
            <button 
              onClick={() => setView('trash')}
              className={`px-4 py-1.5 rounded-lg font-body text-sm transition-colors ${view === 'trash' ? 'bg-primary text-white shadow-sm' : 'text-primary/60 hover:text-primary hover:bg-slate-200/50'}`}
            >
              Trash
            </button>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4 text-primary/40">
              <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-secondary animate-spin" />
              <p className="font-mono text-xs uppercase tracking-widest">Loading…</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl px-5 py-4 text-accent font-body text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && contacts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white/40 border-2 border-dashed border-primary/20 rounded-2xl">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <MessageSquare size={28} className="text-primary/40" />
            </div>
            <p className="font-display text-xl text-primary/80 mb-1">No messages found</p>
            <p className="font-body text-sm text-primary/50 text-center max-w-sm">
              {view === 'inbox' ? 'When users submit contact forms, they will appear here.' : 'There are no deleted messages in the trash bin.'}
            </p>
          </div>
        )}

        {/* Submissions table */}
        {!loading && !error && contacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-border rounded-2xl shadow-md overflow-hidden"
          >
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-primary/5">
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">
                      <span className="flex items-center gap-1.5"><User size={12} /> Name</span>
                    </th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">
                      <span className="flex items-center gap-1.5"><Mail size={12} /> Email</span>
                    </th>
                    <th className="text-left font-mono text-[10px] uppercase tracking-wider text-primary/50 px-5 py-3">
                      <span className="flex items-center gap-1.5"><Clock size={12} /> Submitted</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c, i) => (
                    <tr
                      key={c._id}
                      onClick={() => openModal(c)}
                      className="border-b border-border last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer bg-white"
                    >
                      <td className="px-5 py-4 font-body text-ink whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${!c.isRead && view === 'inbox' ? 'bg-primary' : 'bg-transparent'}`} />
                          <span className={c.isRead || view === 'trash' ? 'font-medium opacity-80' : 'font-bold'}>{c.name}</span>
                        </div>
                      </td>
                      <td className={`px-5 py-4 font-body ${c.isRead || view === 'trash' ? 'text-primary/70' : 'text-primary font-medium'}`}>
                        <a href={`mailto:${c.email}`} onClick={(e) => e.stopPropagation()} className="hover:text-secondary transition-colors">
                          {c.email}
                        </a>
                      </td>
                      <td className={`px-5 py-4 font-mono text-xs whitespace-nowrap ${c.isRead || view === 'trash' ? 'text-primary/50' : 'text-primary/80 font-medium'}`}>
                        {formatDate(c.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden divide-y divide-border">
              {contacts.map((c) => (
                <div 
                  key={c._id} 
                  onClick={() => openModal(c)}
                  className="p-5 space-y-2 cursor-pointer hover:bg-slate-50 transition-colors bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${!c.isRead && view === 'inbox' ? 'bg-primary' : 'bg-transparent'}`} />
                    <div className="flex-1 flex items-center justify-between">
                      <span className={`font-display text-base text-ink ${!c.isRead && view === 'inbox' ? 'font-bold' : ''}`}>{c.name}</span>
                      <span className={`font-mono text-[10px] ${!c.isRead && view === 'inbox' ? 'text-primary/80 font-medium' : 'text-primary/40'}`}>{formatDate(c.submittedAt)}</span>
                    </div>
                  </div>
                  <a
                    href={`mailto:${c.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`font-body text-sm block pl-5 ${!c.isRead && view === 'inbox' ? 'text-secondary font-medium' : 'text-secondary'}`}
                  >
                    {c.email}
                  </a>
                </div>
              ))}
            </div>

            {/* Row count footer */}
            <div className="px-5 py-4 border-t border-border bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center bg-primary/10 text-primary font-mono text-xs font-bold px-2.5 py-1 rounded-md">
                  {contacts.length}
                </span>
                <p className="font-mono text-xs uppercase tracking-wider text-primary/70 font-semibold">
                  {contacts.length === 1 ? 'Message Total' : 'Messages Total'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      <ContactReplyModal 
        view={view}
        selectedContact={selectedContact}
        closeModal={closeModal}
        formatDate={formatDate}
        adminEmail={adminEmail}
        replyMessage={replyMessage}
        setReplyMessage={setReplyMessage}
        isReplying={isReplying}
        isDeleting={isDeleting}
        replyStatus={replyStatus}
        handleReply={handleReply}
        handleDelete={handleDelete}
        handleRestore={handleRestore}
        handlePermanentDelete={handlePermanentDelete}
      />
    </div>
  )
}
