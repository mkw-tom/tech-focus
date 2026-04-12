"use client"

import { UserButton } from "@neondatabase/auth/react/ui"
import Link from "next/link"
import { useState } from "react"
import type { ReactNode } from "react"
import type { NavItem, Topic, TrackableTechnology } from "../_data/dashboard"
import { SidebarNav } from "./sidebar-nav"
import { TopicBadges } from "./topic-badges"

type AppShellClientProps = {
  children: ReactNode
  currentPath: string
  navItems: NavItem[]
  trackedTopics: TrackableTechnology[]
  typeFilters: Topic[]
  userName: string
  authEnabled: boolean
  signedIn: boolean
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
  navItems: NavItem[]
}

function SidebarSections({
  articleTypeLinks,
  currentPath,
  trackedTopicLinks,
  navItems,
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
    </>
  )
}

function HeaderActions({
  authEnabled,
  signedIn,
}: {
  authEnabled: boolean
  signedIn: boolean
}) {
  if (!authEnabled) {
    return (
      <span className="rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-xs text-warning">
        Auth not configured
      </span>
    )
  }

  if (signedIn) {
    return <UserButton />
  }

  return (
    <Link
      href="/auth/sign-in"
      className="btn btn-sm   bg-base-100 text-base-content"
    >
      Sign in
    </Link>
  )
}

export function AppShellClient({
  children,
  currentPath,
  navItems,
  trackedTopics,
  typeFilters,
  userName,
  authEnabled,
  signedIn,
}: AppShellClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true)
  const trackedTopicLinks = trackedTopics
    .filter((item) => item.selected)
    .map((item) => ({
      id: item.id,
      label: item.name,
      href: `/tracked-topics#${item.id}`,
    }))

  const articleTypeLinks = typeFilters.map((item) => ({
    id: item.id,
    label: item.label,
    href: `/article-types/${item.id}`,
  }))

  return (
    <main className="min-h-screen bg-base-100 text-base-content">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl gap-6 px-4 py-4 lg:px-6">
        <div className="fixed inset-x-4 top-4 z-50 md:hidden">
          <div className="flex items-center justify-between rounded-2xl   bg-base-100/95 px-4 py-3 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-sm font-black text-primary-content">
                TF
              </div>
              {/* <div>
                <p className="text-xs uppercase tracking-[0.24em] text-base-content/50">
                  beta
                </p>
                <p className="text-sm font-semibold">{userName}</p>
              </div> */}
            </div>

            <div className="flex items-center gap-2">
              <HeaderActions authEnabled={authEnabled} signedIn={signedIn} />
              <button
                type="button"
                aria-expanded={isMobileMenuOpen}
                aria-label="メニューを開く"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
                className="btn btn-sm   bg-base-100 px-2 text-base-content"
              >
                Menu
              </button>
            </div>
          </div>

          <div
            className={`mt-3 origin-top overflow-hidden rounded-[2rem]   bg-base-100 p-5 shadow-2xl transition-all duration-300 ease-out ${
              isMobileMenuOpen
                ? "max-h-[calc(100vh-7rem)] translate-y-0 opacity-100"
                : "pointer-events-none max-h-0 -translate-y-3 border-transparent p-0 opacity-0"
            }`}
          >
            <div className="flex max-h-[calc(100vh-7rem)] flex-col overflow-y-auto">
              <SidebarSections
                articleTypeLinks={articleTypeLinks}
                currentPath={currentPath}
                navItems={navItems}
                trackedTopicLinks={trackedTopicLinks}
              />
            </div>
          </div>
        </div>

        <aside className="hidden h-[calc(100vh-2rem)] w-64 shrink-0 overflow-y-auto rounded-[2rem]   bg-base-200/60 p-5 md:sticky md:top-4 md:flex md:flex-col">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div className="flex flex-col items-start gap-3">
              <div className="flex gap-5">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-lg font-black text-primary-content">
                  TF
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-base-content/50">
                    Tech focus
                  </p>
                  <p className="font-semibold ">Free</p>
                </div>
              </div>
              <HeaderActions authEnabled={authEnabled} signedIn={signedIn} />
            </div>
          </div>

          <SidebarSections
            articleTypeLinks={articleTypeLinks}
            currentPath={currentPath}
            navItems={navItems}
            trackedTopicLinks={trackedTopicLinks}
          />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6 pt-28 md:pt-0">
          {children}
        </div>
      </div>
    </main>
  )
}
