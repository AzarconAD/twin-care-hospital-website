import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `font-body text-sm tracking-wide transition-colors hover:text-accent ${
      isActive ? 'text-primary font-semibold' : 'text-ink/80'
    }`

  return (
    <header className="sticky top-0 z-50">
      {/* Signage-style top strip — real hospital sites lead with this */}
      <div className="bg-primary-dark px-4 py-1.5 text-center font-mono text-xs tracking-wide text-cream">
        EMERGENCY LINE: (02) 8888-0000 &middot; OPEN 24/7
      </div>

      <nav className="bg-cream/95 backdrop-blur border-b border-primary/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-cream font-display text-lg">
              +
            </span>
            <span className="font-display text-xl font-semibold text-primary">
              Twin Care Hospital
            </span>
          </NavLink>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass} end={link.to === '/'}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile menu button */}
          <button
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className={`h-0.5 w-6 bg-primary transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-primary transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-primary transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>

        {/* Mobile links */}
        {open && (
          <ul className="flex flex-col gap-1 border-t border-primary/10 bg-cream px-4 pb-4 md:hidden">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={linkClass}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                >
                  <span className="block py-2">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  )
}
