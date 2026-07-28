import { useState, useEffect } from 'react'
import Button from '../components/Button.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
import AboutSection from '../components/AboutSection.jsx'
import ServicesSection from '../components/ServicesSection.jsx'
import { getServices, getDoctors } from '../api/index.js'

export default function Home() {
  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [servicesError, setServicesError] = useState(null)

  const [doctors, setDoctors] = useState([])
  const [doctorsLoading, setDoctorsLoading] = useState(true)
  const [doctorsError, setDoctorsError] = useState(null)

  useEffect(() => {
    // Fetch services and doctors in parallel when the page first loads
    getServices()
      .then((data) => { setServices(data); setServicesLoading(false) })
      .catch((err) => { console.error(err); setServicesError('Could not load services. Is the backend running?'); setServicesLoading(false) })

    getDoctors()
      .then((data) => { setDoctors(data); setDoctorsLoading(false) })
      .catch((err) => { console.error(err); setDoctorsError('Could not load doctors. Is the backend running?'); setDoctorsLoading(false) })
  }, [])

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/hospital-bg.jpg')", clipPath: 'inset(0)' }}
    >
      {/* Global 60% cream overlay */}
      <div className="absolute inset-0 bg-cream/70" />

      {/*
        Decorative circles — strictly alternating left / right so no same-side
        circles overlap each other. Positions are spaced using percentage of the
        total page height (~4 sections tall), keeping a safe gap between circles
        on the same side. Circles on opposite sides never visually overlap.
      */}

      {/* Quarter circle — top-right corner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[420px] w-[420px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #e05555 0%, #b83232 100%)' }}
      />

      {/* 1. Green — LEFT edge, hero section (~5%) */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-52 top-[5%] h-[540px] w-[540px] rounded-full opacity-35"
        style={{ background: 'radial-gradient(circle, #39bda7 0%, #1a9e8e 100%)' }} />

      {/* 2. Red — RIGHT edge, ~22% down */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-[22%] h-[560px] w-[560px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #e05555 0%, #b83232 100%)' }} />

      {/* 3. Teal — LEFT edge, ~40% down */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-[40%] h-[480px] w-[480px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #39bda7 0%, #1a9e8e 100%)' }} />

      {/* 4. Red — RIGHT edge, ~57% down */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-44 top-[57%] h-[500px] w-[500px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #e05555 0%, #b83232 100%)' }} />

      {/* 5. Green — LEFT edge, ~74% down */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-44 top-[74%] h-[520px] w-[520px] rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #39bda7 0%, #1a9e8e 100%)' }} />

      {/* 6. Red — RIGHT edge, ~89% down */}
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 top-[89%] h-[480px] w-[480px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #e05555 0%, #b83232 100%)' }} />

      {/* ── #home: Hero ── */}
      <section
        id="home"
        className="relative flex min-h-[calc(100vh-5rem)] items-center py-16"
      >
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              At Twin Care, we give the best healthcare you deserve.
            </h1>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button to="/contact">Book a Visit</Button>
              <a href="#services" className="btn-fill">
                See Our Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── #about: About ── */}
      <AboutSection />

      {/* ── #doctors: Doctors ── */}
      <section
        id="doctors"
        className="relative flex min-h-[calc(100vh-5rem)] scroll-mt-24 items-center py-20"
      >
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2 className="mt-1 font-display text-4xl font-semibold text-primary">Our Doctors</h2>

          <div className="mt-10">
            {doctorsLoading && (
              <p className="font-mono text-sm text-ink/80">Loading doctors…</p>
            )}
            {doctorsError && (
              <p className="text-sm text-red-600">{doctorsError}</p>
            )}
            {!doctorsLoading && !doctorsError && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor._id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── #services: Services ── */}
      <ServicesSection />
    </div>
  )
}
