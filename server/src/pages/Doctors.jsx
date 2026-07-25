import { doctors } from '../data/placeholderData.js'

export default function Doctors() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-secondary">Our Team</p>
      <h1 className="mt-1 font-display text-4xl font-semibold text-primary">Our Doctors</h1>
      <p className="mt-3 max-w-xl text-ink/70">
        [Placeholder — replace names, specialties, and photos once the hospital
        provides real doctor profiles.]
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {doctors.map((doc) => (
          <div
            key={doc.name}
            className="rounded-lg border border-primary/10 bg-white p-5 text-center"
          >
            {/* Placeholder avatar — swap for a real photo <img> later */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-light font-display text-2xl text-primary">
              {doc.name.split(' ').map((n) => n[0]).slice(1, 3).join('')}
            </div>
            <h3 className="mt-4 font-display text-lg font-semibold text-primary">
              {doc.name}
            </h3>
            <p className="mt-1 text-sm text-ink/70">{doc.specialty}</p>
            <p className="mt-2 font-mono text-xs text-secondary">{doc.schedule}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
