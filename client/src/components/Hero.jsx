import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button'; // wait, does Button exist? Yes, I saw it in the dir list.

export default function Hero() {
  return (
    <section id="home" className="relative flex min-h-[calc(100vh-5rem)] items-center py-16">
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
            At Twin Care, we give the best healthcare you deserve.
          </h1>
          <p className="mt-4 text-ink/80 max-w-md">
            Your health is our priority. We offer world-class medical services, top-tier specialists, and compassionate care.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button to="/contact">Book a Visit</Button>
            <a href="#services" className="font-body text-sm font-semibold text-primary hover:text-primary-dark transition-colors">
              See Our Services &rarr;
            </a>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-64 sm:h-80 md:h-[400px] w-full rounded-2xl overflow-hidden shadow-xl"
        >
          <img 
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop" 
            alt="Modern hospital facility" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
