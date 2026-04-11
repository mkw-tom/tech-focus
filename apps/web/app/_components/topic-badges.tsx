import Link from "next/link"

type TopicBadgesProps = {
  items: Array<{
    id: string
    label: string
    href: string
  }>
}

export function TopicBadges({ items }: TopicBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="badge badge-outline badge-lg transition hover:border-primary hover:text-primary"
        >
          {item.label}
        </Link>
      ))}
    </div>
  )
}
