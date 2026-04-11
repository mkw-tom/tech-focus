"use client"

import Link from "next/link"
import { useState } from "react"
import type { ReactNode } from "react"

import {
  navItems,
  topicFilters,
  trackableTechnologies,
} from "../_data/dashboard"
import { SidebarNav } from "./sidebar-nav"
import { TopicBadges } from "./topic-badges"

type AppShellProps = {
  children: ReactNode
  currentPath: string
}

type SidebarSectionProps = {
  articleTypeLinks: Array<{
    id: string
    label: string
    href: string
  }>
  currentPath: string
  trackedTopicLinks: Array<{
    id: string
    label: string
    href: string
  }>
}

function SidebarSections({
  articleTypeLinks,
  currentPath,
  trackedTopicLinks,
}: SidebarSectionProps) {
  return (
    <>
      <SidebarNav currentPath={currentPath} items={navItems} />

      <div className="mt-8 space-y-3">
        <Link
          href="/article-types/update"
          className="block text-xs uppercase tracking-[0.22em] text-base-content/40 transition hover:text-primary"
        >
          Article Types
        </Link>
        <TopicBadges items={articleTypeLinks} />
      </div>

      <div className="mt-8 space-y-3">
        <Link
          href="/tracked-topics"
          className="block text-xs uppercase tracking-[0.22em] text-base-content/40 transition hover:text-primary"
        >
          Tracked Topics
        </Link>
        <TopicBadges items={trackedTopicLinks} />
      </div>

      <div className="mt-auto rounded-[1.5rem] bg-primary/10 p-4">
        <p className="text-sm font-semibold">API connection</p>
        <p className="mt-2 text-sm text-base-content/70">
          Hono backend is available at `localhost:8787`.
        </p>
        <a
          className="btn btn-primary btn-sm mt-4 w-full"
          href="http://localhost:8787"
          target="_blank"
          rel="noreferrer"
        >
          Open API
        </a>
      </div>
    </>
  )
}

export function AppShell({ children, currentPath }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const trackedTopicLinks = trackableTechnologies
    .filter((item) => item.selected)
    .map((item) => ({
      id: item.id,
      label: item.name,
      href: `/tracked-topics#${item.id}`,
    }))

  const articleTypeLinks = topicFilters.map((item) => ({
    id: item.id,
    label: item.label,
    href: `/article-types/${item.id}`,
  }))

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-4 lg:px-6">
        <div className="fixed inset-x-4 top-4 z-50 lg:hidden">
          <div className="flex items-center justify-between rounded-2xl border border-base-300 bg-base-100/95 px-4 py-3 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-sm font-black text-primary-content">
                TF
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-base-content/50">
                  beta
                </p>
                <p className="text-sm font-semibold">ゲスト</p>
              </div>
            </div>

            <button
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-label="メニューを開く"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              className="btn btn-sm border border-base-300 px-2 text-sm bg-white"
            >
              Menu
            </button>
          </div>

          <div
            className={`mt-3 origin-top overflow-hidden rounded-[2rem] border border-base-300 bg-base-100 p-5 shadow-2xl transition-all duration-300 ease-out ${
              isMobileMenuOpen
                ? "max-h-[calc(100vh-7rem)] translate-y-0 opacity-100"
                : "pointer-events-none max-h-0 -translate-y-3 border-transparent p-0 opacity-0"
            }`}
          >
            <div className="flex max-h-[calc(100vh-7rem)] flex-col overflow-y-auto">
              <SidebarSections
                articleTypeLinks={articleTypeLinks}
                currentPath={currentPath}
                trackedTopicLinks={trackedTopicLinks}
              />
            </div>
          </div>
        </div>

        <aside className="hidden h-[calc(100vh-2rem)] w-64 shrink-0 overflow-y-auto rounded-[2rem] border border-base-300 bg-base-200/60 p-5 lg:sticky lg:top-4 lg:flex lg:flex-col">
          <div className="mb-8 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-lg font-black text-primary-content">
              TF
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-base-content/50">
                beta
              </p>
              <p className="text-lg font-semibold">ゲスト</p>
            </div>
          </div>

          <SidebarSections
            articleTypeLinks={articleTypeLinks}
            currentPath={currentPath}
            trackedTopicLinks={trackedTopicLinks}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6 pt-20 lg:pt-0">
          {children}
        </div>
      </div>
    </main>
  )
}
