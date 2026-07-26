import { Link } from 'react-router-dom'

/**
 * Reusable button. Renders a <Link> if `to` is passed (internal navigation),
 * otherwise a real <button> (e.g. for form submits).
 *
 * variant: "primary" | "outline"
 */
export default function Button({ to, variant = 'primary', children, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition-colors'
  const styles = {
    primary: 'bg-accent text-cream hover:bg-accent/90',
    outline: 'border border-cream/40 text-cream hover:bg-cream/10',
  }
  const className = `${base} ${styles[variant]}`

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}
