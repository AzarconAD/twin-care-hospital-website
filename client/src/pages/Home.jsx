import Hero from '../components/Hero.jsx'
import AboutSection from '../components/AboutSection.jsx'
import ServicesSection from '../components/ServicesSection.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { useState } from 'react'

export default function Home() {
  const [lightboxImage, setLightboxImage] = useState(null)

  return (
    <div className="relative min-h-screen bg-cream">
      {/* ── #home: Hero ── */}
      <Hero onImageClick={setLightboxImage} />

      {/* ── #about: About ── */}
      <AboutSection onImageClick={setLightboxImage} />

      {/* ── #services: Services ── */}
      <ServicesSection onImageClick={setLightboxImage} />

      {/* Lightbox Overlay */}
      <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  )
}
