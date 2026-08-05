import React from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

// tagColor rotates through the existing brand colors — same functional-color
// pattern used for Services/Doctors categories, just without a filter system
// since news doesn't need one. Swap "image" paths once real photos exist.
export const defaultNews = [
  {
    id: "n1",
    tag: "Announcement",
    tagColor: "primary",
    date: "2026-07-28",
    title: "New Pediatric Wing Now Open",
    excerpt:
      "Twin Care's newest wing doubles our capacity for infant and adolescent care, with dedicated rooms designed around comfort for young patients and their families.",
    image: "https://picsum.photos/seed/news-pedwing/900/600",
    featured: true,
  },
  {
    id: "n2",
    tag: "Event",
    tagColor: "secondary",
    date: "2026-07-15",
    title: "Free Community Checkup Week",
    excerpt: "Basic health screenings offered at no cost, open to all residents.",
    image: "https://picsum.photos/seed/news-checkup/300/300",
  },
  {
    id: "n3",
    tag: "Update",
    tagColor: "accent",
    date: "2026-07-02",
    title: "Extended Outpatient Hours",
    excerpt: "Outpatient services now open until 8 PM on weekdays.",
    image: "https://picsum.photos/seed/news-hours/300/300",
  },
  {
    id: "n4",
    tag: "Announcement",
    tagColor: "primary",
    date: "2026-06-20",
    title: "New Cardiology Specialist Joins Our Team",
    excerpt: "Dr. Elena Cruz now sees patients Tuesdays through Saturdays.",
    image: "https://picsum.photos/seed/news-cardio/300/300",
  },
];

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

export default function NewsSection({ news = defaultNews }) {
  const featured = news.find((n) => n.featured) || news[0];
  const rest = news.filter((n) => n.id !== featured.id).slice(0, 3);

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
                key={item.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 rounded-xl border border-border p-3 bg-cream/40"
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
      </div>
    </section>
  );
}
