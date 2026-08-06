import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, HeartHandshake, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';
import { HeroBackgroundBlobs } from './bg-decorations';

const trustPoints = [
  { icon: Clock, text: '24/7 Emergency Care' },
  { icon: ShieldCheck, text: 'Certified Specialists' },
  { icon: HeartHandshake, text: 'Compassionate Approach' },
];

export default function Hero({ onImageClick, news = [] }) {
  const [newsIndex, setNewsIndex] = useState(0);

  useEffect(() => {
    if (news.length > 0) {
      const defaultIndex = news.findIndex((n) => n.featured);
      setNewsIndex(defaultIndex >= 0 ? defaultIndex : 0);
    }
  }, [news]);

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNewsIndex((prev) => (prev === 0 ? news.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setNewsIndex((prev) => (prev === news.length - 1 ? 0 : prev + 1));
  };

  const activeNews = news.length > 0 ? news[newsIndex] : null;

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
            <Button to="/contact" variant="secondary" state={{ appointment: true }}>Book a Visit</Button>
            <Link to="/services" className="btn-fill font-body">
              See Our Services &rarr;
            </Link>
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
          <div className="main-container-wrapper h-full">
            <div className="main-container h-full relative z-10 p-0">
              <div 
                className="relative h-full w-full rounded-[inherit] overflow-hidden shadow-xl cursor-pointer group"
                onClick={() => onImageClick?.(activeNews?.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop")}
              >
                <motion.img
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={activeNews?.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop"}
                  alt={activeNews?.title || "Modern hospital facility"}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/*
            FLOATING HIGHLIGHT CARD — placeholder content for now.
            This is deliberately the spot to swap in real hospital news later
            (e.g. "New Pediatric Wing Now Open", "Free Checkup Week This March").
            Keep the same position/size; just swap the icon, label, and text,
            or replace the whole card with a small news carousel component.
          */}
          {activeNews && (
            <motion.a
              href="#news"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4 }}
              className="absolute -bottom-6 left-4 sm:left-6 bg-white border border-border rounded-xl shadow-lg p-4 flex items-center gap-3 max-w-[75%] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group z-20"
            >
              <div className={`w-10 h-10 rounded-lg bg-${activeNews.tagColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <HeartHandshake size={20} className="text-white" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className={`font-mono text-[10px] uppercase tracking-wide font-semibold text-${activeNews.tagColor} mb-0.5 truncate`}>
                  {activeNews.tag}
                </p>
                <p className="text-xs font-medium font-body leading-tight text-ink group-hover:text-primary transition-colors line-clamp-2">
                  {activeNews.title}
                </p>
                <p className="text-[10px] font-body text-ink/50 group-hover:text-primary/70 transition-colors mt-0.5">
                  Click to read more.
                </p>
              </div>
            </motion.a>
          )}

          {/* Carousel Navigation Arrows - Sides */}
          {news.length > 1 && (
            <>
              <button 
                onClick={handlePrev} 
                className="absolute top-1/2 -left-6 sm:-left-10 lg:-left-14 -translate-y-1/2 bg-white hover:bg-cream border border-border rounded-full shadow-md flex items-center justify-center w-10 h-10 text-ink/70 hover:text-primary transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary z-20 group-hover/hero:opacity-100 sm:opacity-70 opacity-100"
                aria-label="Previous news"
              >
                <ChevronLeft size={20} strokeWidth={2.5} className="-ml-0.5" />
              </button>
              <button 
                onClick={handleNext} 
                className="absolute top-1/2 -right-6 sm:-right-10 lg:-right-14 -translate-y-1/2 bg-white hover:bg-cream border border-border rounded-full shadow-md flex items-center justify-center w-10 h-10 text-ink/70 hover:text-primary transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary z-20 group-hover/hero:opacity-100 sm:opacity-70 opacity-100"
                aria-label="Next news"
              >
                <ChevronRight size={20} strokeWidth={2.5} className="ml-0.5" />
              </button>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
