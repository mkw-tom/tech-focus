"use client"

import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

type StoryPreferenceContextValue = {
  bookmarks: string[]
  isBookmarked: (storyId: string) => boolean
  isLiked: (storyId: string) => boolean
  likes: string[]
  toggleBookmark: (storyId: string) => void
  toggleLike: (storyId: string) => void
}

const StoryPreferenceContext = createContext<
  StoryPreferenceContextValue | undefined
>(undefined)

const storageKeys = {
  bookmarks: "tech-focus:bookmarks",
  likes: "tech-focus:likes",
}

function readStoredIds(key: string) {
  try {
    const value = window.localStorage.getItem(key)

    if (!value) {
      return []
    }

    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string")
      : []
  } catch {
    return []
  }
}

type StoryPreferenceProviderProps = {
  children: ReactNode
}

export function StoryPreferenceProvider({
  children,
}: StoryPreferenceProviderProps) {
  const [likes, setLikes] = useState<string[]>([])
  const [bookmarks, setBookmarks] = useState<string[]>([])

  useEffect(() => {
    setLikes(readStoredIds(storageKeys.likes))
    setBookmarks(readStoredIds(storageKeys.bookmarks))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKeys.likes, JSON.stringify(likes))
  }, [likes])

  useEffect(() => {
    window.localStorage.setItem(
      storageKeys.bookmarks,
      JSON.stringify(bookmarks),
    )
  }, [bookmarks])

  const value = useMemo<StoryPreferenceContextValue>(
    () => ({
      bookmarks,
      isBookmarked: (storyId) => bookmarks.includes(storyId),
      isLiked: (storyId) => likes.includes(storyId),
      likes,
      toggleBookmark: (storyId) => {
        setBookmarks((current) =>
          current.includes(storyId)
            ? current.filter((item) => item !== storyId)
            : [...current, storyId],
        )
      },
      toggleLike: (storyId) => {
        setLikes((current) =>
          current.includes(storyId)
            ? current.filter((item) => item !== storyId)
            : [...current, storyId],
        )
      },
    }),
    [bookmarks, likes],
  )

  return (
    <StoryPreferenceContext.Provider value={value}>
      {children}
    </StoryPreferenceContext.Provider>
  )
}

export function useStoryPreferences() {
  const context = useContext(StoryPreferenceContext)

  if (!context) {
    throw new Error(
      "useStoryPreferences must be used within StoryPreferenceProvider",
    )
  }

  return context
}
