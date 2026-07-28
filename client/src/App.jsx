import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Contact from './pages/Contact.jsx'

/**
 * App — root component.
 * Two routes:
 *   /        → Home (contains #home, #about, #doctors, #services as anchor sections)
 *   /contact → Contact form
 *
 * Doctors is no longer a separate route — it's an anchor section on the home page.
 */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
