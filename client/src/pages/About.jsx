import { useState } from 'react'
import AboutSection from '../components/AboutSection.jsx'
import Lightbox from '../components/Lightbox.jsx'

export default function About() {
  const [lightboxImage, setLightboxImage] = useState(null)

  return (
    <div className="relative min-h-screen bg-cream pt-20">
      <AboutSection onImageClick={setLightboxImage} />
      <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  )
}
