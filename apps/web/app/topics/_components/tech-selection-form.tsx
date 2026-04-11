"use client"

import { useMemo, useState } from "react"

import type { TrackableTechnology } from "../../_data/dashboard"

type TechSelectionFormProps = {
  items: TrackableTechnology[]
}

const groupOrder: TrackableTechnology["group"][] = [
  "言語",
  "フレームワーク",
  "ライブラリ",
  "ツール",
]

export function TechSelectionForm({ items }: TechSelectionFormProps) {
  const [query, setQuery] = useState("")
  const [selectedGroups, setSelectedGroups] =
    useState<TrackableTechnology["group"][]>(groupOrder)

  const toggleGroup = (group: TrackableTechnology["group"]) => {
    if (selectedGroups.length === 1 && selectedGroups.includes(group)) {
      // 最後の1つを外すのは防止
      return
    }
    setSelectedGroups((current) =>
      current.includes(group)
        ? current.filter((item) => item !== group)
        : [...current, group],
    )
  }

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const filteredItems = items.filter((item) => {
      const matchesGroup = selectedGroups.includes(item.group)
      const matchesQuery = normalizedQuery
        ? [item.name, item.group, item.category, item.description]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery)
        : true

      return matchesGroup && matchesQuery
    })

    return groupOrder
      .map((group) => ({
        group,
        items: filteredItems.filter((item) => item.group === group),
      }))
      .filter((section) => section.items.length > 0)
  }, [items, query, selectedGroups])

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-primary/70">
              Watchlist Setup
            </p>
            <h1 className="mt-2 text-3xl font-black">追いたい技術を選択する</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-base-content/70">
              チェックした技術だけをキャッチアップ対象にする想定です。後続では、
              ここで選んだ技術ごとに feed と briefing を絞り込みます。
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary bg-primary px-3 text-white"
          >
            内容を更新
          </button>
        </div>

        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-base-300 bg-base-200/35 p-4">
          <label className="input input-bordered flex items-center gap-3 rounded-2xl">
            <svg
              className="h-5 w-5 opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <title>Search technologies</title>
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>
            <input
              type="text"
              className="grow"
              placeholder="技術名、カテゴリ、説明で検索"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <div className="flex flex-wrap gap-2 text-sm text-base-content/70">
            {groupOrder.map((group) => (
              <label
                key={group}
                className="flex items-center gap-2 rounded-full border border-base-300 bg-base-100 px-3 py-2"
              >
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs checkbox-primary"
                  checked={selectedGroups.includes(group)}
                  onChange={() => toggleGroup(group)}
                />
                <span className="text-sm font-medium">{group}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {filteredGroups.map((section) => (
            <section key={section.group} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{section.group}</h2>
                <span className="text-sm text-base-content/50">
                  {section.items.length} items
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-4 rounded-[1.5rem] border border-base-300 bg-base-200/55 p-5 transition hover:border-primary/40 hover:bg-base-200"
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary mt-1"
                      defaultChecked={item.selected}
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold">
                          {item.name}
                        </span>
                        <span className="badge badge-outline">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          ))}

          {filteredGroups.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 p-8 text-center text-sm text-base-content/60">
              一致する技術がありません。検索語を変えてください。
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
