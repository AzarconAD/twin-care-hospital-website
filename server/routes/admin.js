import { Router } from 'express'
import bcrypt from 'bcryptjs'
import nodemailer from 'nodemailer'
import Admin from '../models/Admin.js'
import Contact from '../models/Contact.js'
import Schedule from '../models/Schedule.js'
import { requireAuth } from '../middleware/requireAuth.js'
import Doctor from '../models/Doctor.js'
import Appointment from '../models/Appointment.js'

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
 * Returns { authenticated: true, adminEmail: string } if a valid session exists, false otherwise.
 * Never returns a 401 — always a 200 — so the frontend can branch on the value.
 */
router.get('/me', (req, res) => {
  res.json({ 
    authenticated: !!req.session?.adminId,
    adminEmail: process.env.ADMIN_EMAIL || 'admin@twincarehospital.com'
  })
})

/**
 * GET /api/admin/contacts
 *
 * Protected by requireAuth — returns all contact submissions, newest first.
 * Used by the admin dashboard to display the submissions table.
 */
router.get('/contacts', requireAuth, async (req, res) => {
  try {
    const contacts = await Contact.find({ isDeleted: false }).sort({ submittedAt: -1 })
    res.json(contacts)
  } catch (err) {
    console.error('Error fetching contacts:', err)
    res.status(500).json({ error: 'Failed to fetch contact submissions.' })
  }
})

/**
 * GET /api/admin/contacts/trash
 *
 * Protected by requireAuth — returns all soft-deleted contact submissions.
 */
router.get('/contacts/trash', requireAuth, async (req, res) => {
  try {
    const contacts = await Contact.find({ isDeleted: true }).sort({ submittedAt: -1 })
    res.json(contacts)
  } catch (err) {
    console.error('Error fetching trashed contacts:', err)
    res.status(500).json({ error: 'Failed to fetch trashed contact submissions.' })
  }
})

/**
 * POST /api/admin/contacts/:id/reply
 *
 * Protected by requireAuth — replies to a contact submission via email.
 */
router.post('/contacts/:id/reply', requireAuth, async (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Reply message is required.' })
  }

  try {
    const contact = await Contact.findById(req.params.id)
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found.' })
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@twincarehospital.com'
    
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      })

      await transporter.sendMail({
        from: adminEmail,
        to: contact.email,
        subject: `Re: Your inquiry to Twin Care Hospital`,
        text: message
      })
    } else {
      console.log(`[Mock Email] Setup SMTP_EMAIL and SMTP_PASSWORD in .env to send real emails.`)
      console.log(`[Mock Email] To: ${contact.email}, From: ${adminEmail}`)
      console.log(`[Mock Email] Message:\n${message}`)
    }

    // Soft-delete the submission after a successful reply to move it to the trash bin
    await Contact.findByIdAndUpdate(req.params.id, { isDeleted: true })

    res.json({ success: true })
  } catch (err) {
    console.error('Error replying to contact:', err)
    res.status(500).json({ error: 'Failed to reply to contact.' })
  }
})

/**
 * PATCH /api/admin/contacts/:id/read
 *
 * Protected by requireAuth — marks a contact submission as read.
 */
router.patch('/contacts/:id/read', requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    )
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found.' })
    }
    res.json(contact)
  } catch (err) {
    console.error('Error marking contact as read:', err)
    res.status(500).json({ error: 'Failed to mark contact as read.' })
  }
})

/**
 * DELETE /api/admin/contacts/:id
 *
 * Protected by requireAuth — soft-deletes a contact submission (moves to trash).
 */
router.delete('/contacts/:id', requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true })
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found.' })
    }
    res.json({ success: true })
  } catch (err) {
    console.error('Error deleting contact:', err)
    res.status(500).json({ error: 'Failed to delete contact.' })
  }
})

/**
 * PATCH /api/admin/contacts/:id/restore
 *
 * Protected by requireAuth — restores a soft-deleted contact submission from the trash.
 */
router.patch('/contacts/:id/restore', requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isDeleted: false }, { new: true })
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found.' })
    }
    res.json({ success: true })
  } catch (err) {
    console.error('Error restoring contact:', err)
    res.status(500).json({ error: 'Failed to restore contact.' })
  }
})

/**
 * DELETE /api/admin/contacts/:id/permanent
 *
 * Protected by requireAuth — permanently deletes a contact submission.
 */
router.delete('/contacts/:id/permanent', requireAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found.' })
    }
    res.json({ success: true })
  } catch (err) {
    console.error('Error permanently deleting contact:', err)
    res.status(500).json({ error: 'Failed to permanently delete contact.' })
  }
})

/**
 * POST /api/admin/schedule
 *
 * Protected by requireAuth — adds one availability entry for a doctor.
 */
router.post('/schedule', requireAuth, async (req, res) => {
  const { doctorId, date, timeSlots } = req.body

  if (!doctorId || !date) {
    return res.status(400).json({ error: 'doctorId and date are required.' })
  }

  try {
    const newSchedule = new Schedule({ 
      doctorId, 
      date, 
      timeSlots: timeSlots || [] 
    })
    await newSchedule.save()
    res.status(201).json(newSchedule)
  } catch (err) {
    console.error('Error adding schedule entry:', err)
    // Handle duplicate key error (11000) gracefully
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Schedule entry already exists for this date.' })
    }
    res.status(500).json({ error: 'Failed to add schedule entry.' })
  }
})

/**
 * PUT /api/admin/schedule/:id
 *
 * Protected by requireAuth — updates an existing availability entry (e.g. modifying time slots).
 */
