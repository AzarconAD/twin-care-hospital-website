import { Link } from 'react-router-dom'

export default function Button({ to, variant = 'primary', children, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold transition-colors'
  const styles = {
    primary: 'bg-accent text-cream hover:bg-accent/90',
    outline: 'border border-cream/40 text-cream hover:bg-cream/10',
  }
  const className = `${base} ${styles[variant]}`

  if (to) {
    return (
      <Link to={to} className={className} {...props}>
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
