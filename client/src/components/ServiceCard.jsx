import Card from './Card.jsx'

export default function ServiceCard({ service }) {
  return (
    <Card eyebrow={service.code} title={service.name}>
      {service.description}
    </Card>
  )
}
