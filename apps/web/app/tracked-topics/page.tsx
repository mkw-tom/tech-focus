import { AppShell } from "../_components/app-shell"
import { InfoCard } from "../_components/info-card"
import { StoryCard } from "../_components/story-card"
import { getDashboardData } from "../_lib/dashboard-api"

export default async function TrackedTopicsPage() {
  const dashboard = await getDashboardData()
  const trackedTopics = dashboard.trackableTechnologies.filter(
    (item) => item.selected,
  )

  return (
    <AppShell
      currentPath="/tracked-topics"
      navItems={dashboard.navItems}
      trackedTopics={dashboard.trackableTechnologies}
      typeFilters={dashboard.topicFilters}
    >
      <section className="rounded-[2rem]   bg-base-100 p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-primary/70">
          Tracked Topics
        </p>
        <h1 className="mt-3 text-4xl font-black">技術ごとの記事一覧</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-base-content/70">
          サイドバーで選んでいる技術トピックごとに、関連する記事をまとめて表示します。
          今後はここに更新件数、未読、重要度などの集約情報を追加できます。
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-8">
          {trackedTopics.map((topic) => {
            const stories = dashboard.topStories.filter((story) =>
              story.topicIds.includes(topic.id),
            )

            return (
              <section
                key={topic.id}
                id={topic.id}
                className="space-y-4 scroll-mt-8"
              >
                <div className="flex flex-col gap-2 rounded-[1.5rem]   bg-base-200/40 p-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">{topic.name}</h2>
                    <span className="badge badge-outline">{topic.group}</span>
                    <span className="badge badge-primary badge-outline">
                      {topic.category}
                    </span>
                  </div>
                  <p className="text-sm leading-7 text-base-content/70">
                    {topic.description}
                  </p>
                </div>

                {stories.length > 0 ? (
                  <div className="space-y-4">
                    {stories.map((story) => (
                      <StoryCard
                        key={`${topic.id}-${story.title}`}
                        story={story}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 text-sm text-base-content/60">
                    このトピックに紐づく記事はまだありません。
                  </div>
                )}
              </section>
            )
          })}
        </section>

        <aside className="space-y-4">
          <InfoCard
            title="Topics Overview"
            badge={`${trackedTopics.length} tracked`}
          >
            <div className="space-y-3 text-sm text-base-content/75">
              {trackedTopics.map((topic) => {
                const count = dashboard.topStories.filter((story) =>
                  story.topicIds.includes(topic.id),
                ).length

                return (
                  <a
                    key={topic.id}
                    href={`#${topic.id}`}
                    className="flex items-center justify-between rounded-2xl bg-base-200 px-4 py-3 transition hover:bg-base-300/70"
                  >
                    <span>{topic.name}</span>
                    <span className="text-base-content/55">
                      {count} articles
                    </span>
                  </a>
                )
              })}
            </div>
          </InfoCard>
        </aside>
      </div>
    </AppShell>
  )
}