router.put('/schedule/:id', requireAuth, async (req, res) => {
  const { timeSlots } = req.body

  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { timeSlots: timeSlots || [] },
      { new: true, runValidators: true }
    )
    if (!updatedSchedule) {
      return res.status(404).json({ error: 'Schedule entry not found.' })
    }
    res.json(updatedSchedule)
  } catch (err) {
    console.error('Error updating schedule entry:', err)
    res.status(500).json({ error: 'Failed to update schedule entry.' })
  }
})

/**
 * DELETE /api/admin/schedule/:id
 *
 * Protected by requireAuth — removes one availability entry by its MongoDB _id.
 */
router.delete('/schedule/:id', requireAuth, async (req, res) => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id)
    if (!deletedSchedule) {
      return res.status(404).json({ error: 'Schedule entry not found.' })
    }
    res.json({ success: true })
  } catch (err) {
    console.error('Error deleting schedule entry:', err)
    res.status(500).json({ error: 'Failed to delete schedule entry.' })
  }
})

/**
 * POST /api/admin/doctors
 *
 * Protected by requireAuth — creates a new doctor.
 */
router.post('/doctors', requireAuth, async (req, res) => {
  const { name, postfix, specialty, bio, photo, category } = req.body

  if (!name || !specialty || !bio || !category) {
    return res.status(400).json({ error: 'Name, specialty, bio, and category are required.' })
  }

  const validCategories = ["emergency", "wellness", "diagnostic"]
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category.' })
  }

  try {
    const newDoctor = new Doctor({ name, postfix, specialty, bio, photo, category })
    await newDoctor.save()
    res.status(201).json(newDoctor)
  } catch (err) {
    console.error('Error creating doctor:', err)
    res.status(500).json({ error: 'Failed to create doctor.' })
  }
})

/**
 * PUT /api/admin/doctors/:id
 *
 * Protected by requireAuth — updates an existing doctor.
 */
router.put('/doctors/:id', requireAuth, async (req, res) => {
  const { name, postfix, specialty, bio, photo, category } = req.body

  if (!name || !specialty || !bio || !category) {
    return res.status(400).json({ error: 'Name, specialty, bio, and category are required.' })
  }

  const validCategories = ["emergency", "wellness", "diagnostic"]
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category.' })
  }

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { name, postfix, specialty, bio, photo, category },
      { new: true, runValidators: true }
    )
    if (!updatedDoctor) {
      return res.status(404).json({ error: 'Doctor not found.' })
    }
    res.json(updatedDoctor)
  } catch (err) {
    console.error('Error updating doctor:', err)
    res.status(500).json({ error: 'Failed to update doctor.' })
  }
})

/**
 * DELETE /api/admin/doctors/:id
 *
 * Protected by requireAuth — deletes a doctor AND all their schedule entries.
 */
router.delete('/doctors/:id', requireAuth, async (req, res) => {
  try {
    // 1. Cascade delete schedule entries
    await Schedule.deleteMany({ doctorId: req.params.id })
    
    // 2. Delete the doctor
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id)
    if (!deletedDoctor) {
      return res.status(404).json({ error: 'Doctor not found.' })
    }
    
    res.json({ success: true })
  } catch (err) {
    console.error('Error deleting doctor:', err)
    res.status(500).json({ error: 'Failed to delete doctor.' })
  }
})

/**
 * GET /api/admin/appointments
 *
 * Protected by requireAuth — returns all appointments, newest first.
 * Supports optional ?status= filtering.
 */
router.get('/appointments', requireAuth, async (req, res) => {
  try {
    const query = {}
    if (req.query.status) {
      query.status = req.query.status
    }
    const appointments = await Appointment.find(query).sort({ createdAt: -1 })
    res.json(appointments)
  } catch (err) {
    console.error('Error fetching appointments:', err)
    res.status(500).json({ error: 'Failed to fetch appointments.' })
  }
})

/**
 * PATCH /api/admin/appointments/:id/status
 *
 * Protected by requireAuth — updates the status of an appointment.
 */
router.patch('/appointments/:id/status', requireAuth, async (req, res) => {
  const { status } = req.body

  if (!["pending", "confirmed", "cancelled"].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be pending, confirmed, or cancelled.' })
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' })
    }
    res.json(appointment)
  } catch (err) {
    console.error('Error updating appointment status:', err)
    res.status(500).json({ error: 'Failed to update appointment status.' })
  }
})

/**
 * PATCH /api/admin/appointments/:id/read
 *
 * Protected by requireAuth — marks an appointment as read.
 */
router.patch('/appointments/:id/read', requireAuth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true, runValidators: true }
    )
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' })
    }
    res.json(appointment)
  } catch (err) {
    console.error('Error marking appointment as read:', err)
    res.status(500).json({ error: 'Failed to mark appointment as read.' })
  }
})

/**
 * POST /api/admin/appointments/:id/reply
 *
 * Protected by requireAuth — replies to an appointment request via email.
 */
router.post('/appointments/:id/reply', requireAuth, async (req, res) => {
  const { message } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Reply message is required.' })
  }

  try {
    const appointment = await Appointment.findById(req.params.id)
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' })
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@twincarehospital.com'
    
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      })

      await transporter.sendMail({
        from: adminEmail,
        to: appointment.email,
        subject: `Re: Your Appointment Request at Twin Care Hospital`,
        text: message
      })
    } else {
      console.log(`[Mock Email] Setup SMTP_EMAIL and SMTP_PASSWORD in .env to send real emails.`)
      console.log(`[Mock Email] To: ${appointment.email}, From: ${adminEmail}`)
      console.log(`[Mock Email] Message:\n${message}`)
    }

    res.json({ success: true })
  } catch (err) {
    console.error('Error replying to appointment:', err)
    res.status(500).json({ error: 'Failed to reply to appointment.' })
  }
})

export default router
