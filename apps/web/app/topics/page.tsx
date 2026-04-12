import { AppShell } from "../_components/app-shell"
import { InfoCard } from "../_components/info-card"
import { getDashboardData } from "../_lib/dashboard-api"
import { TechSelectionForm } from "./_components/tech-selection-form"

export default async function TopicsPage() {
  const dashboard = await getDashboardData()

  return (
    <AppShell
      currentPath="/topics"
      navItems={dashboard.navItems}
      trackedTopics={dashboard.trackableTechnologies}
      typeFilters={dashboard.topicFilters}
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <TechSelectionForm items={dashboard.trackableTechnologies} />

        <aside className="space-y-4">
          <InfoCard title="Selection Rules" badge="Draft">
            <ul className="space-y-3 text-sm leading-7 text-base-content/75">
              <li>選択した技術だけ feed と summary の生成対象にします。</li>
              <li>
                リリース、公式 docs、ブログ、GitHub を技術ごとに束ねます。
              </li>
              <li>今後はここに優先度や通知頻度も追加できます。</li>
            </ul>
          </InfoCard>

          <InfoCard title="Current Defaults">
            <div className="space-y-3 text-sm text-base-content/75">
              <div className="rounded-2xl bg-base-200 px-4 py-3">
                まずは `Next.js`、`React`、`TypeScript`、`OpenAI API`、`Hono`
                を初期選択にしています。
              </div>
              <div className="rounded-2xl bg-base-200 px-4 py-3">
                後続では API 側に保存処理を追加して、実際の watchlist
                と連動させます。
              </div>
            </div>
          </InfoCard>
        </aside>
      </div>
    </AppShell>
  )
}
