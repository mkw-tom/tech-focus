import type { TrackableTechnology, TrendItem } from "../_data/dashboard"

type TrendItemCardProps = {
  item: TrendItem
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

function getSourceLabel(source: TrendItem["source"]) {
  switch (source) {
    case "hn":
      return "Hacker News"
    case "github":
      return "GitHub"
    case "qiita":
      return "Qiita"
  }
}

export function TrendItemCard({ item, trackedTopics }: TrendItemCardProps) {
  const topic = trackedTopics.find(
    (trackedTopic) => trackedTopic.id === item.tech,
  )

  return (
    <article className="card bg-base-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="card-body gap-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="badge badge-success badge-outline">トレンド</div>
          <div className="badge badge-outline">{topic?.name ?? item.tech}</div>
          <div className="badge badge-neutral badge-outline">
            {getSourceLabel(item.source)}
          </div>
          {/* <div className="badge badge-accent">{item.score}</div> */}
          {item.author ? (
            <span className="text-base-content/50">@{item.author}</span>
          ) : null}
          <span className="text-base-content/40">
            {formatPublishedAt(item.publishedAt)}
          </span>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-bold leading-snug">{item.title}</h2>
          <p className="text-base leading-7 text-base-content/68 line-clamp-5">
            {item.summary ?? item.rawText ?? "Trend item の本文はありません。"}
          </p>
        </div>

        <div className="card-actions justify-end">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="btn btn-success px-3 text-white"
          >
            元記事を見る
          </a>
        </div>
      </div>
    </article>
  )
}
