import { notFound } from "next/navigation"

import { AppShell } from "../../_components/app-shell"
import { InfoCard } from "../../_components/info-card"
import {
  getDashboardData,
  getIncidents,
  getVersionUpdates,
} from "../../_lib/dashboard-api"
import { ArticleTypeFeed } from "./article-type-feed"

const articleTypeMap = {
  update: "アップデート",
  incident: "インシデント",
} as const

type ArticleTypePageProps = {
  params: Promise<{
    type: string
  }>
}

export default async function ArticleTypePage({
  params,
}: ArticleTypePageProps) {
  const dashboard = await getDashboardData()
  const { type } = await params
  const selectedType = articleTypeMap[type as keyof typeof articleTypeMap]

  if (!selectedType) {
    notFound()
  }

  const stories = dashboard.topStories.filter(
    (story) => story.kind === selectedType,
  )
  const relatedTopics = dashboard.trackableTechnologies.filter((topic) =>
    stories.some((story) => story.topicIds.includes(topic.id)),
  )
  const defaultTopicIds = (
    selectedType === "アップデート"
      ? dashboard.trackableTechnologies.filter((item) => item.selected)
      : selectedType === "インシデント"
        ? dashboard.trackableTechnologies.filter((item) => item.selected)
        : relatedTopics
  ).map((item) => item.id)
  const incidents =
    selectedType === "インシデント" ? await getIncidents(defaultTopicIds) : []
  const versionUpdates =
    selectedType === "アップデート"
      ? await getVersionUpdates(defaultTopicIds)
      : []
  const relatedDisplayTopics =
    selectedType === "アップデート"
      ? dashboard.trackableTechnologies.filter((topic) =>
          defaultTopicIds.includes(topic.id),
        )
      : relatedTopics

  return (
    <AppShell
      currentPath={`/article-types/${type}`}
      navItems={dashboard.navItems}
      trackedTopics={dashboard.trackableTechnologies}
      typeFilters={dashboard.topicFilters}
    >
      <section className="rounded-4xl   bg-base-100 p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-primary/70">
          Article Type
        </p>
        <h1 className="mt-3 text-4xl font-black">{selectedType}の記事一覧</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-base-content/70">
          {selectedType}{" "}
          に分類した記事だけを一覧表示しています。ホームのフィードで
          切り替えていた内容を、個別ページとして直接参照できるようにしています。
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ArticleTypeFeed
          defaultTopicIds={defaultTopicIds}
          incidents={incidents}
          stories={stories}
          trackedTopics={dashboard.trackableTechnologies}
          type={type as "update" | "incident"}
          versionUpdates={versionUpdates}
        />

        <aside className="space-y-4">
          <InfoCard
            title="Related Topics"
            badge={`${relatedDisplayTopics.length} topics`}
          >
            <div className="space-y-3 text-sm text-base-content/75">
              {relatedDisplayTopics.map((topic) => (
                <a
                  key={topic.id}
                  href={`/tracked-topics#${topic.id}`}
                  className="flex items-center justify-between rounded-2xl bg-base-200 px-4 py-3 transition hover:bg-base-300/70"
                >
                  <span>{topic.name}</span>
                  <span className="text-base-content/55">{topic.group}</span>
                </a>
              ))}
            </div>
          </InfoCard>
        </aside>
      </div>
    </AppShell>
  )
}
