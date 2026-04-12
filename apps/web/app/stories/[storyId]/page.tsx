import { notFound } from "next/navigation"

import { AppShell } from "../../_components/app-shell"
import { InfoCard } from "../../_components/info-card"
import { StoryActionButtons } from "../../_components/story-action-buttons"
import { getDashboardData, getStoryById } from "../../_lib/dashboard-api"
import { ArticleChatPanel } from "../_components/article-chat-panel"

type StoryDetailPageProps = {
  params: Promise<{
    storyId: string
  }>
}

export default async function StoryDetailPage({
  params,
}: StoryDetailPageProps) {
  const { storyId } = await params
  const dashboard = await getDashboardData()
  const story =
    dashboard.topStories.find((item) => item.id === storyId) ??
    (await getStoryById(storyId))

  if (!story) {
    notFound()
  }

  const relatedTopics = dashboard.trackableTechnologies.filter((topic) =>
    story.topicIds.includes(topic.id),
  )

  return (
    <AppShell
      currentPath=""
      navItems={dashboard.navItems}
      trackedTopics={dashboard.trackableTechnologies}
      typeFilters={dashboard.topicFilters}
    >
      <section className="rounded-[2rem]   bg-base-100 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="badge badge-accent">{story.kind}</span>
            <span className="badge badge-primary badge-outline">
              {story.category}
            </span>
            <span className="text-sm text-base-content/50">{story.source}</span>
            <span className="text-sm text-base-content/40">{story.time}</span>
          </div>
          <StoryActionButtons
            storyId={story.id}
            compact
            showBookmark
            showLike={false}
          />
        </div>

        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight">
          {story.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-base-content/72">
          {story.details.overview}
        </p>
        <div className="mt-6">
          <StoryActionButtons
            storyId={story.id}
            likesCount={story.likes_count}
            showBookmark={false}
            showLike
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="space-y-4">
          <InfoCard title="Key Points">
            <ul className="space-y-3 text-sm leading-7 text-base-content/75">
              {story.details.keyPoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard title="Timeline">
            <div className="space-y-3">
              {story.details.timeline.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-base-200 px-4 py-3 text-sm text-base-content/75"
                >
                  {item}
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard title="Related Links">
            <div className="space-y-3">
              {story.details.relatedLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-2xl bg-base-200 px-4 py-3 text-sm transition hover:bg-base-300/70"
                >
                  <span>{link.label}</span>
                  <span className="text-base-content/45">Open</span>
                </a>
              ))}
            </div>
          </InfoCard>
        </section>

        <aside className="space-y-4">
          <ArticleChatPanel keyPoints={story.details.keyPoints} />
          <InfoCard
            title="Related Topics"
            badge={`${relatedTopics.length} topics`}
          >
            <div className="flex flex-wrap gap-2">
              {relatedTopics.map((topic) => (
                <a
                  key={topic.id}
                  href={`/tracked-topics#${topic.id}`}
                  className="badge badge-outline badge-lg transition hover:border-primary hover:text-primary"
                >
                  {topic.name}
                </a>
              ))}
            </div>
          </InfoCard>
        </aside>
      </div>
    </AppShell>
  )
}
