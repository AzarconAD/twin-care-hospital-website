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

export async function createDoctor(doctorData) {
  const res = await fetch(`${API_BASE}/api/admin/doctors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doctorData),
    credentials: 'include'
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to create doctor')
  return data
}

export async function updateDoctor(id, doctorData) {
  const res = await fetch(`${API_BASE}/api/admin/doctors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doctorData),
    credentials: 'include'
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update doctor')
  return data
}

export async function deleteDoctor(id) {
  const res = await fetch(`${API_BASE}/api/admin/doctors/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to delete doctor')
  return data
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

// ── Admin helpers ─────────────────────────────────────────────────────────────
// All admin requests include credentials: 'include' so the browser sends
// the session cookie on cross-origin requests (localhost:5173 → localhost:5000).
// Without this option the cookie is silently dropped and auth never works.

/**
 * checkAdminSession()
 * Checks whether the current browser session is authenticated.
 * Returns: { authenticated: true } or { authenticated: false }
 * Never throws — always returns a value.
 */
export async function checkAdminSession() {
  const res = await fetch(`${API_BASE}/api/admin/me`, {
    credentials: 'include',
  })
  if (!res.ok) return { authenticated: false }
  return res.json()
}

/**
 * adminLogin(username, password)
 * Posts credentials to the login route.
 * Returns: { success: true } on success.
 * Throws an Error (with the server's message) on failure.
 */
export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Login failed.')
  }
  return res.json()
}

/**
 * adminLogout()
 * Destroys the session on the server and clears the cookie.
 * Returns: { success: true }
 */
export async function adminLogout() {
  const res = await fetch(`${API_BASE}/api/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Logout failed.')
  return res.json()
}

/**
 * getContacts()
 * Fetches all contact submissions (admin only).
 * Returns: [{ _id, name, email, message, submittedAt }, ...]
 * Throws if not authenticated or fetch fails.
 */
export async function getContacts() {
  const res = await fetch(`${API_BASE}/api/admin/contacts`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Failed to fetch contacts (status ${res.status})`)
  return res.json()
}

/**
 * getSchedule()
 * Fetches all schedule entries.
 */
export async function getSchedule() {
  const res = await fetch(`${API_BASE}/api/schedule`)
  if (!res.ok) throw new Error(`Failed to fetch schedule (status ${res.status})`)
  return res.json()
}

/**
 * addScheduleEntry(doctorId, date)
 * Adds a new schedule entry.
 */
export async function addScheduleEntry(doctorId, date) {
  const res = await fetch(`${API_BASE}/api/admin/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ doctorId, date }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to add schedule entry.')
  }
  return res.json()
}

/**
 * removeScheduleEntry(id)
 * Removes a schedule entry.
 */
export async function removeScheduleEntry(id) {
  const res = await fetch(`${API_BASE}/api/admin/schedule/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Failed to remove schedule entry.')
  }
  return res.json()
}
