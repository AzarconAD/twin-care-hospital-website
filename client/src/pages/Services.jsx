import { useState, useEffect } from 'react'
import ServicesSection from '../components/services/ServicesSection.jsx'
import Lightbox from '../components/ui/Lightbox.jsx'
import { getServices } from '../api/index.js'

export default function Services() {
  const [lightboxImage, setLightboxImage] = useState(null)

  // ── API state ────────────────────────────────────────────────────────────────
  const [services, setServices] = useState([])   // filled once the fetch resolves
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  // Fetch services from the Express API when the page first mounts.
  // The API helper (src/api/index.js) reads VITE_API_URL from .env so we
  // never hardcode the backend URL here.
  useEffect(() => {
    getServices()
      .then((data) => setServices(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // ── Loading state ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative min-h-screen bg-cream flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4 text-primary/60">
          {/* Simple spinner using Tailwind's animate-spin */}
          <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-secondary animate-spin" />
          <p className="font-mono text-sm uppercase tracking-widest">Loading services…</p>
        </div>
      </div>
    )
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="relative min-h-screen bg-cream flex items-center justify-center pt-20">
        <div className="text-center max-w-sm px-6">
          <p className="font-display text-2xl text-accent mb-2">Couldn't load services</p>
          <p className="font-body text-sm text-primary/60">{error}</p>
          <p className="font-body text-sm text-primary/40 mt-2">Make sure the server is running and your .env is configured.</p>
        </div>
      </div>
    )
  }

  // ── Success state — pass API data into ServicesSection ────────────────────
  return (
    <div className="relative min-h-screen bg-cream pt-20">
      <ServicesSection services={services} onImageClick={setLightboxImage} />
      <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  )
}
