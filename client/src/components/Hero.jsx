import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, HeartHandshake } from 'lucide-react';
import Button from './Button';
import { HeroBackgroundBlobs } from './bg-decorations';

const trustPoints = [
  { icon: Clock, text: '24/7 Emergency Care' },
  { icon: ShieldCheck, text: 'Certified Specialists' },
  { icon: HeartHandshake, text: 'Compassionate Approach' },
];

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center py-16"
    >
      {/* Decorative background blobs — purely visual texture, sits behind everything */}
      <HeroBackgroundBlobs />


      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
            At Twin Care, we give the best healthcare you deserve.
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/contact">Book a Visit</Button>
            <a href="#services" className="btn-fill font-body">
              See Our Services &rarr;
            </a>
          </div>

          {/* Trust strip */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3"
          >
            {trustPoints.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon size={18} className="text-primary" strokeWidth={1.75} />
                <span className="text-sm font-medium font-body text-ink">{text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-64 sm:h-80 md:h-[400px] w-full"
        >
          <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop"
              alt="Modern hospital facility"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/*
            FLOATING HIGHLIGHT CARD — placeholder content for now.
            This is deliberately the spot to swap in real hospital news later
            (e.g. "New Pediatric Wing Now Open", "Free Checkup Week This March").
            Keep the same position/size; just swap the icon, label, and text,
            or replace the whole card with a small news carousel component.
          */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="absolute -bottom-6 left-4 sm:left-6 bg-white border border-border rounded-xl shadow-lg p-4 flex items-center gap-3 max-w-[85%]"
          >
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <HeartHandshake size={20} className="text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wide font-semibold text-primary mb-0.5">
                Latest Update
              </p>
              <p className="text-sm font-medium font-body leading-snug text-ink">
                New Pediatric Wing Now Open
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
