import { Link } from 'react-router-dom'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import { services } from '../data/placeholderData.js'

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-secondary">
              Twin Care Hospital Incorporated
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl">
              Care that meets you where you are.
            </h1>
            <p className="mt-4 max-w-md text-cream/80">
              Twenty-four hours a day, our doctors, nurses, and staff are here for
              you and your family — from routine checkups to emergency care.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button to="/contact">Book a Visit</Button>
              <Button to="/services" variant="outline">See Our Services</Button>
            </div>
          </div>

          {/* Directory strip — wayfinding motif, echoed again on Services page */}
          <div className="rounded-lg border border-cream/15 bg-primary-dark p-5">
            <p className="font-mono text-xs uppercase tracking-wide text-secondary">
              Hospital Directory
            </p>
            <ul className="mt-3 space-y-2 font-mono text-sm text-cream/90">
              {services.slice(0, 4).map((s) => (
                <li key={s.code} className="flex justify-between border-b border-cream/10 pb-2">
                  <span>{s.name}</span>
                  <span className="text-secondary">{s.code}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Quick services preview */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-secondary">What we offer</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-primary">Our Services</h2>
          </div>
          <Link to="/services" className="text-sm font-semibold text-primary hover:text-accent">
            View all &rarr;
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 3).map((s) => (
            <Card key={s.code} eyebrow={s.code} title={s.name}>
              {s.description}
            </Card>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-secondary/20">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center sm:px-6">
          <h2 className="font-display text-2xl font-semibold text-primary sm:text-3xl">
            Have a question, or need to reach us?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-ink/70">
            Our team responds to inquiries within one business day.
          </p>
          <div className="mt-6">
            <Button to="/contact">Contact Us</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
