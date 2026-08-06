import Hero from '../components/Hero.jsx'
import NewsSection from '../components/NewsSection.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { useState, useEffect } from 'react'
import { getNews } from '../api/index.js'

export default function Home() {
  const [lightboxImage, setLightboxImage] = useState(null)
  
  const [news, setNews] = useState([])
  const [newsLoading, setNewsLoading] = useState(true)
  const [newsError, setNewsError] = useState(null)

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

  const featuredNews = news.find((n) => n.featured) || (news.length > 0 ? news[0] : null);

  return (
    <div className="relative min-h-screen bg-cream">
      {/* ── #home: Hero ── */}
      <Hero onImageClick={setLightboxImage} featuredNews={featuredNews} />

      {/* ── #news: News & Updates ── */}
      <NewsSection news={news} loading={newsLoading} error={newsError} />

      {/* Lightbox Overlay */}
      <Lightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
    </div>
  )
}
