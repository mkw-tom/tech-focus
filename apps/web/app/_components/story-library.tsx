"use client"

import type { Story } from "../_data/dashboard"
import { StoryCard } from "./story-card"
import { useStoryPreferences } from "./story-preference-provider"

type StoryLibraryProps = {
  emptyMessage: string
  mode: "bookmarks" | "likes"
  stories: Story[]
  title: string
}

export function StoryLibrary({
  emptyMessage,
  mode,
  stories,
  title,
}: StoryLibraryProps) {
  const { bookmarks, likes } = useStoryPreferences()

  const selectedIds = mode === "bookmarks" ? bookmarks : likes
  const selectedStories = stories.filter((story) =>
    selectedIds.includes(story.id),
  )

  return (
    <section className="space-y-4">
      <div className="rounded-4xl   bg-base-100 p-6 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-primary/70">
          Story Library
        </p>
        <h1 className="mt-3 text-4xl font-black">{title}</h1>
        <p className="mt-4 text-sm leading-7 text-base-content/70">
          {selectedStories.length} 件の記事があります。
        </p>
      </div>

      {selectedStories.length > 0 ? (
        selectedStories.map((story) => (
          <StoryCard key={`${mode}-${story.id}`} story={story} />
        ))
      ) : (
        <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 text-center text-sm text-base-content/60">
          {emptyMessage}
        </div>
      )}
    </section>
  )
}
