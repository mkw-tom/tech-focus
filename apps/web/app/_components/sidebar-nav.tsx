import Link from "next/link"

import type { NavItem } from "../_data/dashboard"

type SidebarNavProps = {
  currentPath: string
  items: NavItem[]
}

export function SidebarNav({ currentPath, items }: SidebarNavProps) {
  return (
    <nav className="menu gap-2 rounded-box bg-base-100/40 p-2">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={
            currentPath === item.href
              ? "active rounded-2xl font-medium"
              : "rounded-2xl font-medium text-base-content/70"
          }
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
