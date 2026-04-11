import type { ReactNode } from "react"

type InfoCardProps = {
  title: string
  badge?: string
  children: ReactNode
}

export function InfoCard({ title, badge, children }: InfoCardProps) {
  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title">{title}</h2>
          {badge ? <div className="badge badge-accent">{badge}</div> : null}
        </div>
        {children}
      </div>
    </section>
  )
}
