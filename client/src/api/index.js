/**
 * src/api/index.js — Frontend API helpers
 *
 * All fetch() calls to the Express backend live here in one place.
 * Pages import the named functions they need instead of writing raw fetch URLs.
 *
 * The base URL is read from the VITE_API_URL environment variable defined in .env.
 * Vite makes any variable prefixed with VITE_ available in the browser via
 * import.meta.env — this is how we avoid hardcoding "http://localhost:5000" everywhere.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * getServices()
 * Fetches all hospital services from GET /api/services.
 * Returns: [{ _id, code, name, description }, ...]
 */
export async function getServices() {
  const res = await fetch(`${API_BASE}/api/services`)
  if (!res.ok) throw new Error(`Failed to fetch services (status ${res.status})`)
  return res.json()
}

/**
 * getDoctors()
 * Fetches all doctors from GET /api/doctors.
 * Returns: [{ _id, name, specialty, schedule }, ...]
 */
export async function getDoctors() {
  const res = await fetch(`${API_BASE}/api/doctors`)
  if (!res.ok) throw new Error(`Failed to fetch doctors (status ${res.status})`)
  return res.json()
}

/**
 * submitContact(formData)
 * Posts a contact inquiry to POST /api/contact.
 * formData: { name, email, message }
 * Returns: { success: true }
 * Throws an Error if the request fails.
 */
export async function submitContact(formData) {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to send message.')
  }
  return res.json()
}
