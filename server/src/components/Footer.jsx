import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-cream/90">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-display text-lg font-semibold text-cream">Twin Care Hospital Inc.</p>
            <p className="mt-2 font-mono text-xs leading-relaxed text-cream/70">
              123 Health Street, Quezon City<br />
              Metro Manila, Philippines
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-secondary">Directory</p>
            <ul className="mt-2 space-y-1 text-sm">
              <li><Link to="/about" className="hover:text-accent">About</Link></li>
              <li><Link to="/services" className="hover:text-accent">Services</Link></li>
              <li><Link to="/doctors" className="hover:text-accent">Doctors</Link></li>
              <li><Link to="/contact" className="hover:text-accent">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-wide text-secondary">Reach us</p>
            <ul className="mt-2 space-y-1 text-sm text-cream/80">
              <li>Trunkline: (02) 8888-0000</li>
              <li>Emergency: 24/7</li>
              <li>info@twincarehospital.ph</li>
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-cream/10 pt-4 text-center font-mono text-xs text-cream/50">
          &copy; {new Date().getFullYear()} Twin Care Hospital Incorporated. Placeholder content — for internship project use.
        </p>
      </div>
    </footer>
  )
}
