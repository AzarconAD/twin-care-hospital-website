import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";


// tagColor rotates through the existing brand colors — same functional-color
// pattern used for Services/Doctors categories, just without a filter system
// since news doesn't need one. Swap "image" paths once real photos exist.



function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsSection({ news = [], loading = false, error = null, selectedNewsId, setSelectedNewsId }) {

  // Auto-select the featured news item when the news data loads
  useEffect(() => {
    if (news.length > 0 && !selectedNewsId) {
      const defaultFeatured = news.find((n) => n.featured) || news[0];
      setSelectedNewsId(defaultFeatured._id);
    }
  }, [news, selectedNewsId, setSelectedNewsId]);

  const featured = news.find((n) => n._id === selectedNewsId) || news.find((n) => n.featured) || news[0];
  const rest = featured ? news.filter((n) => n._id !== featured._id).slice(0, 3) : [];

  return (
    <section id="news" className="relative w-full py-20 bg-cream scroll-mt-8">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-left"
        >
          <h2 className="font-mono text-2xl sm:text-3xl text-primary font-semibold tracking-tight mb-2">
            Latest News &amp; Updates
          </h2>
          <p className="font-mono text-sm text-ink/60">
            Read the latest from Twin Care
          </p>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-t-secondary animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl px-5 py-4 text-accent text-center font-body text-sm max-w-lg mx-auto">
            Failed to load latest news: {error}
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="text-center py-10">
            <p className="font-body text-ink/50 text-lg">No news yet.</p>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">

          {/* Featured article — large, spans 2 of 3 columns on desktop */}
          <motion.article
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-white rounded-2xl overflow-hidden border border-border shadow-sm"
          >
            <div className="aspect-[16/9] pt-4 bg-[url('/news-bg-pattern.png')] bg-no-repeat bg-cover bg-center">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="font-mono text-[10px] uppercase tracking-wide font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary"
                >
                  {featured.tag}
                </span>
                <span className="flex items-center gap-1.5 font-body text-xs text-ink/50">
                  <Calendar size={13} />
                  {formatDate(featured.date)}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl text-ink mb-3 leading-snug">
                {featured.title}
              </h3>
              <p className="font-body text-sm sm:text-base text-ink/70 leading-relaxed">
                {featured.excerpt}
              </p>
            </div>
          </motion.article>

          {/* Smaller list — remaining news items, stacked */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-5"
          >
            <h3 className="font-mono text-lg text-ink font-semibold tracking-tight -mb-1">
              Related Posts
            </h3>
            {rest.map((item, i) => (
              <article
                key={item._id}
                onClick={() => setSelectedNewsId(item._id)}
                className="flex gap-4 rounded-xl border border-border p-3 bg-white cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all"
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <span
                    className="inline-block font-mono text-[9px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full mb-1.5 bg-primary/10 text-primary"
                  >
                    {item.tag}
                  </span>
                  <h4 className="font-display text-sm text-ink leading-snug mb-1 truncate">
                    {item.title}
                  </h4>
                  <span className="font-body text-[11px] text-ink/45">
                    {formatDate(item.date)}
                  </span>
                </div>
              </article>
            ))}
          </motion.div>
        </div>
        )}
      </div>
    </section>
  );
}
