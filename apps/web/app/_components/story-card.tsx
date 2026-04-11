import Link from "next/link"
import { FcLike } from "react-icons/fc"

import type { Story } from "../_data/dashboard"
import { StoryActionButtons } from "./story-action-buttons"

type StoryCardProps = {
  story: Story
}

export function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="card-body gap-5 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="badge badge-accent">{story.kind}</div>
            <div className="badge badge-primary badge-outline">
              {story.category}
            </div>
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

        <div className="">
          <div>
            <h2 className="text-2xl font-bold leading-snug">{story.title}</h2>
            <p className="mt-3 text-base leading-7 text-base-content/68">
              {story.summary}
            </p>
          </div>

          {/* <div className="rounded-[1.5rem] bg-base-200 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-base-content/45">
              Why it matters
            </p>
            <p className="mt-3 text-sm leading-7 text-base-content/70">
              {story.whyItMatters}
            </p>
          </div> */}
        </div>

        <div className="card-actions justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-base-content/55">
            <FcLike />
            <span className="font-semibold text-base-content/80">
              {story.likes_count}
            </span>
            <span>likes</span>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/stories/${story.id}`}
              className="btn btn-primary bg-primary px-3 text-white"
            >
              スレッドを開く
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
