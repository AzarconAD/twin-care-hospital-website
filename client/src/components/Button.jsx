import { Link } from 'react-router-dom'

export default function Button({ to, variant = 'primary', children, ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-md px-6 py-3 text-base font-semibold transition-colors'
  const styles = {
    primary: 'bg-accent text-cream hover:bg-accent/90',
    outline: 'border border-cream/40 text-cream hover:bg-cream/10',
  }
  
  const { className: customClassName, ...restProps } = props
  
  let className = ''
  if (variant === 'secondary') {
    className = `${base} secondary-button ${customClassName || ''}`.trim()
  } else {
    className = `${base} ${styles[variant]} ${customClassName || ''}`.trim()
  }

  const content = variant === 'secondary' ? <span className="inline-flex items-center justify-center">{children}</span> : children

  if (to) {
    return (
      <Link to={to} className={className} {...restProps}>
        {content}
      </Link>
    )
  }

  return (
    <button className={className} {...restProps}>
      {content}
    </button>
  )
}
