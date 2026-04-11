import { AppShell } from "../_components/app-shell"
import { InfoCard } from "../_components/info-card"
import { SearchHeader } from "../_components/search-header"
import { StoryCard } from "../_components/story-card"
import { searchStories } from "../_data/dashboard"

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams
  const query = q.trim()
  const stories = searchStories(query)

  return (
    <AppShell currentPath="">
      <SearchHeader
        initialQuery={query}
        tabs={["Search Results", "Latest", "Research"]}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-4">
          <div className="rounded-[2rem] border border-base-300 bg-base-100 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-primary/70">
              Search
            </p>
            <h1 className="mt-3 text-4xl font-black">検索結果</h1>
            <p className="mt-4 text-sm leading-7 text-base-content/70">
              {query
                ? `「${query}」に一致した記事を表示しています。`
                : "キーワードを入力して記事を検索してください。"}
            </p>
          </div>

          {query ? (
            stories.length > 0 ? (
              stories.map((story) => (
                <StoryCard key={`${story.kind}-${story.id}`} story={story} />
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-100 p-8 text-center text-sm text-base-content/60">
                一致する記事がありませんでした。別のキーワードで試してください。
              </div>
            )
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-base-300 bg-base-100 p-8 text-center text-sm text-base-content/60">
              例: `Next.js`, `インシデント`, `OpenAI API`
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <InfoCard title="Search Scope" badge={`${stories.length} hits`}>
            <ul className="space-y-3 text-sm leading-7 text-base-content/75">
              <li>タイトル</li>
              <li>概要</li>
              <li>記事の種類</li>
              <li>カテゴリ</li>
              <li>詳細の overview / key points</li>
            </ul>
          </InfoCard>
        </aside>
      </div>
    </AppShell>
  )
}
