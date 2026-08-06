import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

// tagColor rotates through the existing brand colors — same functional-color
// pattern used for Services/Doctors categories, just without a filter system
// since news doesn't need one. Swap "image" paths once real photos exist.

const tagClasses = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  accent: "bg-accent/10 text-accent",
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function NewsSection({ news = [], loading = false, error = null }) {
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  // Auto-select the featured news item when the news data loads
  useEffect(() => {
    if (news.length > 0) {
      const defaultFeatured = news.find((n) => n.featured) || news[0];
      setSelectedNewsId(defaultFeatured._id);
    }
  }, [news]);

  const featured = news.find((n) => n._id === selectedNewsId) || news.find((n) => n.featured) || news[0];
  const rest = featured ? news.filter((n) => n._id !== featured._id).slice(0, 3) : [];

  return (
    <section id="news" className="w-full py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="font-display text-3xl sm:text-4xl text-primary">
            Latest News &amp; Updates
          </h2>
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
            className="lg:col-span-2 rounded-2xl overflow-hidden border border-border shadow-sm"
          >
            <div className="aspect-[16/9]">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-3">
                <span
                  className={`font-mono text-[10px] uppercase tracking-wide font-semibold px-2.5 py-1 rounded-full ${tagClasses[featured.tagColor]}`}
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
          <div className="flex flex-col gap-5">
            {rest.map((item, i) => (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => setSelectedNewsId(item._id)}
                className="flex gap-4 rounded-xl border border-border p-3 bg-cream/40 cursor-pointer hover:bg-cream/80 hover:shadow-sm transition-all"
              >
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span
                    className={`inline-block font-mono text-[9px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full mb-1.5 ${tagClasses[item.tagColor]}`}
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
              </motion.article>
            ))}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
