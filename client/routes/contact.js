import { Router } from 'express'
import nodemailer from 'nodemailer'
import Contact from '../models/Contact.js'

const router = Router()

/**
 * POST /api/contact
 *
 * Accepts a contact form submission and does two things:
 *   1. Saves the inquiry to MongoDB (always — this is the permanent record)
 *   2. Sends a notification email via Nodemailer (optional — if SMTP credentials
 *      aren't configured in .env, we log a warning but still return success,
 *      because the data is already safely saved in the database)
 *
 * Request body: { name: string, email: string, message: string }
 */
router.post('/', async (req, res) => {
  const { name, email, message } = req.body

  // Basic validation — all three fields are required
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are all required.' })
  }

  // ── Step 1: Save to MongoDB ───────────────────────────────────────────────
  // We do this first so the inquiry is recorded even if the email step fails.
  try {
    const inquiry = new Contact({ name, email, message })
    await inquiry.save()
  } catch (dbErr) {
    // If the database write fails, stop here and tell the client.
    console.error('Failed to save contact inquiry to MongoDB:', dbErr)
    return res.status(500).json({ error: 'Failed to submit your message. Please try again.' })
  }

  // ── Step 2: Send notification email (optional) ───────────────────────────
  // If SMTP_EMAIL or SMTP_PASSWORD aren't set in .env, we skip this step
  // gracefully — the inquiry is already saved in the database above.
  if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // swap this if the hospital uses a different email provider
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    try {
      await transporter.sendMail({
        from: `"Twin Care Hospital Website" <${process.env.SMTP_EMAIL}>`,
        to: process.env.HOSPITAL_INBOX_EMAIL,
        replyTo: email,
        subject: `New website inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      })
    } catch (emailErr) {
      // Log the email failure but don't fail the request —
      // the inquiry is already saved in MongoDB.
      console.warn('Email delivery failed (inquiry was still saved to DB):', emailErr.message)
    }
  } else {
    console.warn(
      'SMTP_EMAIL / SMTP_PASSWORD not set in .env — skipping email notification. ' +
      'The inquiry was saved to MongoDB.'
    )
  }

  res.status(200).json({ success: true })
})

export default router
