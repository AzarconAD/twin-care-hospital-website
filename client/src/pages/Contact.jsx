import { useState } from 'react'
import { submitContact } from '../api/index.js'

const initialForm = { name: '', email: '', message: '' }

/**
 * Contact page — /contact
 *
 * Shows a contact form and hospital info panel side by side.
 * On submit, calls submitContact() from src/api/index.js which posts
 * to POST /api/contact. The backend saves the inquiry to MongoDB and
 * optionally sends a notification email.
 */
export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')

    try {
      // submitContact() is defined in src/api/index.js — it posts to /api/contact
      await submitContact(form)
      setStatus('sent')
      setForm(initialForm)
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-secondary">Get in Touch</p>
      <h1 className="mt-1 font-display text-4xl font-semibold text-primary">Contact Us</h1>
      <p className="mt-3 max-w-lg text-ink/70">
        Send us a message and our team will get back to you within one business day.
        For emergencies, please call the hotline above instead of using this form.
      </p>

      <div className="mt-10 grid gap-10 md:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-ink">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-primary/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-primary/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-ink">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-primary/20 px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'sent' && (
            <p className="text-sm text-primary">Message sent — thank you! We'll be in touch.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-600">
              Something went wrong. Is the backend server running? Try again in a moment.
            </p>
          )}
        </form>

        <div className="font-mono text-sm">
          <p className="uppercase tracking-wide text-secondary">Visit / Call</p>
          <ul className="mt-3 space-y-2 text-ink/80">
            <li>123 Health Street, Quezon City</li>
            <li>Trunkline: (02) 8888-0000</li>
            <li>Emergency: 24/7</li>
            <li>info@twincarehospital.ph</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
