import { Routes, Route, Outlet } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import ScrollToTop from './components/ui/ScrollToTop.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Doctors from './pages/Doctors.jsx'
import Contact from './pages/Contact.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminDoctors from './pages/AdminDoctors.jsx'
import AdminAppointments from './pages/AdminAppointments.jsx'
import AdminNews from './pages/AdminNews.jsx'

/**
 * PublicLayout
 *
 * Wraps all public-facing pages with the shared Navbar and Footer.
 * Admin pages (login, dashboard) sit outside this layout so they
 * render as standalone pages with no navigation chrome.
 *
 * React Router's <Outlet /> renders whatever child route matched.
 */
function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes — wrapped in Navbar + Footer shell */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin routes — standalone, no Navbar or Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/news" element={<AdminNews />} />
      </Routes>
    </>
  )
}
