"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type SearchHeaderProps = {
  initialQuery?: string
  tabs?: string[]
}

type SearchFormProps = {
  onChange: (value: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  query: string
  showShortcut?: boolean
}

function SearchForm({
  onChange,
  onSubmit,
  query,
  showShortcut = true,
}: SearchFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <label className="input input-bordered flex h-14 w-full items-center gap-3 rounded-2xl">
        <svg
          className="h-5 w-5 opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <title>Search</title>
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
        <input
          type="search"
          className="grow"
          placeholder="Search topics, companies, market signals..."
          value={query}
          onChange={(event) => onChange(event.target.value)}
        />
        {showShortcut ? <kbd className="kbd kbd-sm">Enter</kbd> : null}
      </label>
    </form>
  )
}

export function SearchHeader({
  initialQuery = "",
  tabs: _tabs,
}: SearchHeaderProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      setIsMobileOpen(false)
      router.push("/")
      return
    }

    setIsMobileOpen(false)
    router.push(`/search?q=${encodeURIComponent(normalizedQuery)}`)
  }

  return (
    <>
      <header className="sticky top-0 z-20 hidden rounded-[2rem] border border-base-300 bg-base-100/75 px-4 py-4 shadow-sm backdrop-blur lg:block">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full lg:max-w-2xl">
            <SearchForm
              query={query}
              onChange={setQuery}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </header>

      <div className="fixed inset-x-4 top-20 z-40 flex justify-end lg:hidden">
        <div
          className={`flex items-center gap-3 overflow-hidden rounded-3xl mt-2 bg-base-100/95 shadow-xl backdrop-blur transition-all duration-300 ease-out ${
            isMobileOpen ? "w-full max-w-sm px-2 py-2" : "w-14 px-1.5 py-1.5"
          }`}
        >
          {isMobileOpen ? (
            <div className="min-w-0 flex-1">
              <SearchForm
                query={query}
                onChange={setQuery}
                onSubmit={handleSubmit}
                showShortcut={false}
              />
            </div>
          ) : null}

          <button
            type="button"
            aria-expanded={isMobileOpen}
            aria-label="検索を開く"
            onClick={() => setIsMobileOpen((current) => !current)}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content transition-transform duration-300 hover:scale-105"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <title>Search</title>
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}
