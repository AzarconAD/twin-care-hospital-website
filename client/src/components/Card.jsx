export default function Card({ eyebrow, title, children }) {
  return (
    <div className="rounded-lg border border-primary/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-wide text-secondary">{eyebrow}</p>
      )}
      <h3 className="mt-1 font-display text-xl font-semibold text-primary">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-ink/80">{children}</div>
    </div>
  )
}
