import React from "react";
import { User, Phone, Mail } from "lucide-react";

export default function AppointmentForm({
  apptForm,
  apptStatus,
  handleApptChange,
  handleApptSubmit,
  setApptStatus,
  doctors
}) {
  if (apptStatus === "loading") {
    return (
      <div className="text-center py-10 px-6 bg-paper rounded-2xl flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-display text-xl text-primary mb-2">Submitting request...</p>
        <p className="font-body text-sm text-ink/70">Please don't close this window.</p>
      </div>
    );
  }

  if (apptStatus === "error") {
    return (
      <div className="text-center py-10 px-6 bg-accent/10 rounded-2xl border border-accent/20">
        <p className="font-display text-xl text-accent mb-2">Something went wrong</p>
        <p className="font-body text-sm text-ink/70">
          We couldn't submit your appointment request. Please try again later or call us directly.
        </p>
        <button
          onClick={() => setApptStatus("idle")}
          className="mt-4 font-body text-sm text-primary underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (apptStatus === "success") {
    return (
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
    );
  }

  return (
    <form onSubmit={handleApptSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="font-body text-xs font-medium text-ink/70 mb-1 block">
            Doctor
          </label>
          <select
            name="doctorId"
            required
            value={apptForm.doctorId}
            onChange={handleApptChange}
            className="w-full border border-border rounded-lg px-3 py-2.5 font-body text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
          >
            <option value="" disabled>Select a doctor</option>
            {doctors && doctors.map(doc => (
              <option key={doc._id} value={doc._id}>
                {doc.name} {doc.postfix ? `, ${doc.postfix}` : ''} — {doc.specialty}
              </option>
            ))}
          </select>
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
  );
}
