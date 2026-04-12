import { AppShell } from "../_components/app-shell"
import { InfoCard } from "../_components/info-card"
import { StoryLibrary } from "../_components/story-library"
import { getDashboardData } from "../_lib/dashboard-api"

export default async function BookmarksPage() {
  const dashboard = await getDashboardData()

  return (
    <AppShell
      currentPath="/bookmarks"
      navItems={dashboard.navItems}
      trackedTopics={dashboard.trackableTechnologies}
      typeFilters={dashboard.topicFilters}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <StoryLibrary
          emptyMessage="ブックマークした記事はまだありません。スレッド右上やカード右上から保存できます。"
          mode="bookmarks"
          stories={dashboard.topStories}
          title="ブックマークした記事"
        />

        <aside className="space-y-4">
          <InfoCard title="How It Works" badge="Saved">
            <ul className="space-y-3 text-sm leading-7 text-base-content/75">
              <li>記事カード右上、またはスレッド右上から保存できます。</li>
              <li>保存状態はブラウザの localStorage に保持します。</li>
              <li>今後 API 保存に切り替えれば、端末をまたいで同期できます。</li>
            </ul>
          </InfoCard>
        </aside>
      </div>
    </AppShell>
  )
}
