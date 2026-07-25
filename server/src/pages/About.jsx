export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-secondary">About Us</p>
      <h1 className="mt-1 font-display text-4xl font-semibold text-primary">
        About Twin Care Hospital
      </h1>

      <p className="mt-6 leading-relaxed text-ink/80">
        [Placeholder] Twin Care Hospital Incorporated has served the community for
        over — years, providing accessible, compassionate healthcare to patients
        of all ages. This paragraph should be replaced with the hospital's real
        history once it's provided.
      </p>

      <div className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="rounded-lg border border-primary/10 bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-primary">Our Mission</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">
            [Placeholder] To deliver quality, patient-centered healthcare that is
            accessible to every member of the community we serve.
          </p>
        </div>
        <div className="rounded-lg border border-primary/10 bg-white p-6">
          <h2 className="font-display text-xl font-semibold text-primary">Our Vision</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/80">
            [Placeholder] To be the most trusted healthcare institution in the
            region, known for clinical excellence and genuine care.
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold text-primary">Accreditations</h2>
        <ul className="mt-3 space-y-1 font-mono text-sm text-ink/70">
          <li>[Placeholder] DOH-licensed healthcare facility</li>
          <li>[Placeholder] PhilHealth-accredited</li>
          <li>[Placeholder] ISO certification (if applicable)</li>
        </ul>
      </div>
    </div>
  )
}
