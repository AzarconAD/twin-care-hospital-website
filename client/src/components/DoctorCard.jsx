export default function DoctorCard({ doctor }) {
  const initials = doctor.name
    .split(' ')
    .slice(1)
    .map((n) => n[0])
    .join('')

  return (
    <div className="rounded-lg border border-primary/10 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-light font-display text-2xl text-primary">
        {initials}
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-primary">{doctor.name}</h3>
      <p className="mt-1 text-sm text-ink/70">{doctor.specialty}</p>
      <p className="mt-2 font-mono text-xs text-secondary">{doctor.schedule}</p>
    </div>
  )
}
