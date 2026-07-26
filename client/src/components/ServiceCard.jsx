import Card from './Card.jsx'

/**
 * ServiceCard
 * Displays a single hospital service using the generic Card component.
 * Props:
 *   service – { code, name, description } from the API
 */
export default function ServiceCard({ service }) {
  return (
    <Card eyebrow={service.code} title={service.name}>
      {service.description}
    </Card>
  )
}
