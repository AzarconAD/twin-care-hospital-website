import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Mail, User, MessageSquare, Clock, ShieldCheck } from 'lucide-react'
import { checkAdminSession, adminLogout, getContacts } from '../api/index.js'

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

  useEffect(() => {
    // First check the session — if not authenticated, redirect immediately.
    // If authenticated, fetch the contacts list.
    checkAdminSession()
      .then(({ authenticated }) => {
        if (!authenticated) {
          navigate('/admin/login', { replace: true })
          return
        }
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
                      <span className="flex items-center gap-1.5"><MessageSquare size={12} /> Message</span>
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
                      className={`border-b border-border last:border-b-0 hover:bg-cream/40 transition-colors ${i % 2 === 0 ? '' : 'bg-cream/20'}`}
                    >
                      <td className="px-5 py-4 font-body text-ink font-medium whitespace-nowrap">{c.name}</td>
                      <td className="px-5 py-4 font-body text-primary/70">
                        <a href={`mailto:${c.email}`} className="hover:text-secondary transition-colors">
                          {c.email}
                        </a>
                      </td>
                      <td className="px-5 py-4 font-body text-ink/70 max-w-xs">
                        {/* Truncate long messages in the table; full text is readable if the user copies */}
                        <p className="line-clamp-2 leading-relaxed">{c.message}</p>
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
                <div key={c._id} className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-base text-ink">{c.name}</span>
                    <span className="font-mono text-[10px] text-primary/40">{formatDate(c.submittedAt)}</span>
                  </div>
                  <a
                    href={`mailto:${c.email}`}
                    className="font-body text-sm text-secondary block"
                  >
                    {c.email}
                  </a>
                  <p className="font-body text-sm text-ink/70 leading-relaxed">{c.message}</p>
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
    </div>
  )
}
