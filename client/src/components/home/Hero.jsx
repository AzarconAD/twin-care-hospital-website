import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Clock, HeartHandshake } from 'lucide-react';
import Button from '../ui/Button';
import { HeroBackgroundBlobs } from '../ui/BG-Decorations';

const trustPoints = [
  { icon: Clock, text: '24/7 Emergency Care' },
  { icon: ShieldCheck, text: 'Certified Specialists' },
  { icon: HeartHandshake, text: 'Compassionate Approach' },
];

const heroImages = [
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2000&auto=format&fit=crop"
];

export default function Hero({ onImageClick, news = [], onSelectNews }) {
  const activeNews = news.length > 0 ? (news.find(n => n.featured) || news[0]) : null;
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
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
                onClick={() => onImageClick?.(heroImages[imageIndex])}
              >
                <AnimatePresence>
                  <motion.img
                    key={imageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    src={heroImages[imageIndex]}
                    alt="Twin Care Hospital"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>


          {activeNews && (
            <motion.a
              href="#news"
              onClick={() => onSelectNews?.(activeNews._id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.4 }}
              className="absolute -bottom-6 left-4 sm:left-6 bg-white border border-border rounded-xl shadow-lg p-4 flex items-center gap-3 max-w-[75%] cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group z-20"
            >
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <HeartHandshake size={20} className="text-white" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-wide font-semibold text-primary mb-0.5 truncate">
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
        </motion.div>
      </div>
    </section>
  );
}
