import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Doctors from './pages/Doctors.jsx'
import Contact from './pages/Contact.jsx'

/**
 * App — root component.
 * Sets up the shared layout (Navbar + Footer) and defines the three routes:
 *
 *   /          → Home (contains #home, #about, #services as anchor sections)
 *   /doctors   → Doctors listing
 *   /contact   → Contact form
 *
 * About and Services are no longer separate routes — they live as scrollable
 * sections on the home page, accessible via the Navbar anchor links.
 */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
