"use client"

import { useMemo, useState } from "react"
import { IncidentCard } from "../../_components/incident-card"
import { StoryCard } from "../../_components/story-card"
import { TrendItemCard } from "../../_components/trend-item-card"
import { VersionUpdateCard } from "../../_components/version-update-card"
import type {
  Incident,
  Story,
  TrackableTechnology,
  TrendItem,
  VersionUpdate,
} from "../../_data/dashboard"

type ArticleTypeFeedProps = {
  defaultTopicIds: string[]
  incidents: Incident[]
  stories: Story[]
  trends: TrendItem[]
  trackedTopics: TrackableTechnology[]
  type: "update" | "incident" | "trend"
  versionUpdates: VersionUpdate[]
}

export function ArticleTypeFeed({
  defaultTopicIds,
  incidents,
  stories,
  trends,
  trackedTopics,
  type,
  versionUpdates,
}: ArticleTypeFeedProps) {
  const [selectedTopicIds, setSelectedTopicIds] =
    useState<string[]>(defaultTopicIds)

  const visibleTopics = trackedTopics.filter((topic) => topic.selected)

  const filteredStories = useMemo(() => {
    return stories.filter((story) =>
      story.topicIds.some((topicId) => selectedTopicIds.includes(topicId)),
    )
  }, [selectedTopicIds, stories])

  const filteredVersionUpdates = useMemo(() => {
    return versionUpdates.filter((item) =>
      selectedTopicIds.includes(item.topic),
    )
  }, [selectedTopicIds, versionUpdates])
  const filteredIncidents = useMemo(() => {
    return incidents.filter((item) => selectedTopicIds.includes(item.topic))
  }, [incidents, selectedTopicIds])
  const filteredTrends = useMemo(() => {
    return trends.filter((item) => selectedTopicIds.includes(item.tech))
  }, [selectedTopicIds, trends])

  const toggleTopic = (topicId: string) => {
    if (selectedTopicIds.length === 1 && selectedTopicIds.includes(topicId)) {
      return
    }

    setSelectedTopicIds((current) =>
      current.includes(topicId)
        ? current.filter((item) => item !== topicId)
        : [...current, topicId],
    )
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">表示する技術トピック</h2>
          <span className="text-sm text-base-content/50">
            {selectedTopicIds.length} selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {visibleTopics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`btn btn-sm rounded-full px-3 ${
                selectedTopicIds.includes(topic.id)
                  ? "btn-primary"
                  : "btn-ghost"
              }`}
              onClick={() => toggleTopic(topic.id)}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {type === "update" ? (
          filteredVersionUpdates.length > 0 ? (
            filteredVersionUpdates.map((item) => (
              <VersionUpdateCard
                key={item.externalId}
                item={item}
                trackedTopics={trackedTopics}
              />
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 p-8 text-center text-sm text-base-content/60">
              条件に一致する version update がありません。topic
              の選択を変更してください。
            </div>
          )
        ) : type === "incident" ? (
          filteredIncidents.length > 0 ? (
            filteredIncidents.map((item) => (
              <IncidentCard
                key={item.externalId}
                item={item}
                trackedTopics={trackedTopics}
              />
            ))
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 p-8 text-center text-sm text-base-content/60">
              条件に一致する incident がありません。topic
              の選択を変更してください。
            </div>
          )
        ) : type === "trend" ? (
          filteredTrends.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-4">
                {filteredTrends.map((item) => (
                  <TrendItemCard
                    key={`${item.source}-${item.externalId}`}
                    item={item}
                    trackedTopics={trackedTopics}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 p-8 text-center text-sm text-base-content/60">
              条件に一致する trend がありません。topic
              の選択を変更してください。
            </div>
          )
        ) : filteredStories.length > 0 ? (
          filteredStories.map((story) => (
            <StoryCard key={`${story.kind}-${story.title}`} story={story} />
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 p-8 text-center text-sm text-base-content/60">
            条件に一致する記事がありません。topic の選択を変更してください。
          </div>
        )}
      </section>
    </div>
  )
}
