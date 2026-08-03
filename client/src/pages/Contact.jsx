import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, Send, Calendar, User, Mail, MessageSquare } from "lucide-react";
import { submitContact } from "../api/index.js";
import { ContactBackgroundBlobs } from "../components/bg-decorations";

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

  // --- Appointment form state (UI-only for now, no backend yet) ---
  const [apptForm, setApptForm] = useState({
    doctorName: location.state?.doctorName || "",
    date: "",
    time: "",
    patientName: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [apptStatus, setApptStatus] = useState("idle"); // idle | success

  const handleApptChange = (e) => {
    setApptForm({ ...apptForm, [e.target.name]: e.target.value });
  };

  const handleApptSubmit = (e) => {
    e.preventDefault();
    // TODO: replace with a real POST to an /api/appointments route once that
    // backend model exists. For now this just confirms the UI flow works.
    setApptStatus("success");
    setApptForm({ doctorName: "", date: "", time: "", patientName: "", email: "", phone: "", notes: "" });
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
                    (044) 123-4567
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
            <div className="main-container p-5 sm:p-6 relative z-10 flex-grow flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={20} className="text-accent" strokeWidth={2} />
                <h2 className="font-display text-2xl text-primary">Message Us</h2>
              </div>
              <p className="font-body text-sm text-primary/70">
                General questions, feedback, or anything else.
              </p>
            </div>

            {contactStatus === "success" ? (
              <div className="text-center py-8 px-6 bg-accent/10 rounded-2xl my-auto">
                <p className="font-display text-lg text-accent mb-1">Message sent!</p>
                <p className="font-body text-sm text-ink/70">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 flex-grow flex flex-col">
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  value={contactForm.name}
                  onChange={handleContactChange}
                  className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  required
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <textarea
                  name="message"
                  placeholder="Your message"
                  required
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none flex-grow"
                />
                {contactStatus === "error" && (
                  <p className="font-body text-sm text-accent">
                    Something went wrong &mdash; please try again.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={contactStatus === "loading"}
                  className="main-button w-full font-body text-sm font-semibold py-3 rounded-full transition-all duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  <Send size={16} />
                  {contactStatus === "loading" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
            </div>
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

          {apptStatus === "success" ? (
            <div className="text-center py-10 px-6 bg-secondary/10 rounded-2xl">
              <p className="font-display text-xl text-secondary mb-2">Request received!</p>
              <p className="font-body text-sm text-ink/70">
                We'll reach out shortly to confirm your appointment.
              </p>
              <button
                onClick={() => setApptStatus("idle")}
                className="mt-4 font-body text-sm text-primary underline"
              >
                Book another
              </button>
            </div>
          ) : (
            <form onSubmit={handleApptSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-medium text-ink/70 mb-1 block">
                    Doctor
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    required
                    placeholder="Doctor's Name"
                    value={apptForm.doctorName}
                    onChange={handleApptChange}
                    className="w-full border border-border rounded-lg px-3 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-body text-xs font-medium text-ink/70 mb-1 block">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={apptForm.date}
                      onChange={handleApptChange}
                      className="w-full border border-border rounded-lg px-3 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-medium text-ink/70 mb-1 block">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      required
                      value={apptForm.time}
                      onChange={handleApptChange}
                      className="w-full border border-border rounded-lg px-3 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-xs font-medium text-ink/70 mb-1 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                    <input
                      type="text"
                      name="patientName"
                      required
                      placeholder="Your Name"
                      value={apptForm.patientName}
                      onChange={handleApptChange}
                      className="w-full border border-border rounded-lg pl-9 pr-3 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-body text-xs font-medium text-ink/70 mb-1 block">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="E.g. 0917 123 4567"
                      value={apptForm.phone}
                      onChange={handleApptChange}
                      className="w-full border border-border rounded-lg pl-9 pr-3 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-body text-xs font-medium text-ink/70 mb-1 block">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="E.g. juan@example.com"
                    value={apptForm.email}
                    onChange={handleApptChange}
                    className="w-full border border-border rounded-lg pl-9 pr-3 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-body text-xs font-medium text-ink/70 mb-1 block">
                  Reason for visit
                </label>
                <textarea
                  name="notes"
                  required
                  placeholder="Briefly describe your symptoms or reason for visit"
                  rows={3}
                  value={apptForm.notes}
                  onChange={handleApptChange}
                  className="w-full border border-border rounded-lg px-3 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>

              <button
                type="submit"
                className="main-button w-full font-body text-sm font-semibold py-3 rounded-full transition-all duration-200 active:scale-95"
              >
                Request Appointment
              </button>
            </form>
          )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
