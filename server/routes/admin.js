import { Router } from 'express'
import bcrypt from 'bcryptjs'
import Admin from '../models/Admin.js'
import Contact from '../models/Contact.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

/**
 * POST /api/admin/login
 *
 * Accepts { username, password } and starts a session on success.
 *
 * Security note: we return the SAME generic error message whether the
 * username doesn't exist OR the password is wrong. This prevents an
 * attacker from using the login form to enumerate valid usernames
 * ("user not found" vs "wrong password" would leak that information).
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' })
  }

  try {
    const admin = await Admin.findOne({ username })

    // bcrypt.compare returns false (not an error) if admin is null,
    // but we need a hash string to compare against. Use a dummy hash
    // so the timing is consistent whether or not the user exists —
    // this prevents timing-based username enumeration.
    const DUMMY_HASH = '$2a$12$invalidhashfortimingprotection000000000000000000000000'
    const hashToCompare = admin ? admin.passwordHash : DUMMY_HASH
    const passwordMatches = await bcrypt.compare(password, hashToCompare)

    if (!admin || !passwordMatches) {
      // Same message for both cases — intentional, see note above
      return res.status(401).json({ error: 'Invalid credentials.' })
    }

    // Store the admin's MongoDB _id in the session.
    // express-session will persist this to MongoDB via connect-mongo.
    req.session.adminId = admin._id
    res.json({ success: true })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed. Please try again.' })
  }
})

/**
 * POST /api/admin/logout
 *
 * Destroys the session completely (removes it from MongoDB).
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destroy error:', err)
      return res.status(500).json({ error: 'Logout failed.' })
    }
    // Clear the cookie on the client side too
    res.clearCookie('connect.sid')
    res.json({ success: true })
  })
})

/**
 * GET /api/admin/me
 *
 * Public route — used by the frontend to check auth state on page load.
 * Returns { authenticated: true } if a valid session exists, false otherwise.
 * Never returns a 401 — always a 200 — so the frontend can branch on the value.
 */
router.get('/me', (req, res) => {
  res.json({ authenticated: !!req.session?.adminId })
})

/**
 * GET /api/admin/contacts
 *
 * Protected by requireAuth — returns all contact submissions, newest first.
 * Used by the admin dashboard to display the submissions table.
 */
router.get('/contacts', requireAuth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ submittedAt: -1 })
    res.json(contacts)
  } catch (err) {
    console.error('Error fetching contacts:', err)
    res.status(500).json({ error: 'Failed to fetch contact submissions.' })
  }
})

export default router
