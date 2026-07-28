import { useState, useEffect } from 'react'
import Button from '../components/Button.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import DoctorCard from '../components/DoctorCard.jsx'
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
      style={{ backgroundImage: "url('/hospital-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-cream/60 backdrop-blur-[2px]" />

      {/* ── #home: Hero ── */}
      <section
        id="home"
        className="relative flex min-h-[calc(100vh-5rem)] scroll-mt-24 items-center py-16"
      >
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              At Twin Care, we give the best healthcare you deserve.
            </h1>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/contact">Book a Visit</Button>
              <a
                href="#services"
                className="rounded-xl border border-primary/30 bg-white/50 px-6 py-3 font-semibold text-primary backdrop-blur-sm transition-colors hover:bg-primary/10"
              >
                See Our Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── #about: About ── */}
      <section
        id="about"
        className="relative flex min-h-[calc(100vh-5rem)] scroll-mt-24 items-center py-20"
      >
        <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-6">
          <h2 className="mt-1 font-display text-4xl font-semibold text-primary">
            About Twin Care Hospital
          </h2>
          <p className="mt-6 max-w-2xl leading-relaxed text-ink/80">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
            in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
            occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl border border-primary/10 bg-white/90 p-6 shadow-sm backdrop-blur-md">
              <h3 className="font-display text-xl font-semibold text-primary">Our Mission</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                [Placeholder] To deliver quality, patient-centered healthcare that is
                accessible to every member of the community we serve.
              </p>
            </div>
            <div className="rounded-xl border border-primary/10 bg-white/90 p-6 shadow-sm backdrop-blur-md">
              <h3 className="font-display text-xl font-semibold text-primary">Our Vision</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/80">
                [Placeholder] To be the most trusted healthcare institution in the
                region, known for clinical excellence and genuine care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── #doctors: Doctors ── */}
      <section
        id="doctors"
        className="relative flex min-h-[calc(100vh-5rem)] scroll-mt-24 items-center py-20"
      >
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2 className="mt-1 font-display text-4xl font-semibold text-primary">Our Doctors</h2>

          <div className="mt-10">
            {doctorsLoading && (
              <p className="font-mono text-sm text-ink/60">Loading doctors…</p>
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
      <section
        id="services"
        className="relative flex min-h-[calc(100vh-5rem)] scroll-mt-24 items-center py-20"
      >
        <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2 className="mt-1 font-display text-4xl font-semibold text-primary">Our Services</h2>
          <p className="mt-3 max-w-xl text-ink/70">
            A quick look at what's available across the hospital. [Placeholder — replace with
            the real department list once confirmed.]
          </p>

          <div className="mt-10">
            {servicesLoading && (
              <p className="font-mono text-sm text-ink/60">Loading services…</p>
            )}
            {servicesError && (
              <p className="text-sm text-red-600">{servicesError}</p>
            )}
            {!servicesLoading && !servicesError && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
