import { useState, useEffect } from 'react'
import DoctorCard from '../components/DoctorCard.jsx'
import { getDoctors } from '../api/index.js'

export default function Doctors() {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDoctors()
      .then((data) => {
        setDoctors(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Could not load doctors. Is the backend server running?')
        setLoading(false)
      })
  }, [])

  return (
    <section id="doctors" className="relative flex min-h-[calc(100vh-5rem)] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h1 className="mt-1 font-display text-4xl font-semibold text-primary">Our Doctors</h1>

        <div className="mt-10">
          {loading && (
            <p className="font-mono text-sm text-ink/60">Loading doctors…</p>
          )}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          {!loading && !error && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
