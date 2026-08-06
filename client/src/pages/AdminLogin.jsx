import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, User, LogIn } from 'lucide-react'
import { checkAdminSession, adminLogin } from '../api/index.js'

/**
 * AdminLogin
 *
 * Standalone page — no Navbar or Footer.
 * On mount: checks if already authenticated → redirects to dashboard.
 * On submit: calls adminLogin() → redirects to dashboard on success,
 *            shows generic error on failure.
 */
export default function AdminLogin() {
  const navigate = useNavigate()

  const [form, setForm]       = useState({ username: '', password: '' })
  const [status, setStatus]   = useState('idle') // idle | loading | error
  const [errorMsg, setErrorMsg] = useState('')

  // If there's already a valid session, skip the login screen entirely.
  useEffect(() => {
    checkAdminSession().then(({ authenticated }) => {
      if (authenticated) navigate('/admin/dashboard', { replace: true })
    })
  }, [navigate])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await adminLogin(form.username, form.password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      // Show the server's message (always "Invalid credentials." for wrong
      // username OR wrong password — never reveals which was wrong).
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-cream bg-[url('/news-bg-pattern.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4">
              <Lock size={24} color="white" />
            </div>
            <h1 className="font-display text-3xl text-primary mb-1">Admin Login</h1>
            <p className="font-body text-sm text-primary/60">Twin Care Hospital Dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="admin-username"
                className="block font-body text-xs font-medium text-ink/70 mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  id="admin-username"
                  type="text"
                  name="username"
                  required
                  autoComplete="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="admin"
                  className="w-full border border-border rounded-lg pl-9 pr-3 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="admin-password"
                className="block font-body text-xs font-medium text-ink/70 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
                <input
                  id="admin-password"
                  type="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full border border-border rounded-lg pl-9 pr-3 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Error message */}
            {status === 'error' && (
              <p className="font-body text-sm text-accent">{errorMsg}</p>
            )}

            {/* Submit */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={status === 'loading'}
              className="main-button w-full flex items-center justify-center gap-2 font-body text-sm font-semibold py-3 rounded-full transition-all duration-200 active:scale-95 disabled:opacity-60"
            >
              <LogIn size={16} />
              {status === 'loading' ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center font-body text-xs text-primary/40 mt-6 pt-6 border-t border-border">
            This page is for hospital staff only.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
