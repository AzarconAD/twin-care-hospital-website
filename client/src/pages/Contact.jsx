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

  useEffect(() => {
    if (location.state?.appointment && appointmentRef.current) {
      // Small delay to ensure layout is ready
      setTimeout(() => {
        appointmentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
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
    console.log("Appointment request (not yet sent to backend):", apptForm);
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
    <div className="relative w-full min-h-screen bg-cream overflow-hidden">
      {/* Decorative background blobs — purely visual texture, sits behind everything */}
      <ContactBackgroundBlobs />
      {/* Page header */}
      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-32 lg:pt-40 pb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-xs uppercase tracking-wide text-accent font-semibold mb-3">
          Get In Touch
        </p>
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight text-primary mb-5">
          We're here whenever you need us
        </h1>
        <p className="font-body text-lg text-ink/70 leading-relaxed max-w-2xl mx-auto">
          Find us, book a visit, or just send a message &mdash; whatever works for you.
        </p>
      </motion.div>

      {/* SECTION 1 — Location */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-20"
      >
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-96 md:h-auto">
            <iframe
              title="Twin Care Hospital location"
              src={MAP_EMBED_SRC}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "28rem" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-primary" strokeWidth={2} />
              <h2 className="font-display text-2xl text-primary">Find Us</h2>
            </div>
            <p className="font-body text-ink/80 mb-4 leading-relaxed">{HOSPITAL_ADDRESS}</p>

            <div className="flex items-start gap-2 mb-6">
              <Clock size={18} className="text-secondary mt-0.5" strokeWidth={2} />
              <div className="font-body text-sm text-ink/70">
                <p className="font-semibold text-ink mb-0.5">Hours</p>
                <p>Emergency: Open 24/7</p>
                <p>Outpatient: Mon&ndash;Sat, 8:00 AM &ndash; 6:00 PM</p>
              </div>
            </div>

            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-primary text-white font-body text-sm font-medium px-5 py-2.5 rounded-full w-fit hover:bg-primary-dark transition-colors"
            >
              <MapPin size={16} />
              Get Directions
            </a>
          </div>
        </div>
      </motion.section>

      {/* SECTION 2 — General Contact */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 py-20"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MessageSquare size={20} className="text-accent" strokeWidth={2} />
            <h2 className="font-display text-2xl text-primary">Send Us a Message</h2>
          </div>
          <p className="font-body text-sm text-ink/60">
            General questions, feedback, or anything else &mdash; we read every message.
          </p>
        </div>

        {contactStatus === "success" ? (
          <div className="text-center py-8 px-6 bg-accent/10 rounded-2xl">
            <p className="font-display text-lg text-accent mb-1">Message sent!</p>
            <p className="font-body text-sm text-ink/70">We'll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleContactSubmit} className="space-y-4">
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
              rows={4}
              required
              value={contactForm.message}
              onChange={handleContactChange}
              className="w-full border border-border rounded-lg px-4 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            {contactStatus === "error" && (
              <p className="font-body text-sm text-accent">
                Something went wrong &mdash; please try again.
              </p>
            )}
            <button
              type="submit"
              disabled={contactStatus === "loading"}
              className="w-full bg-primary text-white font-body text-sm font-medium py-3 rounded-full hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {contactStatus === "loading" ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </motion.section>

      {/* SECTION 3 — Appointment */}
      <motion.section
        ref={appointmentRef}
        id="appointment"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-20 scroll-mt-32"
      >
        <div className="tc-calendar-wrapper">
          <div className="tc-calendar-container p-8 sm:p-10 relative z-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calendar size={20} className="text-secondary" strokeWidth={2} />
              <h2 className="font-display text-2xl text-primary">Schedule an Appointment</h2>
            </div>
            <p className="font-body text-sm text-ink/60">
              Pick a doctor and a preferred time &mdash; we'll confirm by phone or email.
            </p>
          </div>

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
                className="btn-fill-popup w-full font-body text-sm font-semibold py-3 rounded-full transition-all duration-200 active:scale-95"
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
