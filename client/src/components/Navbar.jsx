import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'

/**
 * Navbar — shared across all pages.
 *
 * HOW THE NAVIGATION WORKS (read this carefully as a team!)
 * ─────────────────────────────────────────────────────────
 * The site has three "anchor" sections on the home page: #home, #about, #services.
 * The nav links for these don't change the URL route — they smooth-scroll within the page.
 *
 * There are two situations when a user clicks "About" or "Services":
 *
 *   Case 1 — Already on the home page (/):
 *     We just call scrollIntoView() on the target element. Simple.
 *
 *   Case 2 — On a different page (/doctors or /contact):
 *     We first call navigate('/') to go back to home, then wait a short moment
 *     (100ms) for React to render the home page, then scroll to the section.
 *     The setTimeout is the key trick here — without it, the element wouldn't
 *     exist in the DOM yet when we try to scroll to it.
 *
 * "Doctors" and "Contact" are regular NavLink components — they navigate
 * to a new route like any normal React Router link.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  function scrollToSection(sectionId) {
    setOpen(false) // close mobile menu if it's open

    function doScroll() {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    if (location.pathname === '/') {
      // Already on the home page — scroll immediately
      doScroll()
    } else {
      // Navigate to home first, then scroll once it renders
      navigate('/')
      setTimeout(doScroll, 100)
    }
  }

  const linkClass = ({ isActive }) =>
    `font-body text-sm tracking-wide transition-colors hover:text-accent ${
      isActive ? 'text-primary font-semibold' : 'text-ink/80'
    }`

  const anchorClass =
    'font-body text-sm tracking-wide text-ink/80 transition-colors hover:text-accent'

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-primary-dark px-4 py-1.5 text-center font-mono text-xs tracking-wide text-cream">
        EMERGENCY LINE: (+63) 912-345-6789 &middot; OPEN 24/7
      </div>

      <nav className="bg-cream/95 backdrop-blur border-b border-primary/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo — clicking it scrolls to #home */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2"
            aria-label="Go to home section"
          >
            <img src="/logo.svg" alt="Twin Care Hospital Logo" className="h-8 w-auto" />
            <span className="font-display text-xl font-semibold text-primary">
              Twin Care Hospital Inc.
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            <li>
              <button onClick={() => scrollToSection('home')} className={anchorClass}>
                Home
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('about')} className={anchorClass}>
                About
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('services')} className={anchorClass}>
                Services
              </button>
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
              <button
                onClick={() => scrollToSection('home')}
                className={`block w-full py-2 text-left ${anchorClass}`}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('about')}
                className={`block w-full py-2 text-left ${anchorClass}`}
              >
                About
              </button>
            </li>
            <li>
              <button
                onClick={() => scrollToSection('services')}
                className={`block w-full py-2 text-left ${anchorClass}`}
              >
                Services
              </button>
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
