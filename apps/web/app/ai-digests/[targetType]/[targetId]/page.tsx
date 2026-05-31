import { aiDigestRouteParamsSchema } from "@tech-focus/shared"
import { notFound } from "next/navigation"
import { AppShell } from "../../../_components/app-shell"
import { InfoCard } from "../../../_components/info-card"
import {
  getAiDigestDetail,
  getDashboardData,
} from "../../../_lib/dashboard-api"

type AiDigestDetailPageProps = {
  params: Promise<{
    targetType: string
    targetId: string
  }>
}

const targetTypeLabel = {
  versionUpdate: "Release",
  incident: "Incident",
} as const

function formatGeneratedAt(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("ja-JP", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}

export default async function AiDigestDetailPage({
  params,
}: AiDigestDetailPageProps) {
  const routeParams = aiDigestRouteParamsSchema.safeParse(await params)

  if (!routeParams.success) {
    notFound()
  }

  const dashboard = await getDashboardData()
  const digest = await getAiDigestDetail(routeParams.data).catch(() => null)

  if (!digest) {
    notFound()
  }

  return (
    <AppShell
      currentPath=""
      navItems={dashboard.navItems}
      trackedTopics={dashboard.trackableTechnologies}
      typeFilters={dashboard.topicFilters}
    >
      <section className="rounded-[2rem] bg-base-100 p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <span className="badge badge-primary badge-outline">AI Briefing</span>
          <span className="badge badge-neutral">
            {targetTypeLabel[digest.targetType]}
          </span>
          {digest.importance ? (
            <span className="badge badge-accent badge-outline">
              {digest.importance}
            </span>
          ) : null}
          <span className="text-sm text-base-content/45">
            {formatGeneratedAt(digest.generatedAt)}
          </span>
        </div>

        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight">
          {digest.title}
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-base-content/72">
          {digest.summary}
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="space-y-4">
          {digest.detailedReport ? (
            <InfoCard title="Detailed Report">
              <p className="whitespace-pre-line text-sm leading-8 text-base-content/75">
                {digest.detailedReport}
              </p>
            </InfoCard>
          ) : null}

          <InfoCard title="変更内容">
            <p className="text-sm leading-8 text-base-content/75">
              {digest.changedContent ?? digest.summary}
            </p>
          </InfoCard>

          <InfoCard title="実務影響">
            <p className="text-sm leading-8 text-base-content/75">
              {digest.detailedImpact ??
                digest.shortImpact ??
                "詳細な実務影響は未生成です。"}
            </p>
          </InfoCard>

          <InfoCard title="Investigation Memo">
            <p className="text-sm leading-8 text-base-content/75">
              {digest.investigationMemo ??
                digest.recommendedAction ??
                "追加調査メモは未生成です。"}
            </p>
          </InfoCard>
        </section>

        <aside className="space-y-4">
          <InfoCard title="推奨アクション">
            <p className="text-sm leading-7 text-base-content/75">
              {digest.recommendedAction ?? "推奨アクションは未生成です。"}
            </p>
          </InfoCard>

          <InfoCard title="Affected Audience">
            <p className="text-sm leading-7 text-base-content/75">
              {digest.affectedAudience ?? "対象範囲は未生成です。"}
            </p>
          </InfoCard>

          <InfoCard title="Source Information">
            <div className="space-y-3 text-sm text-base-content/70">
              {digest.sourceUrl ? (
                <a
                  href={digest.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl bg-base-200 px-4 py-3 transition hover:bg-base-300/70"
                >
                  <span>{digest.sourceName ?? "Source"}</span>
                  <span className="text-base-content/45">Open</span>
                </a>
              ) : null}
              {digest.sourcePublishedAt ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-base-200 px-4 py-3">
                  <span>publishedAt</span>
                  <span className="text-right">
                    {formatGeneratedAt(digest.sourcePublishedAt)}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-base-200 px-4 py-3">
                <span>targetType</span>
                <span className="font-semibold">{digest.targetType}</span>
              </div>
              <div className="rounded-2xl bg-base-200 px-4 py-3">
                <p className="text-xs uppercase text-base-content/45">
                  targetId
                </p>
                <p className="mt-1 break-all font-mono text-xs">
                  {digest.targetId}
                </p>
              </div>
            </div>
          </InfoCard>
        </aside>
      </div>
    </AppShell>
  )
}
