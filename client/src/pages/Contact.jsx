import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import ContactForm from "../components/contact/ContactForm";
import AppointmentForm from "../components/contact/AppointmentForm";
import { submitContact, submitAppointment, getDoctors } from "../api/index.js";
import { ContactBackgroundBlobs } from "../components/ui/BG-Decorations";

// Real hospital address — update the map/directions links below too if this changes.
const HOSPITAL_ADDRESS = "Tapatan Road, Marungko, Angat, Bulacan, Philippines";
const MAP_QUERY = "W2W5+3V Angat, Bulacan, Philippines";
const MAP_EMBED_SRC = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed&z=16`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;

export default function ContactPage() {
  const location = useLocation();
  const appointmentRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    // Small delay to ensure layout is ready
    setTimeout(() => {
      if (location.state?.appointment && appointmentRef.current) {
        appointmentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (location.state?.location && locationRef.current) {
        locationRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [location.state]);

  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    getDoctors()
      .then((data) => setDoctors(data))
      .catch((err) => console.error("Failed to fetch doctors:", err));
  }, []);

  // --- Appointment form state ---
  const [apptForm, setApptForm] = useState({
    doctorId: location.state?.doctorId || "",
    date: location.state?.date || "",
    time: location.state?.time || "",
    patientName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [apptStatus, setApptStatus] = useState("idle"); // idle | loading | success | error

  const handleApptChange = (e) => {
    setApptForm({ ...apptForm, [e.target.name]: e.target.value });
  };

  const handleApptSubmit = async (e) => {
    e.preventDefault();
    setApptStatus("loading");
    try {
      await submitAppointment(apptForm);
      setApptStatus("success");
      setApptForm({ doctorId: "", date: "", time: "", patientName: "", email: "", phone: "", notes: "" });
    } catch (err) {
      console.error(err);
      setApptStatus("error");
    }
  };

  // --- General contact form state ---
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState("idle"); // idle | loading | success | error

  const handleContactChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus("loading");
    try {
      // Uses the centralized submitContact helper from src/api/index.js
      // to avoid duplicating the endpoint URL here.
      await submitContact(contactForm);
      setContactStatus("success");
      setContactForm({ name: "", email: "", message: "" });
    } catch (err) {
      setContactStatus("error");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-cream">
      {/* Decorative background blobs — purely visual texture, sits behind everything */}
      <ContactBackgroundBlobs />
      {/* Page header */}
      <motion.div
        className="relative z-0 max-w-3xl mx-auto px-4 sm:px-6 pt-24 lg:pt-28 pb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-xs uppercase tracking-wide text-accent font-semibold mb-3">
          Get In Touch
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-primary mb-3">
          We're here whenever you need us
        </h1>
        <p className="font-body text-lg text-primary/70 leading-relaxed max-w-2xl mx-auto">
          Find us, book a visit, or just send a message &mdash; whatever works for you.
        </p>
      </motion.div>

      {/* SECTION 1 & 2 — Location and General Contact */}
      <motion.section
        ref={locationRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="relative z-0 max-w-5xl mx-auto px-4 sm:px-6 pb-20 scroll-mt-24"
      >
        <div className="grid md:grid-cols-2 gap-10 md:gap-12 items-stretch">
          
          {/* Left Column: Map & Details */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-48 md:h-64">
              <iframe
                title="Twin Care Hospital location"
                src={MAP_EMBED_SRC}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            
            <div className="px-1">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={20} className="text-accent" strokeWidth={2} />
                <h2 className="font-display text-2xl text-primary">Find Us</h2>
              </div>
              <p className="font-body text-primary/70 mb-3 leading-relaxed">{HOSPITAL_ADDRESS}</p>

              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-secondary mt-0.5" strokeWidth={2} />
                  <p className="font-body text-sm text-ink/70">
                    <span className="block font-semibold text-ink mb-0.5">Phone</span>
                    (+63) 912-345-6789
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-secondary mt-0.5" strokeWidth={2} />
                  <p className="font-body text-sm text-ink/70">
                    <span className="block font-semibold text-ink mb-0.5">Email</span>
                    contact@twincarehospital.com
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-secondary mt-0.5" strokeWidth={2} />
                  <div className="font-body text-sm text-ink/70">
                    <p className="font-semibold text-ink mb-0.5">Hours</p>
                    <p>Emergency: Open 24/7</p>
                    <p>Outpatient: Mon&ndash;Sat, 8:00 AM &ndash; 6:00 PM</p>
                  </div>
                </div>
              </div>

              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="main-button inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-full font-body text-sm font-semibold transition-all duration-200 active:scale-95"
              >
                <MapPin size={16} />
                Get Directions
              </a>
            </div>
          </div>

          {/* Right Column: Message Box */}
          <div className="main-container-wrapper h-full flex flex-col">
            <ContactForm 
              contactForm={contactForm}
              contactStatus={contactStatus}
              handleContactChange={handleContactChange}
              handleContactSubmit={handleContactSubmit}
              setContactStatus={setContactStatus}
            />
          </div>
        </div>
      </motion.section>

      {/* SECTION 3 — Appointment */}
      <motion.section
        ref={appointmentRef}
        id="appointment"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="relative z-0 max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-20 scroll-mt-32"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calendar size={20} className="text-secondary" strokeWidth={2} />
            <h2 className="font-display text-2xl text-primary">Schedule an Appointment</h2>
          </div>
          <p className="font-body text-sm text-primary/70">
            Pick a doctor and a preferred time &mdash; we'll confirm by phone or email.
          </p>
        </div>

        <div className="main-container-wrapper">
          <div className="main-container p-8 sm:p-10 relative z-10">
            <AppointmentForm 
              apptForm={apptForm}
              apptStatus={apptStatus}
              handleApptChange={handleApptChange}
              handleApptSubmit={handleApptSubmit}
              setApptStatus={setApptStatus}
              doctors={doctors}
            />
          </div>
        </div>
      </motion.section>
    </div>
  );
}
