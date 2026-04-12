"use client"

import { FcLike, FcLikePlaceholder } from "react-icons/fc"
import { MdBookmark, MdBookmarkBorder } from "react-icons/md"

import { useStoryPreferences } from "./story-preference-provider"

type StoryActionButtonsProps = {
  storyId: string
  likesCount?: number
  compact?: boolean
  showBookmark?: boolean
  showLike?: boolean
}

export function StoryActionButtons({
  storyId,
  likesCount = 0,
  compact = false,
  showBookmark = true,
  showLike = true,
}: StoryActionButtonsProps) {
  const { isBookmarked, isLiked, toggleBookmark, toggleLike } =
    useStoryPreferences()

  const liked = isLiked(storyId)
  const bookmarked = isBookmarked(storyId)

  return (
    <div className={`flex ${compact ? "gap-2" : "gap-3"}`}>
      {showLike ? (
        <button
          type="button"
          className={`flex items-center ${compact ? "text-2xl" : "gap-2 rounded-full   px-4 py-2 text-base"}`}
          onClick={() => toggleLike(storyId)}
        >
          {liked ? <FcLike /> : <FcLikePlaceholder />}
          {compact ? null : (
            <span>
              {liked ? "いいね済み" : "いいね"} {likesCount + (liked ? 1 : 0)}
            </span>
          )}
        </button>
      ) : null}

      {showBookmark ? (
        <button
          type="button"
          className={`flex items-center ${compact ? "text-2xl" : "gap-2 rounded-full   px-4 py-2 text-base"}`}
          onClick={() => toggleBookmark(storyId)}
        >
          {bookmarked ? <MdBookmark /> : <MdBookmarkBorder />}
          {compact ? null : (
            <span>{bookmarked ? "保存済み" : "ブックマーク"}</span>
          )}
        </button>
      ) : null}
    </div>
  )
}
