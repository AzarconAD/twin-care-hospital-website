import { useState } from 'react'
import AboutSection from '../components/about/AboutSection.jsx'
import Lightbox from '../components/ui/Lightbox.jsx'

export default function About() {
  const [lightboxImage, setLightboxImage] = useState(null)

  return (
    <div className="relative min-h-screen bg-cream pt-20" style={{ zoom: 0.75 }}>
      <AboutSection onImageClick={setLightboxImage} />
      <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  )
}
