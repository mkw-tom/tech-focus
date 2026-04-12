import type { ReactNode } from "react"
import type { NavItem, Topic, TrackableTechnology } from "../_data/dashboard"
import { auth } from "../_lib/auth"
import { isNeonAuthConfigured } from "../_lib/auth-config"
import { AppShellClient } from "./app-shell-client"

type AppShellProps = {
  children: ReactNode
  currentPath: string
  navItems: NavItem[]
  trackedTopics: TrackableTechnology[]
  typeFilters: Topic[]
}

export async function AppShell({
  children,
  currentPath,
  navItems,
  trackedTopics,
  typeFilters,
}: AppShellProps) {
  const session = auth ? (await auth.getSession()).data : null

  return (
    <AppShellClient
      authEnabled={isNeonAuthConfigured}
      currentPath={currentPath}
      navItems={navItems}
      signedIn={Boolean(session?.user)}
      trackedTopics={trackedTopics}
      typeFilters={typeFilters}
      userName={session?.user?.name ?? "ゲスト"}
    >
      {children}
    </AppShellClient>
  )
}
