import type { TrackableTechnology, VersionUpdate } from "../_data/dashboard"
import { AiDigestPanel } from "./ai-digest-panel"

type VersionUpdateCardProps = {
  item: VersionUpdate
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

function getImportanceLabel(importance: number) {
  if (importance >= 5) {
    return "high"
  }

  if (importance >= 3) {
    return "medium"
  }

  return "normal"
}

export function VersionUpdateCard({
  item,
  trackedTopics,
}: VersionUpdateCardProps) {
  const topic = trackedTopics.find(
    (trackedTopic) => trackedTopic.id === item.topic,
  )

  return (
    <article className="card bg-base-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="card-body gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="badge badge-primary">アップデート</div>
          <div className="badge badge-outline">{topic?.name ?? item.topic}</div>
          <div className="badge badge-accent badge-outline">
            {getImportanceLabel(item.importance)}
          </div>
          <span className="text-base-content/50">{item.sourceName}</span>
          <span className="text-base-content/40">
            {formatPublishedAt(item.publishedAt)}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold leading-snug">{item.title}</h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              {item.version}
            </span>
          </div>

          <p className="text-base leading-7 text-base-content/68 line-clamp-4">
            {item.rawContent || "Release note の本文はありません。"}
          </p>
        </div>

        <AiDigestPanel targetType="versionUpdate" targetId={item.id} />

        <div className="card-actions justify-end">
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary px-3"
          >
            Release を見る
          </a>
        </div>
      </div>
    </article>
  )
}
