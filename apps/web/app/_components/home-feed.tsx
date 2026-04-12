"use client"

import { useMemo, useState } from "react"
import type {
  Story,
  Topic,
  TrackableTechnology,
  VersionUpdate,
} from "../_data/dashboard"
import { StoryCard } from "./story-card"
import { TopicFilterBar } from "./topic-filter-bar"
import { VersionUpdateCard } from "./version-update-card"

type HomeFeedProps = {
  stories: Story[]
  typeFilters: Topic[]
  trackedTopics: TrackableTechnology[]
  defaultTopicIds: string[]
  versionUpdates: VersionUpdate[]
}

export function HomeFeed({
  stories,
  typeFilters,
  trackedTopics,
  defaultTopicIds,
  versionUpdates,
}: HomeFeedProps) {
  const [selectedType, setSelectedType] = useState(typeFilters[0]?.label ?? "")
  const [selectedTopicIds, setSelectedTopicIds] =
    useState<string[]>(defaultTopicIds)

  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesType = story.kind === selectedType
      const matchesTopic = story.topicIds.some((topicId) =>
        selectedTopicIds.includes(topicId),
      )

      return matchesType && matchesTopic
    })
  }, [selectedTopicIds, selectedType, stories])

  const visibleTopics = trackedTopics.filter((topic) => topic.selected)
  const filteredVersionUpdates = useMemo(() => {
    return versionUpdates.filter((item) =>
      selectedTopicIds.includes(item.topic),
    )
  }, [selectedTopicIds, versionUpdates])

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
      <TopicFilterBar
        items={typeFilters}
        activeId={
          typeFilters.find((filter) => filter.label === selectedType)?.id ?? ""
        }
        onSelect={(id) => {
          const next = typeFilters.find((filter) => filter.id === id)
          if (next) {
            setSelectedType(next.label)
          }
        }}
      />

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
              className={`rounded-full btn btn-sm px-3 ${
                selectedTopicIds.includes(topic.id)
                  ? "btn-primary"
                  : "btn-ghost  "
              }`}
              onClick={() => toggleTopic(topic.id)}
            >
              {topic.name}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {selectedType === "アップデート" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-primary/70">
                  Version Updates
                </p>
                <h2 className="mt-2 text-xl font-bold">
                  GitHub Releases から取得した更新情報
                </h2>
              </div>
              <span className="text-sm text-base-content/50">
                {filteredVersionUpdates.length} items
              </span>
            </div>

            {filteredVersionUpdates.length > 0 ? (
              filteredVersionUpdates.map((item) => (
                <VersionUpdateCard
                  key={item.externalId}
                  item={item}
                  trackedTopics={trackedTopics}
                />
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 p-8 text-center text-sm text-base-content/60">
                まだ version update が同期されていません。job
                実行後にここへ表示されます。
              </div>
            )}
          </div>
        )}

        {filteredStories.length > 0 ? (
          filteredStories.map((story) => (
            <StoryCard key={`${story.kind}-${story.title}`} story={story} />
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 p-8 text-center text-sm text-base-content/60">
            条件に一致する記事がありません。記事の種類かトピック選択を変更してください。
          </div>
        )}
      </section>
    </div>
  )
}
