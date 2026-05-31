import type { Incident, TrackableTechnology } from "../_data/dashboard"
import { AiDigestPanel } from "./ai-digest-panel"

type IncidentCardProps = {
  item: Incident
  trackedTopics: TrackableTechnology[]
}

function formatPublishedAt(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

function getSeverityTone(severity: string) {
  switch (severity.toLowerCase()) {
    case "critical":
      return "badge-error"
    case "high":
      return "badge-warning"
    case "moderate":
      return "badge-info"
    default:
      return "badge-ghost"
  }
}

export function IncidentCard({ item, trackedTopics }: IncidentCardProps) {
  const topic = trackedTopics.find(
    (trackedTopic) => trackedTopic.id === item.topic,
  )

  return (
    <article className="card bg-base-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="card-body gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="badge badge-error badge-outline">インシデント</div>
          <div className="badge badge-outline">{topic?.name ?? item.topic}</div>
          <div className={`badge ${getSeverityTone(item.severity)}`}>
            {item.severity}
          </div>
          {item.packageName ? (
            <div className="badge badge-neutral badge-outline">
              {item.packageName}
            </div>
          ) : null}
          <span className="text-base-content/50">{item.sourceName}</span>
          <span className="text-base-content/40">
            {formatPublishedAt(item.publishedAt)}
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold leading-snug">{item.title}</h2>
          <p className="text-base leading-7 text-base-content/68 line-clamp-5">
            {item.rawContent || "Advisory の本文はありません。"}
          </p>
        </div>

        <AiDigestPanel targetType="incident" targetId={item.id} tone="error" />

        <div className="card-actions justify-end">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-error px-3 text-white"
          >
            Advisory を見る
          </a>
        </div>
      </div>
    </article>
  )
}
