import { Router } from 'express'
import nodemailer from 'nodemailer'

const router = Router()

// Reused across requests instead of recreating it every time.
const transporter = nodemailer.createTransport({
  service: 'gmail', // swap this if the hospital uses a different email provider
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
})

router.post('/', async (req, res) => {
  const { name, email, message } = req.body

  // Basic validation — keep it simple, expand later if needed
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are all required.' })
  }

  try {
    await transporter.sendMail({
      from: `"Twin Care Hospital Website" <${process.env.SMTP_EMAIL}>`,
      to: process.env.HOSPITAL_INBOX_EMAIL,
      replyTo: email,
      subject: `New website inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    })

    res.status(200).json({ success: true })
  } catch (err) {
    console.error('Failed to send email:', err)
    res.status(500).json({ error: 'Failed to send message. Please try again later.' })
  }
})

export default router
