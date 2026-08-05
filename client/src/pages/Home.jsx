import Hero from '../components/Hero.jsx'
import NewsSection, { defaultNews } from '../components/NewsSection.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { useState } from 'react'

export default function Home() {
  const [lightboxImage, setLightboxImage] = useState(null)
  const featuredNews = defaultNews.find((n) => n.featured) || defaultNews[0];

  return (
    <div className="relative min-h-screen bg-cream">
      {/* ── #home: Hero ── */}
      <Hero onImageClick={setLightboxImage} featuredNews={featuredNews} />

      {/* ── #news: News & Updates ── */}
      <NewsSection />

      {/* Lightbox Overlay */}
      <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  )
}
