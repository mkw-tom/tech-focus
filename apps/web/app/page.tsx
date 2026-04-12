import { AppShell } from "./_components/app-shell"
import { HeroPanel } from "./_components/hero-panel"
import { HomeFeed } from "./_components/home-feed"
import { InfoCard } from "./_components/info-card"
import { SearchHeader } from "./_components/search-header"
import { getDashboardData } from "./_lib/dashboard-api"

export default async function HomePage() {
  const dashboard = await getDashboardData()
  const defaultHomeTopicIds = dashboard.trackableTechnologies
    .filter((item) => item.selected)
    .map((item) => item.id)

  return (
    <AppShell
      currentPath="/"
      navItems={dashboard.navItems}
      trackedTopics={dashboard.trackableTechnologies}
      typeFilters={dashboard.topicFilters}
    >
      <SearchHeader />
      {/* <HeroPanel metrics={dashboard.marketPulse} /> */}

      <div className="pt-6 lg:pt-0">
        <HomeFeed
          stories={dashboard.topStories}
          typeFilters={dashboard.topicFilters}
          trackedTopics={dashboard.trackableTechnologies}
          defaultTopicIds={defaultHomeTopicIds}
        />
      </div>
    </AppShell>
  )
}
