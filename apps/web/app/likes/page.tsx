import { AppShell } from "../_components/app-shell"
import { InfoCard } from "../_components/info-card"
import { StoryLibrary } from "../_components/story-library"
import { getDashboardData } from "../_lib/dashboard-api"

export default async function LikesPage() {
  const dashboard = await getDashboardData()

  return (
    <AppShell
      currentPath="/likes"
      navItems={dashboard.navItems}
      trackedTopics={dashboard.trackableTechnologies}
      typeFilters={dashboard.topicFilters}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <StoryLibrary
          emptyMessage="いいねした記事はまだありません。スレッドを開いてからいいねできます。"
          mode="likes"
          stories={dashboard.topStories}
          title="いいねした記事"
        />

        <aside className="space-y-4">
          <InfoCard title="How It Works" badge="Liked">
            <ul className="space-y-3 text-sm leading-7 text-base-content/75">
              <li>いいねはスレッド詳細ページでのみ操作できます。</li>
              <li>いいね状態はブラウザの localStorage に保持します。</li>
              <li>あとで関心度順の並び替えや推薦にも使えます。</li>
            </ul>
          </InfoCard>
        </aside>
      </div>
    </AppShell>
  )
}
