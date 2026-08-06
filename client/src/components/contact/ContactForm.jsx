import React from "react";
import { MessageSquare, Send } from "lucide-react";

export default function ContactForm({
  contactForm,
  contactStatus,
  handleContactChange,
  handleContactSubmit,
  setContactStatus
}) {
  return (
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
        <div className="text-center py-10 px-6 bg-secondary/10 rounded-2xl my-auto">
          <p className="font-display text-xl text-secondary mb-2">Message sent!</p>
          <p className="font-body text-sm text-ink/70">
            Check your email for the reply.
          </p>
          <button
            onClick={() => setContactStatus("idle")}
            className="mt-4 font-body text-sm text-primary underline"
          >
            Send another message
          </button>
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
  );
}
