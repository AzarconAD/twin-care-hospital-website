import Card from '../components/Card.jsx'
import { services } from '../data/placeholderData.js'

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-wide text-secondary">Hospital Directory</p>
      <h1 className="mt-1 font-display text-4xl font-semibold text-primary">Our Services</h1>
      <p className="mt-3 max-w-xl text-ink/70">
        A quick look at what's available across the hospital. [Placeholder — replace
        with the real list of departments and services once confirmed.]
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Card key={s.code} eyebrow={s.code} title={s.name}>
            {s.description}
          </Card>
        ))}
      </div>
    </div>
  )
}
