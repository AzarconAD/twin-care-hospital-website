import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const linkClass = ({ isActive }) =>
    `font-body text-sm tracking-wide transition-colors hover:text-accent ${
      isActive ? 'text-primary font-semibold' : 'text-ink/80'
    }`

  return (
    <header className="fixed inset-x-0 top-0 z-50 transition-colors duration-300">
      <div className="bg-primary-dark px-4 py-1.5 text-center font-mono text-xs tracking-wide text-cream">
        EMERGENCY LINE: (+63) 912-345-6789 &middot; OPEN 24/7
      </div>

      <nav 
        className={`transition-all duration-300 border-b ${
          scrolled ? 'bg-cream/95 backdrop-blur-md border-primary/10 shadow-sm py-2' : 'bg-transparent border-transparent py-4'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2"
            aria-label="Go to home section"
          >
            <img src="/logo.svg" alt="Twin Care Hospital Logo" className="h-8 w-auto" />
            <span className="font-display text-xl font-semibold text-primary">
              Twin Care Hospital Inc.
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            <li>
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={linkClass}>
                About Us
              </NavLink>
            </li>
            <li>
              <NavLink to="/services" className={linkClass}>
                Services
              </NavLink>
            </li>
            <li>
              <NavLink to="/doctors" className={linkClass}>
                Doctors
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={linkClass}>
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Mobile hamburger button */}
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

        {/* Mobile dropdown */}
        {open && (
          <ul className="flex flex-col gap-1 border-t border-primary/10 bg-cream px-4 pb-4 md:hidden">
            <li>
              <NavLink
                to="/"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <span className="block py-2">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <span className="block py-2">About</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/doctors"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <span className="block py-2">Doctors</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/services"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <span className="block py-2">Services</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/contact"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <span className="block py-2">Contact</span>
              </NavLink>
            </li>
          </ul>
        )}
      </nav>
    </header>
  )
}
