import Hero from '../components/home/Hero.jsx'
import NewsSection from '../components/home/NewsSection.jsx'
import Lightbox from '../components/ui/Lightbox.jsx'
import { useState, useEffect } from 'react'
import { getNews } from '../api/index.js'

export default function Home() {
  const [lightboxImage, setLightboxImage] = useState(null)
  
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState(null)
  const [selectedNewsId, setSelectedNewsId] = useState(null)

  useEffect(() => {
    getNews()
      .then(data => {
        setNews(data)
      })
      .catch(err => {
        setNewsError(err.message)
      })
      .finally(() => {
        setNewsLoading(false)
      })
  }, [])



  return (
    <div className="relative min-h-screen bg-cream">
      {/* ── #home: Hero ── */}
      <Hero onImageClick={setLightboxImage} news={news} onSelectNews={setSelectedNewsId} />

      {/* ── #news: News & Updates ── */}
      <NewsSection 
        news={news} 
        loading={newsLoading} 
        error={newsError}
        selectedNewsId={selectedNewsId}
        setSelectedNewsId={setSelectedNewsId}
      />

      {/* Lightbox Overlay */}
      <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  )
}
