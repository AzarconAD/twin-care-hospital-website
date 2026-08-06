import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Mail, User, MessageSquare, Clock, ShieldCheck, X } from 'lucide-react'
import { checkAdminSession, adminLogout, getContacts, replyToContact } from '../api/index.js'

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

  const [contacts, setContacts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [replyStatus, setReplyStatus] = useState(null)
  const [adminEmail, setAdminEmail] = useState('')

  const openModal = (contact) => {
    setSelectedContact(contact)
    setReplyMessage('')
    setReplyStatus(null)
  }

  const closeModal = () => {
    setSelectedContact(null)
    setReplyMessage('')
    setReplyStatus(null)
  }

  const handleReply = async () => {
    if (!replyMessage.trim() || !selectedContact) return
    setIsReplying(true)
    setReplyStatus(null)
    try {
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

  useEffect(() => {
    // First check the session — if not authenticated, redirect immediately.
    // If authenticated, fetch the contacts list.
    checkAdminSession()
      .then(({ authenticated, adminEmail }) => {
        if (!authenticated) {
          navigate('/admin/login', { replace: true })
          return
        }
        setAdminEmail(adminEmail)
        return getContacts()
      })
      .then((data) => {
        // data is undefined if the session check failed and we're navigating away
        if (data) setContacts(data)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [navigate])

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
          id="admin-logout-btn"
          onClick={handleLogout}
          className="flex items-center gap-2 font-body text-sm text-primary/60 hover:text-accent transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <h2 className="font-display text-2xl text-primary mb-1">Contact Submissions</h2>
          <p className="font-body text-sm text-primary/60">
            All messages submitted through the public contact form, newest first.
          </p>
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
          <div className="text-center py-20 text-primary/40">
            <MessageSquare size={36} className="mx-auto mb-3 opacity-40" />
            <p className="font-body text-sm">No submissions yet.</p>
          </div>
        )}

        {/* Submissions table */}
        {!loading && !error && contacts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden"
          >
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-cream/60">
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
                      className={`border-b border-border last:border-b-0 hover:bg-cream/40 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-cream/20'}`}
                    >
                      <td className="px-5 py-4 font-body text-ink font-medium whitespace-nowrap">{c.name}</td>
                      <td className="px-5 py-4 font-body text-primary/70">
                        <a href={`mailto:${c.email}`} onClick={(e) => e.stopPropagation()} className="hover:text-secondary transition-colors">
                          {c.email}
                        </a>
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-primary/50 whitespace-nowrap">
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
                  className="p-5 space-y-2 cursor-pointer hover:bg-cream/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base text-ink">{c.name}</span>
                    <span className="font-mono text-[10px] text-primary/40">{formatDate(c.submittedAt)}</span>
                  </div>
                  <a
                    href={`mailto:${c.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-body text-sm text-secondary block"
                  >
                    {c.email}
                  </a>
                </div>
              ))}
            </div>

            {/* Row count footer */}
            <div className="px-5 py-3 border-t border-border bg-cream/40">
              <p className="font-mono text-[10px] uppercase tracking-wider text-primary/40">
                {contacts.length} {contacts.length === 1 ? 'submission' : 'submissions'} total
              </p>
            </div>
          </motion.div>
        )}
      </main>

      {/* Message Modal */}
      {selectedContact && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl relative"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute top-5 right-5 text-primary/40 hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="font-display text-xl text-primary mb-1">Message from {selectedContact.name}</h3>
            <p className="font-mono text-[10px] text-primary/40 mb-4">{formatDate(selectedContact.submittedAt)} • {selectedContact.email}</p>
            
            <div className="bg-cream/30 border border-border rounded-xl p-4 font-body text-ink/80 text-sm leading-relaxed max-h-[30vh] overflow-y-auto mb-2">
              {selectedContact.message.split('\n').map((para, idx) => (
                <p key={idx} className="mb-2 last:mb-0 break-words whitespace-pre-wrap">{para || '\u00A0'}</p>
              ))}
            </div>

            {/* Reply Section */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <h4 className="font-mono text-[10px] uppercase tracking-wider text-primary/60">Reply</h4>
                {adminEmail && (
                  <span className="font-mono text-[10px] text-primary/50">
                    Replying as: <span className="font-medium text-primary/70">{adminEmail}</span>
                  </span>
                )}
              </div>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Write your response here..."
                className="w-full bg-cream/20 border border-border rounded-xl p-3 font-body text-sm text-ink focus:outline-none focus:border-primary/30 transition-colors resize-none h-24"
                disabled={isReplying}
              />
              
              {replyStatus && (
                <div className={`text-xs font-body p-2 rounded-lg ${replyStatus.type === 'error' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                  {replyStatus.message}
                </div>
              )}
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 rounded-lg font-body text-sm text-primary/60 hover:text-primary transition-colors"
                  disabled={isReplying}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={isReplying || !replyMessage.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-body text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isReplying ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
