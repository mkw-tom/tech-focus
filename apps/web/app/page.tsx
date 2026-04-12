import { AppShell } from "./_components/app-shell"
import { HeroPanel } from "./_components/hero-panel"
import { HomeFeed } from "./_components/home-feed"
import { InfoCard } from "./_components/info-card"
import { SearchHeader } from "./_components/search-header"
import {
  defaultHomeTopicIds,
  marketPulse,
  topStories,
  topicFilters,
  trackableTechnologies,
} from "./_data/dashboard"

export default function HomePage() {
  return (
    <AppShell currentPath="/">
      <SearchHeader />
      {/* <HeroPanel metrics={marketPulse} /> */}

      <div className="pt-6 lg:pt-0">
        <HomeFeed
          stories={topStories}
          typeFilters={topicFilters}
          trackedTopics={trackableTechnologies}
          defaultTopicIds={defaultHomeTopicIds}
        />
      </div>
    </AppShell>
  )
}
