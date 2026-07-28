import Hero from '../components/Hero.jsx'
import AboutSection from '../components/AboutSection.jsx'
import ServicesSection from '../components/ServicesSection.jsx'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-paper">
      {/* ── #home: Hero ── */}
      <Hero />

      {/* ── #about: About ── */}
      <AboutSection />

      {/* ── #services: Services ── */}
      <ServicesSection />
    </div>
  )
}
