import { useState } from 'react'
import ServicesSection from '../components/ServicesSection.jsx'
import Lightbox from '../components/Lightbox.jsx'

export default function Services() {
  const [lightboxImage, setLightboxImage] = useState(null)

  return (
    <div className="relative min-h-screen bg-cream pt-20">
      <ServicesSection onImageClick={setLightboxImage} />
      <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  )
}
